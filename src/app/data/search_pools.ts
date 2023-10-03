import { CushApi, PoolSummary, SearchFilterOpts } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export type IPoolSummary = PoolSummary
// Can take in a Pool Address or Token Address
export const searchPoolsByAddress = async (cush: RpcClient<CushApi>, pool_address: string) => {
  try {
    return cush.call('cush_searchPoolsByAddress', [pool_address])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const searchPoolsByTokenNameOrSymbol = async (cush: RpcClient<CushApi>, token_name_symbol: string) => {
  try {
    return cush.call('cush_searchPoolsByTokenNameOrSymbol', [token_name_symbol])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const searchPoolsByTokenNamesOrSymbols = async (cush: RpcClient<CushApi>, token0: string, token1: string) => {
  try {
    return cush.call('cush_searchPoolsByTokenNamesOrSymbol', [token0, token1])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const searchPoolsByTokenAddresses = async (
  cush: RpcClient<CushApi>,
  token0Address: string,
  token1Address: string
) => {
  try {
    return cush.call('cush_searchPoolsByTokenAddresses', [token0Address, token1Address])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const searchPoolsByList = async (cush: RpcClient<CushApi>, token_list: string[]) => {
  try {
    return cush.call('cush_searchPoolsByList', [token_list])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const searchBatchByAddresses = async (cush: RpcClient<CushApi>, tokenAddresses: string[]) => {
  const opts: SearchFilterOpts = {
    fee_tiers: [],
    result_offset: 0,
    sort_by: 'volume',
    result_size: 20,
    sort_order: false,
  }
  try {
    return cush.call('cush_batchSearchAddresses', [tokenAddresses, opts])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const search = async (cush: RpcClient<CushApi>, term: string) => {
  const opts: SearchFilterOpts = {
    fee_tiers: [],
    result_offset: 0,
    sort_by: 'tvl_usd',
    result_size: 20,
    sort_order: false,
  }
  try {
    return cush.call('cush_search', [term, opts])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
