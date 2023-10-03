import { CushApi, PositionStatistics } from '@gfxlabs/oku'
import { RpcClient } from '@gfxlabs/jsrpc'

export const runBackTest = async (
  cush: RpcClient<CushApi>,
  poolAddress: string,
  tick: { lower: number; upper: number },
  amount0: string,
  amount1: string,
  timeStart: number,
  timeEnd: number
): Promise<PositionStatistics> => {
  window.log.log(poolAddress, tick, amount0, amount1, timeStart, timeEnd)
  try {
    const result = await cush.call('cush_backtestPositionInTimeRange', [
      poolAddress,
      tick.lower,
      tick.upper,
      amount0,
      amount1,
      timeStart,
      timeEnd,
    ])
    // TODO const response = await getBackTestPositionInTimeRange(poolAddress,tickLower,tickUpper,inputToken0,inputToken1,timeStart,timeEnd)

    return result
  } catch (err) {
    const error = err as Error
    window.log.log({ error })
    throw new Error(error.message)
  }
}

export default runBackTest
