// take in a price and calculate the tick

import { TickMath } from '@/app/v3-sdk/v3'

export const getTickFromPrice = (price: number, token0decimals: number, token1decimals: number, direction: boolean) => {
  if (isNaN(price) || price === 0) return 0
  const newPrice = direction ? price : 1 / price
  // window.log.log(newPrice)
  const sqrtPrice = Math.sqrt(2 ** 192 * newPrice * (10 ** token1decimals / 10 ** token0decimals))
  // window.log.log(sqrtPrice)
  const sqrtPriceJSBI = BigInt(sqrtPrice)
  // window.log.log(sqrtPriceJSBI)
  return TickMath.getTickAtSqrtRatio(sqrtPriceJSBI)
}

export const getPriceFromTick = (tick: number, token0decimals: number, token1decimals: number, direction: boolean) => {
  if (isNaN(tick)) {
    return 0
  } else {
    const sqrtPriceJSBI = TickMath.getSqrtRatioAtTick(tick)
    const sqrtPrice = Number(sqrtPriceJSBI)
    const newPrice = sqrtPrice ** 2 / (2 ** 192 * (10 ** token1decimals / 10 ** token0decimals))
    return direction ? newPrice : 1 / newPrice
  }
}

export const getNearestTick = (tick: number, increment: number) => {
  const tickRemainder = tick % increment
  const baseTick = tick - tickRemainder
  if (tickRemainder >= increment / 2) {
    return baseTick + increment
  } else {
    return baseTick
  }
}

export const getTickSpacing = (fee: number) => {
  switch (fee) {
    case 100:
      return 1
    case 500:
      return 10
    case 3000:
      return 60
    case 10000:
      return 200
    default:
      return 60
  }
}
