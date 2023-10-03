import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchSwapChart = async (
  cush: RpcClient<CushApi>,
  {
    tokenAddresses,
    granularity,
    startTime,
    endTime,
  }: {
    tokenAddresses: string[]
    granularity: number
    startTime: number
    endTime: number
  }
) => {
  try {
    return cush.call('cush_swapChart', [tokenAddresses, granularity, startTime, endTime])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
