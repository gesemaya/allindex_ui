import { SwapCandle } from '@gfxlabs/oku'
import { IBounds } from '../components/charts/charts/liquidityChart/type'
import { IYAxisData } from '../components/charts/charts/swapPageCharts/types'
import { SwapChartEnums } from '../types/Enums'
import { ICandleStickData } from '../types/Interface'
import { timeConvert } from './timeConvert'

export const getNearestTime = (time: number, timeIncrement: number) => {
  if (Math.round((time % timeIncrement) / timeIncrement) === 0) {
    return time - (time % timeIncrement)
  } else {
    return time + timeIncrement - (time % timeIncrement)
  }
}

export enum xAxisTimeIncrEnums {
  ONE_MINUTE = 60000,
  TWO_MINUTES = 60000 * 2,
  FIVE_MINUTES = 60000 * 5,
  TEN_MINUTES = 60000 * 10,
  FIFTEEN_MINUTES = 60000 * 15,
  THIRTY_MINUTES = 60000 * 30,

  ONE_HOUR = 60000 * 60,
  TWO_HOURS = 60000 * 60 * 2,
  THREE_HOURS = 60000 * 60 * 3,
  SIX_HOURS = 60000 * 60 * 6,

  ONE_DAY = 60000 * 60 * 24,
  TWO_DAYS = 60000 * 60 * 24 * 2,
  THREE_DAYS = 60000 * 60 * 24 * 3,
  FIVE_DAYS = 60000 * 60 * 24 * 5,

  ONE_WEEK = 60000 * 60 * 24 * 7,
  TWO_WEEKS = 60000 * 60 * 24 * 7 * 2,

  ONE_MONTH = 60000 * 60 * 24 * 30,
  TWO_MONTHS = 60000 * 60 * 24 * 30 * 2,
  THREE_MONTHS = 60000 * 60 * 24 * 30 * 3,
  FOUR_MONTHS = 60000 * 60 * 24 * 30 * 4,
  SIX_MONTHS = 60000 * 60 * 24 * 30 * 6,

  ONE_YEAR = 60000 * 60 * 24 * 365.24,
  TWO_YEARS = 60000 * 60 * 24 * 365.24 * 2,
  FIVE_YEARS = 60000 * 60 * 24 * 365.24 * 5,
  TEN_YEARS = 60000 * 60 * 24 * 365.24 * 10,
}

export const getXAxisDataArray = (
  bounds: IBounds,
  clientWidth: number,
  tickWidth: number,
  minTimeIncrement: number,
  dataIncrementSize: number
): { location: number; value: string[]; width: number }[] => {
  const chartMax = bounds.upper
  const chartMin = bounds.lower
  const maxAmountofIncrements = Math.floor(clientWidth / tickWidth)
  const width = (dataIncrementSize / (bounds.upper - bounds.lower)) * clientWidth
  const measuredIncrementSize = (chartMax - chartMin) / maxAmountofIncrements
  const incrementSigFig = Math.floor(Math.log10(measuredIncrementSize))
  const timeIncrement = getTimeIncrement(minTimeIncrement, measuredIncrementSize)

  const increment = timeIncrement.value
  const type = timeIncrement.type
  const startValue = chartMin + increment - (chartMin % increment)
  const steps = Math.floor((chartMax - chartMin) / increment)

  let arr = []
  for (let i = -1; i <= steps; i++) {
    const value = (startValue + i * increment).toFixed(incrementSigFig < 0 ? -1 * incrementSigFig : 0)

    if (isDaylightSavings(parseFloat(value)) && type === 'hour') {
      const newValue = (parseFloat(value) - xAxisTimeIncrEnums.ONE_HOUR).toString()
      const location = (parseFloat(newValue) - chartMin) / (chartMax - chartMin)
      const formattedValue = getTimeValue(newValue, type)
      arr.push({ value: formattedValue, location: location, width: width })
    } else {
      const newValue = value
      const location = ((parseFloat(newValue) - chartMin) / (chartMax - chartMin)) * clientWidth + 3
      const formattedValue = getTimeValue(newValue, type)
      arr.push({ value: formattedValue, location: location, width: width })
    }
  }

  return arr
}

export function isDaylightSavings(timeStamp: number) {
  const date = new Date(timeStamp)
  let monthJanuaryOffset = new Date(date.getFullYear(), 0, 1).getTimezoneOffset()
  let monthJuneOffset = new Date(date.getFullYear(), 5, 1).getTimezoneOffset()
  const isSavings = Math.max(monthJanuaryOffset, monthJuneOffset) !== date.getTimezoneOffset()
  return isSavings
}

export const getTimeValue = (timeValue: string, timeType: string) => {
  const time = timeConvert(parseFloat(timeValue))
  const timeDisplay =
    timeType === 'year'
      ? [time.year]
      : timeType === 'month'
      ? [time.month, '/', time.year]
      : timeType === 'day' || timeType === 'week'
      ? [time.month, '/', time.day]
      : time.hour === '00' && time.minute === '00'
      ? [time.month, '/', time.day]
      : [time.hour, ':', time.minute]
  return timeDisplay
}

export const getTimeIncrement = (minTimeIncrement: number, calculatedIncrSize: number) => {
  const incrementSize = calculatedIncrSize < minTimeIncrement ? minTimeIncrement : calculatedIncrSize
  const increment =
    incrementSize <= xAxisTimeIncrEnums.ONE_MINUTE
      ? { value: xAxisTimeIncrEnums.ONE_MINUTE, type: 'minute' }
      : incrementSize <= xAxisTimeIncrEnums.TWO_MINUTES
      ? { value: xAxisTimeIncrEnums.TWO_MINUTES, type: 'minute' }
      : incrementSize <= xAxisTimeIncrEnums.FIVE_MINUTES
      ? { value: xAxisTimeIncrEnums.FIVE_MINUTES, type: 'minute' }
      : incrementSize <= xAxisTimeIncrEnums.TEN_MINUTES
      ? { value: xAxisTimeIncrEnums.TEN_MINUTES, type: 'minute' }
      : incrementSize <= xAxisTimeIncrEnums.FIFTEEN_MINUTES
      ? { value: xAxisTimeIncrEnums.FIFTEEN_MINUTES, type: 'minute' }
      : incrementSize <= xAxisTimeIncrEnums.THIRTY_MINUTES
      ? { value: xAxisTimeIncrEnums.THIRTY_MINUTES, type: 'minute' }
      : incrementSize <= xAxisTimeIncrEnums.ONE_HOUR
      ? { value: xAxisTimeIncrEnums.ONE_HOUR, type: 'hour' }
      : incrementSize <= xAxisTimeIncrEnums.TWO_HOURS
      ? { value: xAxisTimeIncrEnums.TWO_HOURS, type: 'hour' }
      : incrementSize <= xAxisTimeIncrEnums.THREE_HOURS
      ? { value: xAxisTimeIncrEnums.THREE_HOURS, type: 'hour' }
      : incrementSize <= xAxisTimeIncrEnums.SIX_HOURS
      ? { value: xAxisTimeIncrEnums.SIX_HOURS, type: 'hour' }
      : incrementSize <= xAxisTimeIncrEnums.ONE_DAY
      ? { value: xAxisTimeIncrEnums.ONE_DAY, type: 'day' }
      : incrementSize <= xAxisTimeIncrEnums.TWO_DAYS
      ? { value: xAxisTimeIncrEnums.TWO_DAYS, type: 'day' }
      : incrementSize <= xAxisTimeIncrEnums.THREE_DAYS
      ? { value: xAxisTimeIncrEnums.THREE_DAYS, type: 'day' }
      : incrementSize <= xAxisTimeIncrEnums.FIVE_DAYS
      ? { value: xAxisTimeIncrEnums.FIVE_DAYS, type: 'day' }
      : incrementSize <= xAxisTimeIncrEnums.ONE_WEEK
      ? { value: xAxisTimeIncrEnums.ONE_WEEK, type: 'week' }
      : incrementSize <= xAxisTimeIncrEnums.TWO_WEEKS
      ? { value: xAxisTimeIncrEnums.TWO_WEEKS, type: 'week' }
      : incrementSize <= xAxisTimeIncrEnums.ONE_MONTH
      ? { value: xAxisTimeIncrEnums.ONE_MONTH, type: 'month' }
      : incrementSize <= xAxisTimeIncrEnums.TWO_MONTHS
      ? { value: xAxisTimeIncrEnums.TWO_MONTHS, type: 'month' }
      : incrementSize <= xAxisTimeIncrEnums.THREE_MONTHS
      ? { value: xAxisTimeIncrEnums.THREE_MONTHS, type: 'month' }
      : incrementSize <= xAxisTimeIncrEnums.FOUR_MONTHS
      ? { value: xAxisTimeIncrEnums.FOUR_MONTHS, type: 'month' }
      : incrementSize <= xAxisTimeIncrEnums.SIX_MONTHS
      ? { value: xAxisTimeIncrEnums.SIX_MONTHS, type: 'month' }
      : incrementSize <= xAxisTimeIncrEnums.ONE_YEAR
      ? { value: xAxisTimeIncrEnums.ONE_YEAR, type: 'year' }
      : incrementSize <= xAxisTimeIncrEnums.TWO_YEARS
      ? { value: xAxisTimeIncrEnums.TWO_YEARS, type: 'year' }
      : incrementSize <= xAxisTimeIncrEnums.FIVE_YEARS
      ? { value: xAxisTimeIncrEnums.FIVE_YEARS, type: 'year' }
      : { value: xAxisTimeIncrEnums.TEN_YEARS, type: 'year' }
  return increment
}

export const getYAxisDataArray = (yBounds: IBounds, clientHeight: number, tickHeight: number): IYAxisData[] => {
  const chartMax = yBounds.upper
  const chartMin = yBounds.lower
  const delta = Math.floor(clientHeight / tickHeight)
  const incrementSize = (chartMax - chartMin) / delta
  const decIncr = Math.floor(Math.log10(incrementSize))
  const increment = (incrementSize / 10 ** decIncr < 2 ? 2 : incrementSize / 10 ** decIncr < 5 ? 5 : 10) * 10 ** decIncr
  const startValue = chartMin + increment - (chartMin % increment)
  const steps = Math.floor((chartMax - chartMin) / increment)
  let arr = []
  for (let i = 0; i <= steps; i++) {
    const value = (startValue + i * increment).toFixed(decIncr < 0 ? -1 * decIncr : 0)
    const location = clientHeight * ((chartMax - parseFloat(value)) / (chartMax - chartMin))
    arr.push({ value: value, location: location })
  }
  return arr
}

export const boundsCalc = (upper: number, lower: number, yFactor: number): IBounds => {
  const delta = upper - lower
  const newDelta = delta * (1 + 2 * yFactor)
  const mid = lower + delta / 2
  const newLower = mid - newDelta / 2
  const newUpper = mid + newDelta / 2
  // clamp
  return { lower: clamp.lower(newLower), upper: newUpper }
}

export const clamp = {
  lower: (n: number, min: number = 0) => {
    return n > min ? n : min
  },
}

export const getMaxMinPriceFromData = (data: ICandleStickData[] | SwapCandle[], yRatio: number): IBounds => {
  const lower = Math.min(...data.map((item) => item.low))
  const upper = Math.max(...data.map((item) => item.high))
  const maxMin = boundsCalc(upper, lower, yRatio)
  return maxMin
}

export const getYBoundsTVL = (data: SwapCandle[], yRatio: number): IBounds => {
  const lower = Math.min(...data.map((item) => item.tvl))
  const upper = Math.max(...data.map((item) => item.tvl))
  const maxMin = boundsCalc(upper, lower, yRatio)
  return maxMin
}

export const getYBoundsVolume = (data: SwapCandle[], yRatio: number): IBounds => {
  const lower = Math.min(...data.map((item) => item.volume))
  const upper = Math.max(...data.map((item) => item.volume))
  const maxMin = boundsCalc(upper, lower, yRatio)
  return maxMin
}

export const getYBoundsSwitch = (chart: SwapChartEnums, totalData: SwapCandle[], yRatio: number): IBounds => {
  switch (chart) {
    case SwapChartEnums.PRICE:
      const minMax = getMaxMinPriceFromData(totalData, yRatio)
      if (minMax.lower === minMax.upper) {
        minMax.lower = minMax.lower - 1
        minMax.upper = minMax.upper + 1
      }
      return minMax
    case SwapChartEnums.TVL:
      const minMaxTVL = getYBoundsTVL(totalData, yRatio)
      if (minMaxTVL.lower === minMaxTVL.upper) {
        minMaxTVL.lower = minMaxTVL.lower - 1
        minMaxTVL.upper = minMaxTVL.upper + 1
      }
      return minMaxTVL
    case SwapChartEnums.VOLUME:
      const minMaxVolume = getYBoundsVolume(totalData, yRatio)
      if (minMaxVolume.lower === minMaxVolume.upper) {
        minMaxVolume.lower = minMaxVolume.lower - 1
        minMaxVolume.upper = minMaxVolume.upper + 1
      }
      return minMaxVolume
    default:
      const minMaxDefault = getMaxMinPriceFromData(totalData, yRatio)
      if (minMaxDefault.lower === minMaxDefault.upper) {
        minMaxDefault.lower = minMaxDefault.lower - 1
        minMaxDefault.upper = minMaxDefault.upper + 1
      }
      return minMaxDefault
  }
}
