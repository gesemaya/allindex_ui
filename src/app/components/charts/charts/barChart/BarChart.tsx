import { IBounds } from '../lineChart/types'
import styles from './barChart.module.css'
import Bar from './components/Bar'
import { getBarData } from './util'
import React from 'react'

interface ILineChart {
  width: number
  height: number
  fill?: string
  borderColor?: string
  backgroundColor?: string
  data: number[][]
  yBounds: IBounds
  xBounds: IBounds
}

function BarChart(props: ILineChart) {
  const {
    width: chartWidth,
    height: chartHeight,
    backgroundColor = '#0f111a',
    fill = '#002BA3',
    borderColor = '',
    data,
    yBounds,
    xBounds,
  } = props

  // function setHeight(height: string) {
  //     document.documentElement.style.setProperty('--barChartHeight', height)
  //   }

  //   useEffect(()=>{
  //     setHeight(chartHeight.toString())
  //   },[])

  const barData = getBarData(data, xBounds, yBounds, chartWidth, chartHeight)

  return (
    <div
      style={{ width: chartWidth, height: chartHeight, backgroundColor: backgroundColor }}
      className="overflow-hidden"
    >
      <div
        className={styles.barChartAnimation}
        style={{ width: chartWidth, height: 0, backgroundColor: backgroundColor }}
      />
      <svg width={chartWidth} height={chartHeight}>
        {barData.map((item, index) => {
          // window.log.log(item)
          return (
            <Bar
              key={index}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fill={fill}
              borderColor={borderColor}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default BarChart
