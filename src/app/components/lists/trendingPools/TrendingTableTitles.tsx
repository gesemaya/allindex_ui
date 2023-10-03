import { TrendingPoolsEnums } from '../../../types/Enums'
import TrendingTVLTitles from './tableTitles/TrendingTVLTitles'
import TrendingTopGainersTitles from './tableTitles/TrendingTopGainersTitles'
import TrendingTopLosersTitles from './tableTitles/TrendingTopLosersTitles'
import TrendingTotalSwapsTitles from './tableTitles/TrendingTotalSwapsTitles'
import TrendingVolumeTitles from './tableTitles/TrendingVolumeTitles'

interface ITrendingTableTitles {
  trendType: TrendingPoolsEnums
}

const TrendingTableTitles = ({ trendType }: ITrendingTableTitles) => (
  <div className="flex flex-row mb-2 px-3 ">{SwitchTableTitle(trendType)}</div>
)

export default TrendingTableTitles

const SwitchTableTitle = (trendType: TrendingPoolsEnums) => {
  switch (trendType) {
    case TrendingPoolsEnums.TOP_GAINERS:
      return <TrendingTopGainersTitles />
    case TrendingPoolsEnums.TOP_LOSERS:
      return <TrendingTopLosersTitles />
    case TrendingPoolsEnums.TOTAL_SWAPS:
      return <TrendingTotalSwapsTitles />
    case TrendingPoolsEnums.TVL:
      return <TrendingTVLTitles />
    case TrendingPoolsEnums.VOLUME:
      return <TrendingVolumeTitles />
    default:
      return <TrendingTopGainersTitles />
  }
}
