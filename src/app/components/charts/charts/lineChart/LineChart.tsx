import Line from './components/Line'
import LineShadow from './components/LineShadow'
import styles from './lineChart.module.css'
import { IBounds } from './types'
import { getPolygonData, getPolylineData } from './util'
import React from 'react'

interface ILineChart {
  width: number
  height: number
  lineColor?: string
  backgroundColor?: string
  shadowOffset?: number
  shadowColor?: string[]
  showShadow?: boolean
  data: number[][]
  yBounds: IBounds
  xBounds: IBounds
}

function LineChart(props: ILineChart) {
  const {
    width,
    height,
    lineColor = '#5CFE9D',
    backgroundColor = '#0f111a',
    shadowOffset = 100,
    shadowColor = ['#3E43BB36'],
    showShadow = true,
    data,
    yBounds,
    xBounds,
  } = props
  const chartWidth = width
  const chartHeight = height
  const barWidth = ((data[1][0] - data[0][0]) / (xBounds.upper - xBounds.lower)) * chartWidth

  const LineData = getPolylineData(data, width, height, xBounds, yBounds, barWidth)
  const ShadowData = getPolygonData(data, width, height, xBounds, yBounds, barWidth)
  return (
    <div style={{ width: width, height: height, backgroundColor: backgroundColor, position: 'relative' }}>
      <div
        className={styles.lineChartAnimation}
        style={{ position: 'absolute', height: height, backgroundColor: backgroundColor }}
      ></div>
      <svg width={chartWidth} height={chartHeight} fill={backgroundColor}>
        <Line
          width={chartWidth}
          height={chartHeight}
          lineColor={lineColor}
          shadowOffset={shadowOffset}
          shadowColor={shadowColor}
          data={LineData}
        />
        {showShadow && <LineShadow data={ShadowData} showColor={shadowColor} shadowOffset={shadowOffset} />}
      </svg>
    </div>
  )
}

export default LineChart
