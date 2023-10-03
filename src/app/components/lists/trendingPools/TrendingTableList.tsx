import { useChainLoader } from '../../../route/RouteWrapper'
import { TrendingPoolsEnums } from '../../../types/Enums'
import { PoolSummary } from '@gfxlabs/oku'
import { fetchTopPools } from '../../../data/cush_topPools'
import { SkeletonLines } from '../../loadingStates/SkeletonLines'
import TrendingTableItem from './TrendingTableItem'
import { useEffect, useState } from 'react'

interface ITrendingTableList {
  trendType: TrendingPoolsEnums
}

const TrendingTableList = (props: ITrendingTableList) => {
  const { trendType } = props
  const [pools, setPools] = useState<PoolSummary[] | undefined>(undefined)
  const { cushRpc } = useChainLoader()

  useEffect(() => {
    setPools(undefined)
    fetchTopPools(cushRpc, createTopPoolParams(trendType)).then((res: any) => {
      setPools(res.pools)
    })
  }, [trendType, cushRpc])

  return (
    <div className="overflow-y-scroll no-scrollbar">
      {pools ? (
        pools.map((pool, index) => (
          // pool.Token0Volume !== 0 ? (
          <TrendingTableItem index={index} key={pool.address} pool={pool} trendType={trendType} />
        ))
      ) : (
        <SkeletonLines lines={50} random />
      )}
    </div>
  )
}

export default TrendingTableList

const createTopPoolParams = (trendType: TrendingPoolsEnums) => {
  switch (trendType) {
    case TrendingPoolsEnums.TOP_GAINERS:
      return {
        sort_by: 't0_change_usd',
      }
    case TrendingPoolsEnums.TOP_LOSERS:
      return {
        sort_by: 't0_change_usd',
        sort_order: true,
      }
    case TrendingPoolsEnums.TOTAL_SWAPS:
      return {
        sort_by: 'tx_count',
      }
    case TrendingPoolsEnums.TVL:
      return {
        sort_by: 'tvl_usd',
      }
    case TrendingPoolsEnums.VOLUME:
      return {
        sort_by: 't0_volume_usd',
      }
    default:
      return {
        sort_by: 't0_change_usd',
      }
  }
}
