import { SwapCandle } from '@gfxlabs/oku'
import LineChart from '../../lineChart/LineChart'
import { IBounds } from '../../lineChart/types'
import React from 'react'

interface ITokenChartContainer {
  height: number
  width: number
  bounds: IBounds
  setBounds: (value: IBounds) => void
  data: SwapCandle[]
  yBounds: IBounds
}

function TVLChartContainer(props: ITokenChartContainer) {
  const { height, width, data, bounds: xBounds, yBounds } = props
  const formattedData = data.map((item) => {
    return [item.time, item.tvl]
  })

  return (
    <div className="" style={{ height: height, width: width }}>
      <LineChart width={width} height={height} data={formattedData} yBounds={yBounds} xBounds={xBounds} />
    </div>
  )
}

export default TVLChartContainer
