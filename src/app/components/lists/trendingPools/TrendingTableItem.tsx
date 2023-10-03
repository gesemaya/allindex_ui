import { useChainLoader } from '../../../route/RouteWrapper'
import { TrendingPoolsEnums } from '../../../types/Enums'
import { PoolSummary } from '@gfxlabs/oku'
import { getHoverColor } from '../../charts/utils/getHoverColor'
import TrendingTVLItem from './listItems/TrendingTVLItem'
import TrendingTopGainerItem from './listItems/TrendingTopGainerItem'
import TrendingTopLoserItem from './listItems/TrendingTopLoserItem'
import TrendingTotalSwapsItem from './listItems/TrendingTotalSwapsItem'
import TrendingVolumeItem from './listItems/TrendingVolumeItem'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface ITrendingTableItem {
  index: number
  trendType: TrendingPoolsEnums
  pool: PoolSummary
}

const TrendingTableItem = (props: ITrendingTableItem) => {
  const { index, trendType, pool } = props
  const [hover, setHover] = useState(false)
  return (
    <NavLink
      className="h-[44px] w-full bg-red-200 flex flex-row items-center px-3 "
      style={({ isActive }) => {
        const even = index % 2 === 0
        const isHover = isActive || hover
        const baseColor = even ? '#101116' : '#0B0B0E'
        const color = isHover ? getHoverColor(baseColor) : baseColor
        return {
          backgroundColor: color,
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      to={`../${pool.t0}/${pool.t1}`}
    >
      {SwitchTableTitle(trendType, pool)}
    </NavLink>
  )
}

const SwitchTableTitle = (trendType: TrendingPoolsEnums, pool: PoolSummary) => {
  switch (trendType) {
    case TrendingPoolsEnums.TOP_GAINERS:
      return <TrendingTopGainerItem pool={pool} />
    case TrendingPoolsEnums.TOP_LOSERS:
      return <TrendingTopLoserItem pool={pool} />
    case TrendingPoolsEnums.TOTAL_SWAPS:
      return <TrendingTotalSwapsItem pool={pool} />
    case TrendingPoolsEnums.TVL:
      return <TrendingTVLItem pool={pool} />
    case TrendingPoolsEnums.VOLUME:
      return <TrendingVolumeItem pool={pool} />
    default:
      return <TrendingTopGainerItem pool={pool} />
  }
}

export default TrendingTableItem
