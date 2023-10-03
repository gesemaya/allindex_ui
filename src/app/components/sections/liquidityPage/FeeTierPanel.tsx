import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getMarketWatch, updateMarketWatch } from '../../../lib/marketWatch'
import { getTokenSymbol } from '../../../util/getTokenName'
import { PoolTokenInfo, useDataContext } from '../../../context/DataContext'
import { usePositionMakerContext } from '../../../context/PositionMakerContext'
import { PoolInfo, PoolSummary } from '@gfxlabs/oku'
import { fetchPoolSummary } from '../../../data/pool_summary'
import StarButton from '../../buttons/StarButton'
import FeeTierDropdown from '../../dropdown/FeeTierDropdown'
import { useEffect, useState } from 'react'

function FeeTierPanel() {
  const { token, poolSummary } = useDataContext()
  const [, setLoading] = useState(true)
  const [, setPool] = useState<PoolSummary>()
  const [poolInfo, setPoolInfo] = useState<PoolInfo>()
  const { currentChain } = useChainLoader()
  const { cushRpc } = useChainLoader()
  const { editPosition } = usePositionMakerContext()

  useEffect(() => {
    if (poolSummary && poolSummary.address != null) {
      fetchPoolSummary(cushRpc, { pool_address: poolSummary.address }).then((res) => {
        setPoolInfo(res)
      })
    }
  }, [poolSummary])

  useEffect(() => {
    if (poolSummary) {
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [poolSummary])

  const [pools, setPools] = useState(getMarketWatch(currentChain))
  const { setFavoritePool } = useDataContext()

  const togglePool = (address: string) => {
    if (pools.includes(address)) {
      const updatedPools = updateMarketWatch('REMOVE', address, currentChain)
      setPools(updatedPools)
      setFavoritePool(updatedPools)
    } else {
      const updatedPools = updateMarketWatch('ADD', address, currentChain)
      setPools(updatedPools)
      setFavoritePool(updatedPools)
    }
  }

  return (
    <div
      className="bg-[#0E0E0E] flex  flex-col rounded-[16px] border-[1px] py-2 px-3 gap-2 border-[#141B2B]"
      style={{ height: '197px' }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row  items-center gap-2">
          <PoolPair />
          <StarButton isStarred={pools.includes(poolSummary.address)} onClick={() => togglePool(poolSummary.address)} />
        </div>
      </div>
      <div>
        <div className="relative flex flex-col gap-2">
          <FeeTierDropdown setPool={setPool} />
          <PoolTable pool={poolSummary} poolInfo={poolInfo} tokenInfo={token} />
          {editPosition && (
            <div className="absolute top-0 left-0 w-full h-full bg-[#0E0E0E] opacity-50" style={{ zIndex: 1 }}></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeeTierPanel

const PoolPair = () => {
  const { token0: token0Info, token1: token1Info } = useDataContext()
  const { currentChain } = useChainLoader()
  return (
    <div className="flex flex-row items-center w-fit gap-[26px]">
      <div className="flex">
        <div className="h-[18px] w-[18px] rounded-[18px] bg-gray-400">
          {token0Info && <img className="rounded-full" src={token0Info.logoURI} alt={token0Info.symbol} />}
        </div>
        <div className="absolute ml-[15px] h-[18px] w-[18px] rounded-[18px] bg-gray-600">
          {token1Info && <img className="rounded-full" src={token1Info.logoURI} alt={token1Info.symbol} />}
        </div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        {token0Info && token1Info ? (
          <div className="text-white font-semibold text-sm">{`${getTokenSymbol(
            token0Info.address,
            token0Info.symbol,
            currentChain
          )}/${getTokenSymbol(token1Info.address, token1Info.symbol, currentChain)}`}</div>
        ) : (
          <div className="text-white font-semibold text-sm">Loading...</div>
        )}
      </div>
    </div>
  )
}

const PoolTable = ({
  pool,
  poolInfo,
  tokenInfo,
}: {
  pool: PoolSummary
  poolInfo?: PoolInfo
  tokenInfo: PoolTokenInfo
}) => {
  const { currentChain } = useChainLoader()
  const sevenDVolume = poolInfo ? (tokenInfo.selected === 0 ? poolInfo.volume_base : poolInfo.volume_quote) : 0
  const sevenDFees = (sevenDVolume * pool.fee) / 1000000

  return pool ? (
    <div
      className="rounded-[16px] border-[1px] py-3 px-2 flex flex-col gap-2"
      style={{ borderColor: colors.gray[700] }}
    >
      <div className="flex flex-row justify-between">
        <T3 color={colors.gray[400]}>TVL:</T3>
        <T3>
          $<FormatNumber num={pool.tvl_usd} />
        </T3>
      </div>
      <div className="flex flex-row justify-between">
        <T3 color={colors.gray[400]}>7D Volume:</T3>
        <T3>
          <FormatNumber num={sevenDVolume} />{' '}
          {tokenInfo.selected === 0
            ? getTokenSymbol(pool.t0, pool.t0_symbol, currentChain)
            : getTokenSymbol(pool.t1, pool.t1_symbol, currentChain)}
        </T3>
      </div>
      <div className="flex flex-row justify-between">
        <T3 color={colors.gray[400]}>7D Fees:</T3>
        <T3>
          <FormatNumber num={sevenDFees} />{' '}
          {tokenInfo.selected === 0
            ? getTokenSymbol(pool.t0, pool.t0_symbol, currentChain)
            : getTokenSymbol(pool.t1, pool.t1_symbol, currentChain)}
        </T3>
      </div>
      <div className="flex flex-row justify-between">
        <T3 color={colors.gray[400]}>7D Transactions:</T3>
        <T3>{pool.tx_count}</T3>
      </div>
    </div>
  ) : (
    <div>'loading...'</div>
  )
}
