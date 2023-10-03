import { SwapChartEnums } from '../../../../../types/Enums'
import { SwapCandle } from '@gfxlabs/oku'
import { IBounds } from '../../lineChart/types'
import PriceChartContainer from '../candleStickChart/PriceChartContainer'
import TVLChartContainer from '../tvlChart/TVLChartContainer'
import VolumeChartContainer from '../volumeChart/VolumeChartContainer'
import React from 'react'

const SwitchChart = (
  chart: SwapChartEnums,
  chartContainerHeight: number,
  chartContainerWidth: number,
  bounds: IBounds,
  setBounds: (value: IBounds) => void,
  yBounds: IBounds,
  data: SwapCandle[]
) => {
  switch (chart) {
    case SwapChartEnums.PRICE:
      return (
        <PriceChartContainer
          width={chartContainerWidth}
          height={chartContainerHeight}
          bounds={bounds}
          setBounds={setBounds}
          yBounds={yBounds}
          data={data}
        />
      )
    case SwapChartEnums.TVL:
      return (
        <TVLChartContainer
          width={chartContainerWidth}
          height={chartContainerHeight}
          bounds={bounds}
          setBounds={setBounds}
          yBounds={yBounds}
          data={data}
        />
      )
    case SwapChartEnums.VOLUME:
      return (
        <VolumeChartContainer
          width={chartContainerWidth}
          height={chartContainerHeight}
          bounds={bounds}
          setBounds={setBounds}
          yBounds={yBounds}
          data={data}
        />
      )
    default:
      return (
        <PriceChartContainer
          width={chartContainerWidth}
          height={chartContainerHeight}
          bounds={bounds}
          setBounds={setBounds}
          yBounds={yBounds}
          data={data}
        />
      )
  }
}

export default SwitchChart
