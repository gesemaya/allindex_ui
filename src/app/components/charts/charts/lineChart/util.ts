import { IBounds } from './types'

export const getPolygonData = (
  data: number[][],
  width: number,
  height: number,
  xBounds: IBounds,
  yBounds: IBounds,
  barWidth: number
) => {
  let arr = (getPixelLocationFromValue(data[0][0], xBounds, width) + barWidth / 2)
    .toString()
    .concat(','.concat(height.toString().concat(' ')))
  for (let i = 0; i < data.length; i++) {
    const x = (getPixelLocationFromValue(data[i][0], xBounds, width) + barWidth / 2).toString()
    const y = (height - getPixelLocationFromValue(data[i][1], yBounds, height)).toString()
    arr = arr.concat(x.concat(','.concat(y.concat(' '))))
  }
  return arr.concat(
    (getPixelLocationFromValue(data[data.length - 1][0], xBounds, width) + barWidth / 2)
      .toString()
      .concat(','.concat(height.toString().concat(' ')))
  )
}

export const getPolylineData = (
  data: number[][],
  width: number,
  height: number,
  xBounds: IBounds,
  yBounds: IBounds,
  barWidth: number
) => {
  let arr = ''
  for (let i = 0; i < data.length; i++) {
    const x = (getPixelLocationFromValue(data[i][0], xBounds, width) + barWidth / 2).toString()
    const y = (height - getPixelLocationFromValue(data[i][1], yBounds, height)).toString()
    arr = arr.concat(x.concat(','.concat(y.concat(' '))))
  }

  return arr
}

export const getLineSegmentData = (
  data: number[][],
  width: number,
  height: number,
  xBounds: IBounds,
  yBounds: IBounds
) => {
  let arr = []
  for (let i = 0; i < data.length - 1; i++) {
    // window.log.log(data[i][1], width, xBounds)
    const x1 = getPixelLocationFromValue(data[i][0], xBounds, width)
    const x2 = getPixelLocationFromValue(data[i + 1][0], xBounds, width)
    const y1 = height - getPixelLocationFromValue(data[i][1], yBounds, height)
    const y2 = height - getPixelLocationFromValue(data[i + 1][1], yBounds, height)
    arr.push({ x1: x1, x2: x2, y1: y1, y2: y2 })
  }
  return arr
}

export const getPixelLocationFromValue = (value: number, bounds: IBounds, length: number) => {
  // window.log.log(bounds.lower, bounds)
  if (bounds.upper === bounds.lower) {
    return length / 2
  }
  return ((value - bounds.lower) * length) / (bounds.upper - bounds.lower)
}
