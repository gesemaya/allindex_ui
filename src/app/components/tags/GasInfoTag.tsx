import gasLogoUrl from '@/app/assets/gas.webp'
import { T4 } from '../typography/Typography'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useNetworkContext } from '../../context/NetworkContext'
import { useRpcBlockContext } from '../../context/naked/RpcBlockContext'

function GasInfoTag({ fontSize, fontColor = '#7C85A2' }: { fontSize?: number; fontColor?: string }) {
  const { blockNumberByChain } = useRpcBlockContext()

  const [gas, setGas] = useState('')
  const { provider } = useNetworkContext()
  const { isConnected } = useAccount()
  useEffect(() => {
    if (provider) {
      provider.getGasPrice().then((res) => {
        setGas((parseFloat(res.toString()) / 10 ** 9).toFixed(2))
      })
    }
  }, [blockNumberByChain, provider])

  return (
    <div className="flex flex-row gap-1 items-center ">
      <img src={gasLogoUrl} alt="Gas" />
      {!isConnected && !provider ? (
        <T4 color={fontColor}>Please Connect Wallet</T4>
      ) : gas ? (
        <T4 color={fontColor} fontSize={fontSize}>
          {gas} Gwei
        </T4>
      ) : (
        <T4 color={fontColor} fontSize={fontSize}>
          loading
        </T4>
      )}
    </div>
  )
}

export default GasInfoTag
