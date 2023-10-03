import { IBounds } from '../charts/charts/lineChart/types'
import styles from './candleChart.module.css'
import Candle from './component/Candle'
import { getCandleData } from './util'

interface ILineChart {
  width: number
  height: number
  fillPositive?: string
  fillNegative?: string
  borderColorPositive?: string
  borderColorNegative?: string
  backgroundColor?: string
  widthFactor?: number
  borderWidth?: number
  data: number[][]
  yBounds: IBounds
  xBounds: IBounds
}

function CandleChart(props: ILineChart) {
  const {
    width: chartWidth,
    height: chartHeight,
    backgroundColor = '#0f111a',
    fillPositive = 'green',
    fillNegative = 'red',
    borderColorPositive = 'green',
    borderColorNegative = 'red',
    widthFactor = 0.75,
    borderWidth = 0,
    data,
    yBounds,
    xBounds,
  } = props

  const candleData = getCandleData(data, xBounds, yBounds, chartWidth, chartHeight, widthFactor)

  return (
    <div
      style={{ width: chartWidth, height: chartHeight, backgroundColor: backgroundColor, position: 'relative' }}
      className=""
    >
      <div
        className={styles.candleChartAnimation}
        style={{ position: 'absolute', height: chartHeight, backgroundColor: backgroundColor }}
      />
      <svg width={chartWidth} height={chartHeight}>
        {candleData.map((item, index) => {
          return (
            <Candle
              key={index}
              candleData={item.candle}
              wickData={item.wick}
              fill={item.isPositive ? fillPositive : fillNegative}
              borderColor={item.isPositive ? borderColorPositive : borderColorNegative}
              borderWidth={borderWidth}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default CandleChart
