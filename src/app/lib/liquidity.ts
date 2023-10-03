import { PoolTokenInfo } from '../context/DataContext'
import { LiquidityChart } from '@gfxlabs/oku'

export const getLog = (a: number, b: number) => {
  return Math.log(b) / Math.log(a)
}

export const getNearestIndex = (data: number[], value: number) => {
  const nearestValue = data.reduce(function (previousVal, currurrentVal) {
    return Math.abs(currurrentVal - value) < Math.abs(previousVal - value) ? currurrentVal : previousVal
  })
  return data.indexOf(nearestValue)
}

export const getNearestTick = (tickValue: number, tickSize: number, token: PoolTokenInfo) => {
  // const tickValue = token === 0 ? getLog(1.0001, price * 10 ** 12) : getLog(1.0001, (1 / price) * 10 ** 12)
  const tickRounded = Math.round(tickValue)
  const remainder = tickRounded % tickSize
  const minTick = -887272
  const maxTick = 887272
  if (tickValue <= minTick || tickValue > maxTick) {
    return token.selected === 0 ? minTick : maxTick
  } else {
    if (remainder >= tickSize / 2) {
      const x = tickRounded + tickSize - remainder
      return x
    } else {
      const x = tickRounded - remainder
      return x
    }
  }
}

export const getNearestHoverTick = (tickValue: number, tickSize: number) => {
  const tickRounded = Math.round(tickValue)
  const remainder = tickRounded % tickSize
  const x = tickRounded - remainder
  return x
}

export const tick2Price = (tick: number, token: PoolTokenInfo) => {
  let scalar = token.decimals
  const price = 1.0001 ** tick / 10 ** scalar
  return token.selected === 1 ? price : 1 / price
}

export const price2Tick = (price: number, token: PoolTokenInfo) => {
  let scalar = token.decimals
  const tickValue =
    token.selected === 1 ? getLog(1.0001, price * 10 ** scalar) : getLog(1.0001, (1 / price) * 10 ** scalar)
  return Math.round(tickValue)
}

export const priceToTick = (price: number, tokenDecimals: number) => {
  let scalar = tokenDecimals
  const tickValue = getLog(1.0001, price * 10 ** scalar)
  return Math.round(tickValue)
}

export const getLiquidityData = (token: PoolTokenInfo, token0: string, data: LiquidityChart) => {
  const belowMid = data.below
  const aboveMid = data.above
  if (belowMid !== undefined && aboveMid !== undefined) {
    if (token.selected === 0) {
      const below = belowMid.slice(0, belowMid.length - 1).map((tick) => {
        return { tick: tick.tick, price: parseFloat(tick.price0), amount: parseFloat(tick.amount) }
      })
      const above = aboveMid.map((tick) => {
        return {
          tick: tick.tick,
          price: parseFloat(tick.price0),
          amount: parseFloat(tick.amount) * parseFloat(tick.price1),
        }
      })
      return below.concat(above)
    } else {
      const below = belowMid.slice(0, belowMid.length - 1).map((tick) => {
        return {
          tick: tick.tick,
          price: parseFloat(tick.price1),
          amount: parseFloat(tick.amount) * parseFloat(tick.price0),
        }
      })
      const above = aboveMid.map((tick) => {
        return { tick: tick.tick, price: parseFloat(tick.price1), amount: parseFloat(tick.amount) }
      })
      return above.reverse().concat(below.reverse())
    }
  }
}

export const getBoundedData = (
  lower: number,
  upper: number,
  data: { tick: number; price: number; amount: number }[],
  tickSpacing: number,
  token: PoolTokenInfo
) => {
  const lowerTick = getNearestTick(lower, tickSpacing, token)
  const upperTick = getNearestTick(upper, tickSpacing, token)
  const ticks = data.map((item) => {
    return item.tick
  })
  const lowerIndex = getNearestIndex(ticks, lowerTick)
  const upperIndex = getNearestIndex(ticks, upperTick)

  const dataShown = data.slice(lowerIndex, upperIndex)
  return dataShown
}
