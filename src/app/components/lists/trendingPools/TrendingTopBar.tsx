import { T2 } from '../../typography/Typography'
import { TrendingPoolsEnums } from '../../../types/Enums'
import TrendingPoolDropdown from '../../dropdown/TrendingPoolDropdown'

interface ITrendingTopBar {
  trendType: TrendingPoolsEnums
  setTrendType: (value: TrendingPoolsEnums) => void
}

const TrendingTopBar = (props: ITrendingTopBar) => {
  const { trendType, setTrendType } = props
  return (
    <div className="flex flex-row justify-between items-center w-full pt-3 px-3">
      <T2>Trending</T2>
      <TrendingPoolDropdown trendType={trendType} setTrendType={setTrendType} />
    </div>
  )
}

export default TrendingTopBar
