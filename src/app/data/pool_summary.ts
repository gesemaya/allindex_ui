import { getMillisecondsFromNow, getMillisecondsInDays } from '../util/getMillisecondsSince'
import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchPoolSummary = async (
  cush: RpcClient<CushApi>,
  {
    pool_address,
    days_ago = 0,
    num_days = 7,
    show_actual = false,
  }: {
    pool_address: string
    days_ago?: number
    num_days?: number
    show_actual?: boolean
  }
) => {
  const timestamp = getMillisecondsFromNow(days_ago)
  const lookback = getMillisecondsInDays(num_days)
  try {
    return cush.call('cush_summary', [pool_address, timestamp, lookback, show_actual])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
