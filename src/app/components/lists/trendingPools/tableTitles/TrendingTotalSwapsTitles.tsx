import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import React from 'react'

const TrendingTotalSwapsTitles = () => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-[19]">
        <T3 color={colors.gray[400]}>Pool</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.gray[400]}>Total Swaps</T3>
      </div>
    </div>
  )
}

export default TrendingTotalSwapsTitles
