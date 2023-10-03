import { useChainLoader } from '../../route/RouteWrapper'
import { useRpcBlockContext } from '../../context/naked/RpcBlockContext'
import { useEffect, useState } from 'react'
import { useBlockNumber } from 'wagmi'

const BLOCK_COLORS = {
  API_DOWN: 'bg-red-500',
  DELAYED: 'bg-yellow-500',
  SYNCED: 'bg-green-500',
}

interface IBlockNumberTag {
  showText?: boolean
}

export const BlockNumberTag = (props: IBlockNumberTag) => {
  const { showText } = props
  const { blockNumber } = useRpcBlockContext()
  const { currentChainInfo } = useChainLoader()
  const [color, setColor] = useState(BLOCK_COLORS.SYNCED)
  const { data: actualBlockNumber } = useBlockNumber({ chainId: currentChainInfo.id })

  useEffect(() => {
    const getBlockNumber = async () => {
      if (blockNumber === -1) {
        setColor(BLOCK_COLORS.API_DOWN)
      } else {
        const difference = Number(actualBlockNumber) - blockNumber
        if (difference < currentChainInfo.blocksUntilBehind) {
          setColor(BLOCK_COLORS.SYNCED)
        } else {
          setColor(BLOCK_COLORS.DELAYED)
        }
      }
      getBlockNumber().catch(() => {
        setColor(BLOCK_COLORS.DELAYED)
      })
    }
  }, [blockNumber, actualBlockNumber])

  return (
    <div className="flex flex-row items-center">
      <div className={`w-2 h-2 rounded-full ${color} mr-1 animate-pulse ${showText ? 'mt-3' : ''}`}></div>
      <p className={`text-gray-400 text-sm mr-2 whitespace-nowrap ${showText ? 'mt-2' : ''}`}>
        {blockNumber > 0 && showText && <span>Lastest synced block: </span>}
        {blockNumber > 0 ? blockNumber : 'DISCONNECTED'}
      </p>
    </div>
  )
}
