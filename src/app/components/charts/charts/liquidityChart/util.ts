import { getNearestTick, tick2Price } from '../../../../lib/liquidity'
import { BetweenNumbers } from '../../../../util/between'
import { PoolTokenInfo } from '../../../../context/DataContext'
import { univ3_LiquiditySnapshot } from '@gfxlabs/oku'
import { maxTickHeight, tagSize, xAxisHeight } from './constants'
import { IBounds } from './type'
import { SqrtPriceMath, TickMath } from '../../../../v3-sdk/v3/math'

export const getLocationFromX = (x: number, bounds: IBounds, width: number) => {
  return bounds.lower + (bounds.upper - bounds.lower) * (x / width)
}
export const getTimeFromHover = (
  hover: { x: number; y: number },
  bounds: IBounds,
  clientWidth: number,
  increment: number
) => {
  return getLocationFromX(hover.x, bounds, clientWidth) - (getLocationFromX(hover.x, bounds, clientWidth) % increment)
}

const sqrtTable = new Map<number, bigint>()

export const getLiquidityDataFromSnapshot = (token: PoolTokenInfo, data: univ3_LiquiditySnapshot) => {
  let tickAmounts: {
    tick: number
    price: number
    amount: number
  }[] = []
  if (!token || !data || !data.ticks || data.ticks.length === 0 || isNaN(token.decimals)) {
    return tickAmounts
  }

  const max_positive_int = 2n ** 255n
  const neg_offset = 2n ** 256n
  let midMarketPrice = BigInt(data.sqrt_price_x96)
  let liquidity: bigint = 0n
  let aboveMidMarket = false
  data.ticks.forEach((tick, ind) => {
    let tickSpacing = data.tick_spacing
    if (ind >= data.ticks.length - 1) {
      return
    }
    if (data.tick_spacing === 1) {
      if (BetweenNumbers(data.current_pool_tick - 1000, data.current_pool_tick + 1000, tick.tick_index)) {
        tickSpacing = 1
      } else {
        tickSpacing = 60
      }
    }
    let newLiq = BigInt(tick.liquidity_net)
    if (newLiq >= max_positive_int) {
      newLiq = newLiq - neg_offset
    }
    liquidity = liquidity + newLiq
    let lastPrice = BigInt(tick.sqrt_price)
    let nextInitializedTick = data.ticks[ind + 1].tick_index
    for (let x = tick.tick_index; x < nextInitializedTick; x = x + tickSpacing) {
      let nextPriceToCalculate = sqrtTable.get(x + data.tick_spacing)
      if (!nextPriceToCalculate) {
        nextPriceToCalculate = TickMath.getSqrtRatioAtTick(x + tickSpacing)
        sqrtTable.set(x + tickSpacing, nextPriceToCalculate)
      }
      // if we are at mid market price
      if (nextPriceToCalculate > midMarketPrice && lastPrice < midMarketPrice) {
        const newTick = calculateTick(
          x,
          lastPrice,
          midMarketPrice,
          liquidity,
          aboveMidMarket,
          data.token0_decimals,
          data.token1_decimals,
          token
        )
        tickAmounts.push(newTick)
        aboveMidMarket = true
        lastPrice = midMarketPrice
      }
      const newTick = calculateTick(
        x,
        lastPrice,
        nextPriceToCalculate,
        liquidity,
        aboveMidMarket,
        data.token0_decimals,
        data.token1_decimals,
        token
      )
      tickAmounts.push(newTick)
      lastPrice = nextPriceToCalculate
    }
  })
  return tickAmounts
}

const calculateTick = (
  tick: number,
  lastPrice: bigint,
  nextPrice: bigint,
  liquidity: bigint,
  aboveMidMarket: boolean,
  token0Decimals: number,
  token1Decimals: number,
  token: PoolTokenInfo
) => {
  const args: [bigint, bigint, bigint, boolean] = [lastPrice, nextPrice, liquidity, false]
  if (aboveMidMarket) {
    const amt = Number(SqrtPriceMath.getAmount0Delta(...args)) / 10 ** token0Decimals
    return {
      tick: tick,
      price: tick2Price(tick, token),
      amount: token.selected === 0 ? amt : amt * tick2Price(tick, token),
    }
  }
  const amt = Number(SqrtPriceMath.getAmount1Delta(...args)) / 10 ** token1Decimals
  return {
    tick: tick,
    price: tick2Price(tick, token),
    amount: token.selected === 1 ? amt : amt * tick2Price(tick, token),
  }
}

export const isUpperTagClicked = (
  x: number,
  y: number,
  height: number,
  width: number,
  bounds: IBounds,
  highlightBounds: IBounds
) => {
  const yLocation = height - xAxisHeight
  const xLocation =
    (width * (highlightBounds.lower - bounds.lower)) / (bounds.upper - bounds.lower) +
    (width * (highlightBounds.upper - bounds.lower - (highlightBounds.lower - bounds.lower))) /
      (bounds.upper - bounds.lower)
  if (highlightBounds.lower !== undefined && highlightBounds.upper !== undefined) {
    if (y <= yLocation + tagSize / 2 && y >= yLocation - tagSize / 2) {
      return x >= xLocation - tagSize / 2 && x <= xLocation + tagSize / 2
    } else {
      return false
    }
  } else {
    return false
  }
}

export const isLowerTagClicked = (
  x: number,
  y: number,
  height: number,
  width: number,
  bounds: IBounds,
  highlightBounds: IBounds
) => {
  const yLocation = height - xAxisHeight
  if (highlightBounds.lower !== undefined && bounds.lower !== undefined && bounds.upper !== undefined) {
    const xLocation = (width * (highlightBounds.lower - bounds.lower)) / (bounds.upper - bounds.lower)
    if (y <= yLocation + tagSize / 2 && y >= yLocation - tagSize / 2) {
      return x >= xLocation - tagSize / 2 && x <= xLocation + tagSize / 2
    } else {
      return false
    }
  } else {
    return false
  }
}

export const highlightChosen = (
  x: number,
  y: number,
  height: number,
  width: number,
  bounds: IBounds,
  highlightBounds: IBounds
) => {
  const yLocation = height - xAxisHeight
  if (highlightBounds.lower !== undefined && highlightBounds.upper !== undefined) {
    const xLocationlower = (width * (highlightBounds.lower - bounds.lower)) / (bounds.upper - bounds.lower)
    const xLocationUpper = (width * (highlightBounds.upper - bounds.lower)) / (bounds.upper - bounds.lower)
    if (y <= yLocation) {
      if (x >= xLocationlower && x <= xLocationUpper) {
        return (
          !isLowerTagClicked(x, y, height, width, bounds, highlightBounds) &&
          !isUpperTagClicked(x, y, height, width, bounds, highlightBounds)
        )
      } else {
        return false
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

export const getTickFromX = (x: number, tickSpacing: number, bounds: IBounds, width: number, token: PoolTokenInfo) => {
  const tickClicked = (x / width) * (bounds.upper - bounds.lower) + bounds.lower
  return getNearestTick(tickClicked, tickSpacing, token)
}

export const getYAxisData = (maxValue: number, height: number) => {
  const yAxis: number[] = []
  if (maxValue) {
    const yAxisHeight = height - xAxisHeight
    const tickSize = yAxisHeight / maxTickHeight
    const incrementSize = maxValue / Math.floor(tickSize)
    const incrementDecimal = getDecimals(maxValue / Math.floor(tickSize))
    const cleanIncrement = getCleanIncrement(incrementSize, incrementDecimal)
    const totalTicks = Math.floor(maxValue / cleanIncrement)

    for (let i = 1; i <= totalTicks; i++) {
      yAxis.push(parseFloat((i * cleanIncrement).toFixed(Math.abs(incrementDecimal))))
    }
    return yAxis
  } else {
    return yAxis
  }
}

export const getDecimals = (item: number) => {
  return Math.log10(item) > 0 ? Math.floor(Math.log10(item)) : Math.floor(Math.log10(item))
}

export const getCleanIncrement = (incrementSize: number, incrementDecimal: number) => {
  if (incrementDecimal > 0) {
    const a = Math.floor(incrementSize / 10 ** incrementDecimal) * 10 ** incrementDecimal
    const inc = (incrementSize - a) / 10 ** (incrementDecimal - 1)
    const c = inc <= 2 ? 2 : inc <= 5 ? 5 : 10
    const d = c * 10 ** (incrementDecimal - 1)
    const cleanIncrement = a + d
    return cleanIncrement
  } else {
    const decimal = incrementDecimal * -1
    const inc = Math.floor(incrementSize * 10 ** decimal)
    const c = inc <= 2 ? 2 : inc <= 5 ? 5 : 10
    const d = c / 10 ** decimal
    const cleanIncrement = d
    return cleanIncrement
  }
}
