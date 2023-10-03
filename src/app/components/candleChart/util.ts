import { IBounds } from '../charts/charts/lineChart/types'
import { getPixelLocationFromValue } from '../charts/charts/lineChart/util'

export const getCandleData = (
  data: number[][],
  xBounds: IBounds,
  yBounds: IBounds,
  chartWidth: number,
  chartHeight: number,
  widthFactor: number
) => {
  if (data.length < 2) {
    return []
  }
  const wFactor = widthFactor > 1 ? 1 : widthFactor < 0.2 ? 0.2 : widthFactor
  const x1 = getPixelLocationFromValue(data[0][0], xBounds, chartWidth)
  const x2 = getPixelLocationFromValue(data[1][0], xBounds, chartWidth)
  const width = (x2 - x1) * wFactor
  let arr = []

  for (let i = 0; i < data.length; i++) {
    const x1 = getPixelLocationFromValue(data[i][0], xBounds, chartWidth)
    const yClose = chartHeight - getPixelLocationFromValue(data[i][1], yBounds, chartHeight)
    const yOpen = chartHeight - getPixelLocationFromValue(data[i][2], yBounds, chartHeight)

    //sign
    const isPositive = data[i][2] <= data[i][1]

    //candle
    const yRect = isPositive ? yClose : yOpen
    const xRect = x1 + (width - width * wFactor) / 2
    const height = Math.abs(yOpen - yClose)

    //wick
    const yLo = chartHeight - getPixelLocationFromValue(data[i][4], yBounds, chartHeight)
    const yHi = chartHeight - getPixelLocationFromValue(data[i][3], yBounds, chartHeight)
    const xHi = x1 + width / 2 + (width - width * wFactor) / 2
    const xLo = x1 + width / 2 + (width - width * wFactor) / 2
    arr.push({
      wick: { y2: yHi, y1: yLo, x2: xHi, x1: xLo },
      candle: { width: width, height: height, x: xRect, y: yRect },
      isPositive: isPositive,
    })
  }
  return arr
}
