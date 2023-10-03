import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchTopPools = async (
  cush: RpcClient<CushApi>,
  {
    result_size = 30,
    sort_by = 't0_change_usd',
    sort_order = false,
  }: {
    result_size?: number
    sort_by?: string
    sort_order?: boolean
  }
) => {
  try {
    return cush.callRaw('cush_topPools', [{ result_size, sort_by, sort_order }])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
