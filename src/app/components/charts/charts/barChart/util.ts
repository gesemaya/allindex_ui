import { IBounds } from '../lineChart/types'
import { getPixelLocationFromValue } from '../lineChart/util'

interface IBarData {
  x: number
  y: number
  width: number
  height: number
}

export const getBarData = (
  data: number[][],
  xBounds: IBounds,
  yBounds: IBounds,
  chartWidth: number,
  chartHeight: number
): IBarData[] => {
  const x1 = getPixelLocationFromValue(data[0][0], xBounds, chartWidth)
  const x2 = getPixelLocationFromValue(data[1][0], xBounds, chartWidth)
  const width = x2 - x1
  let arr = []

  for (let i = 0; i < data.length; i++) {
    // window.log.log(data)
    const x1 = getPixelLocationFromValue(data[i][0], xBounds, chartWidth)
    const y1 = chartHeight - getPixelLocationFromValue(data[i][1], yBounds, chartHeight)
    //    window.log.log(y1, yBounds, chartHeight)
    const height = chartHeight - y1
    arr.push({ x: x1, y: y1, height: height, width: width })
  }

  return arr
}
