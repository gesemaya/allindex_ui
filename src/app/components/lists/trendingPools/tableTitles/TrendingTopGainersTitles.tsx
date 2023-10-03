import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import React from 'react'

const TrendingTopGainersTitles = () => {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-[19]">
        <T3 color={colors.gray[400]}>Pool</T3>
      </div>
      <div className="flex flex-[7] justify-end">
        <T3 color={colors.gray[400]}>Price</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.gray[400]}>Volume 24h</T3>
      </div>
    </div>
  )
}

export default TrendingTopGainersTitles
