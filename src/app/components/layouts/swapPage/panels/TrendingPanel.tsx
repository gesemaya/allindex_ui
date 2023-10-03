import { colors } from '../../../../constants/colors'
import { TrendingPoolsEnums } from '../../../../types/Enums'
import TrendingTableList from '../../../lists/trendingPools/TrendingTableList'
import TrendingTableTitles from '../../../lists/trendingPools/TrendingTableTitles'
import TrendingTopBar from '../../../lists/trendingPools/TrendingTopBar'
import { useState } from 'react'

function TrendingPanel() {
  const [trendType, setTrendType] = useState<TrendingPoolsEnums>(TrendingPoolsEnums.VOLUME)

  return (
    <div
      className={`rounded-lg bg-[${colors.gray.dark}] border-[1px] border-[${colors.gray[800]}] overflow-hidden w-full h-full flex flex-1`}
    >
      <div className="flex flex-col flex-1 w-full">
        <TrendingTopBar trendType={trendType} setTrendType={setTrendType} />
        <div className="w-full h-[1px] mt-3 mb-[18px]" style={{ backgroundColor: colors.gray[800] }}></div>
        <TrendingTableTitles trendType={trendType} />
        <TrendingTableList trendType={trendType} />
      </div>
    </div>
  )
}

export default TrendingPanel
