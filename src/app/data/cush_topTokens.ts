import { common_Address, CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchTopTokens = async (
  cush: RpcClient<CushApi>,
  {
    addresses,
  }: {
    addresses: common_Address[] | never[]
  }
) => {
  try {
    return cush.call('cush_topTokens', [addresses])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
