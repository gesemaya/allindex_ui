import CandleChart from '../../../../candleChart/CandleChart'
import { useThemeContext } from '../../../../../context/naked/ThemeContext'
import { SwapCandle } from '@gfxlabs/oku'
import { IBounds } from '../../lineChart/types'
import React from 'react'

interface IPriceChartContainer {
  height: number
  width: number
  bounds: IBounds
  setBounds: (value: IBounds) => void
  data: SwapCandle[]
  yBounds: IBounds
}

function PriceChartContainer(props: IPriceChartContainer) {
  const { height, width, data, bounds: xBounds, yBounds } = props
  const formattedData = data.map((item) => {
    return [item.time, item.close, item.open, item.high, item.low]
  })
  const widthFactor = 0.75
  const { colors } = useThemeContext()
  return (
    <div className="" style={{ height: height, width: width }}>
      <CandleChart
        width={width}
        height={height}
        data={formattedData}
        yBounds={yBounds}
        xBounds={xBounds}
        widthFactor={widthFactor}
        fillPositive={colors.pos_color}
        fillNegative={colors.neg_color}
      />
    </div>
  )
}

export default PriceChartContainer
