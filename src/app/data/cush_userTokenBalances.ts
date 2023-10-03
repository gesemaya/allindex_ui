import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchUserTokenBalances = async (cush: RpcClient<CushApi>, userAddress: string) => {
  try {
    return cush.call('cush_userTokenBalances', [userAddress, 0])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
