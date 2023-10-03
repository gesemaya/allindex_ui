import { getChainIdFromName } from '../constants/abi/chainInfo'
import { identify, init } from '@multibase/js'
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { useAccount, useNetwork, useWalletClient, useSwitchNetwork, PublicClient, usePublicClient } from 'wagmi'
import { useConfigContext } from './naked/ConfigContext'
import { useChainLoader } from '../route/RouteWrapper'
import { Account, WalletClient } from 'viem'

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

ReactGA.initialize([
  {
    trackingId: 'G-376154551',
    gaOptions: {},
    gtagOptions: {},
  },
])

export type WalletClientWithAccount = Omit<WalletClient, 'account'> & { account: Account }
interface NetworkContextProps {
  provider?: PublicClient
  signer?: WalletClientWithAccount
}

export const NetworkContext = createContext({} as NetworkContextProps)

export const NetworkContextProvider = ({ children }: { children: ReactElement }) => {
  const { chain } = useNetwork()
  const {
    features: { Telemetry },
  } = useConfigContext()

  const { isConnected } = useAccount()

  const { data: rawSigner } = useWalletClient()

  const [signer, setSigner] = useState<WalletClientWithAccount | undefined>(
    rawSigner && rawSigner.account ? rawSigner : undefined
  )

  useEffect(() => {
    if (rawSigner && rawSigner.account) {
      setSigner(rawSigner)
    }
  }, [rawSigner])

  const { switchNetwork } = useSwitchNetwork()
  const { chain: chainParam, chainID } = useChainLoader()

  try {
    init(Telemetry.multibase_key, {
      enabled: !!Telemetry.multibase_key,
      debug: false,
    })
  } catch (e) {
    window.log.log('failed to initiate multibase')
  }

  const provider = usePublicClient()

  useEffect(() => {
    if (!isConnected || !signer || !chain) {
      return
    }
    let referrer_url = document.referrer
    if (referrer_url === '') {
      referrer_url = 'https://oku.trade'
    }
    const url = new URL(referrer_url)
    const urlParams = new URLSearchParams(url.search)
    identify({
      type: 'address',
      address: signer.account.address,
      chain: chain.id,
      properties: {
        utm_id: urlParams.get('utm_id'),
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content'),
      },
    } as any)
    ReactGA.event({
      category: 'web3',
      action: 'wallet_connect',
    })
  }, [signer, isConnected, chain])

  useEffect(() => {
    if (chainParam) {
      const chainID = getChainIdFromName(chainParam)
      if (switchNetwork)
        if (chainID === 0) {
          switchNetwork(chain?.id)
        } else {
          switchNetwork(chainID)
        }
    }
  }, [chainParam, switchNetwork])

  return (
    <NetworkContext.Provider
      value={{
        provider,
        signer,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetworkContext = (): NetworkContextProps => {
  const context = useContext<NetworkContextProps>(NetworkContext)

  if (context === null) {
    throw new Error('"useNetworkContext" should be used inside a "NetworkContextProvider"')
  }

  return context
}
