import { GFX_RPC_URL, GFX_WS_URL } from '../constants/urls'
import { walletConnectProvider } from '@web3modal/wagmi'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { mainnet, moonbeam, zkSync } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { CHAINS_LIST } from '../constants/chainInfo'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// const { provider, webSocketProvider, chains } = configureChains(CHAINS_LIST, [
// //  walletConnectProvider({ projectId: 'a2d6e703c2d770f44d439f7fc431dc59' ,
// ])

// configure chains where you want to use the public provider if on goerli network
//

const projectId = '0ba768db4337c817602564a355370491'

const metadata = {
  name: 'Oku',
  description: 'Oku - The #1 Defi Interface',
  url: 'https://oku.trade',
  icons: ['https://oku.trade/favicon.ico'],
}
const theseChains = [...CHAINS_LIST]

const { chains, publicClient, webSocketPublicClient } = configureChains(
  theseChains,
  [
    jsonRpcProvider({
      rpc: (chain) => {
        let a = {
          [mainnet.id]: {
            http: GFX_RPC_URL,
            webSocket: GFX_WS_URL,
          },
          [moonbeam.id]: {
            webSocket: 'wss://moonbeam.api.onfinality.io/rpc?apikey=5bb783ce-69f9-4320-af26-1fc669e1f35e',
            http: 'https://moonbeam.api.onfinality.io/rpc?apikey=5bb783ce-69f9-4320-af26-1fc669e1f35e',
          },
          [zkSync.id]: {
            webSocket: 'wss://mainnet.era.zksync.io/ws',
            http: 'https://mainnet.era.zksync.io',
          },
        }[chain.id]
        return a ? a : null
      },
    }),
    walletConnectProvider({
      projectId,
    }),
    publicProvider(),
  ],
  { pollingInterval: 10_000 }
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } }),
  ],
  publicClient,
  webSocketPublicClient,
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    '--w3m-accent': '#4C82fb',
  },
})

export default wagmiConfig
