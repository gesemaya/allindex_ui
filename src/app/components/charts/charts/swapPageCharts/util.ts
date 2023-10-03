import { SwapCandle } from '@gfxlabs/oku'
import { getNearestTime } from '../../../../util/charting'

export const getDataFromBounds = (data: SwapCandle[], lower: number, upper: number, timeIncrement: number) => {
  const candleDataLength = data.length
  if (candleDataLength === 1) {
    data.push({ ...data[0] })
  }
  const maxTime = data[candleDataLength - 1].time!
  const minTime = data[0].time!
  const lowerBound = getNearestTime(lower, timeIncrement) < minTime ? minTime : getNearestTime(lower, timeIncrement)
  const upperBound = getNearestTime(upper, timeIncrement) > maxTime ? maxTime : getNearestTime(upper, timeIncrement)
  const lowerIndex = data.map((item) => item.time).indexOf(lowerBound)
  const upperIndex = data.map((item) => item.time).indexOf(upperBound)
  const newData = data.slice(
    lowerIndex - 2 < 0 ? 0 : lowerIndex - 2,
    upperIndex + 2 > data.length ? upperIndex + 1 : upperIndex + 2
  )
  return newData
}
