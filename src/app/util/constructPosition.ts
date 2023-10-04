import { PoolInfo } from '../contracts/getPoolInfo'
import { IToken } from '../lib/getToken'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { Q96, SqrtPriceMath, TickMath, nearestUsableTick } from '@/app/v3-sdk/v3/index'
import { parseUnits } from 'viem'
import { Pool, Position } from '@uniswap/v3-sdk'

export const constructPosition = async (
  token0: CurrencyAmount<IToken>,
  token1: CurrencyAmount<IToken>,
  poolInfo: PoolInfo,
  tick: {
    lower: number
    upper: number
  }
): Promise<Position> => {
  // construct pool instance
  const pool = new Pool(
    token0.currency,
    token1.currency,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  )

  // create/update position from input amounts
  return Position.fromAmounts({
    pool,
    tickLower: nearestUsableTick(tick.lower, pool.tickSpacing),
    tickUpper: nearestUsableTick(tick.upper, pool.tickSpacing),
    amount0: token0.quotient,
    amount1: token1.quotient,
    useFullPrecision: true,
  })
}

export function calculateRequiredTokenAmount(
  lowerTick: number,
  upperTick: number,
  currentTick: number,
  isToken0: boolean,
  amount: string,
  token: IToken
) {
  const sqrtRatioCurrentX96 = TickMath.getSqrtRatioAtTick(currentTick)
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(Math.min(lowerTick, upperTick))
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(Math.max(lowerTick, upperTick))

  const BNAmount = parseUnits(amount, token.decimals)
  if (BNAmount == 0n) {
    return '0'
  }
  const liquidity = isToken0
    ? maxLiquidityForAmount0Precise(sqrtRatioCurrentX96, sqrtRatioBX96, BNAmount)
    : maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, BNAmount)

  const requiredTokenAmount = isToken0
    ? SqrtPriceMath.getAmount1Delta(sqrtRatioAX96, sqrtRatioCurrentX96, liquidity, false)
    : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioBX96, liquidity, false)

  return requiredTokenAmount.toString()
}

function maxLiquidityForAmount0Precise(_sqrtRatioAX96: bigint, _sqrtRatioBX96: bigint, _amount0: bigint) {
  let sqrtRatioAX96 = _sqrtRatioAX96
  let sqrtRatioBX96 = _sqrtRatioBX96
  const amount0 = _amount0

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }

  const numerator = amount0 * sqrtRatioAX96 * sqrtRatioBX96
  const denominator = Q96 * (sqrtRatioBX96 - sqrtRatioAX96)

  const returnValue = numerator / denominator

  return returnValue
}

function maxLiquidityForAmount1(_sqrtRatioAX96: bigint, _sqrtRatioBX96: bigint, _amount1: bigint): bigint {
  let sqrtRatioAX96 = _sqrtRatioAX96
  let sqrtRatioBX96 = _sqrtRatioBX96
  const amount1 = _amount1

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }
  const returnValue = (amount1 * Q96) / (sqrtRatioBX96 - sqrtRatioAX96)

  return returnValue
}
