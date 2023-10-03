import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchV3Pool = async (
  cush: RpcClient<CushApi>,
  {
    pool_address,
    block_number,
  }: // num_obs = 1
  {
    pool_address: string
    block_number: number
    // num_obs: number
  }
) => {
  try {
    const data = await cush.call('cush_getV3Pool', [pool_address, block_number] as any)
    return data
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
