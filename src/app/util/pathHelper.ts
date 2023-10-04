import { CushApi } from '@gfxlabs/oku'
import { fetchPoolSummary } from '../data/pool_summary'
import { RpcClient } from '@gfxlabs/jsrpc'
import { isAddress } from 'ethers'
import { Location } from 'react-router-dom'

/**
 * Given the protocol address and the chain, returns the url for the pool
 * @param poolAddress address of the pool
 * @param currentChain current chain selected
 */
export function poolPath(poolAddress: string, currentChain: string): string {
  return `/${currentChain.replace(' ', '').toLowerCase()}/pool/${poolAddress}`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param poolAddress address of the pool
 * @param currentChain current chain selected
 */
export function liquidityPath(poolAddress: string, currentChain: string): string {
  return `/${currentChain.replace(' ', '').toLowerCase()}/liquidity/${poolAddress}`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param poolAddress address of the pool
 * @param currentChain current chain selected
 */
export function chartPath(poolAddress: string, currentChain: string): string {
  return `/${currentChain.replace(' ', '').toLowerCase()}/chart/${poolAddress}`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param token1
 * @param token2
 * @param token2
 * @param currentChain current chain selected
 */
export function swapPath(token1: string, token2: string, currentChain: string): string {
  window.log.log(currentChain)
  return `/${currentChain.replace(' ', '').toLowerCase()}/swap/${token1}/${token2}`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param poolAddress address of the pool
 * @param currentChain current chain selected
 */
export function analyticsPath(poolAddress: string, currentChain: string): string {
  return `/${currentChain.toLowerCase()}/analytics/overview/`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param currentChain current chain selected
 */
export function orderPath(currentChain: string): string {
  return `/${currentChain.replace(' ', '').toLowerCase()}/order`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param location current  lcoaiton
 */
export function getURLInfo(location: Location): {
  pageParam: string
  chainParam: string
  poolParam: string
  state: string
} {
  const pageParam = location.pathname.split('/')[1] === undefined ? '' : location.pathname.split('/')[1]
  const chainParam = location.pathname.split('/')[2] === undefined ? '' : location.pathname.split('/')[2]
  const poolParam = location.pathname.split('/')[3] === undefined ? '' : location.pathname.split('/')[3]
  const state = location.state
  return { pageParam, chainParam, poolParam, state }
}
