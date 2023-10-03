import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchFeeTiersPositionCount = async (
  cush: RpcClient<CushApi>,
  {
    token0Address,
    token1Address,
  }: {
    token0Address: string
    token1Address: string
  }
) => {
  try {
    return cush.call('cush_getFeeTiersPositionCount', [token0Address, token1Address])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
