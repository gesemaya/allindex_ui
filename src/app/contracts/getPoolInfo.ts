import { Address, PublicClient } from 'viem'
import { getUniswapV3Pool } from '../../generated'

export interface PoolInfo {
  token0: Address
  token1: Address
  fee: number
  tickSpacing: number
  sqrtPriceX96: bigint
  liquidity: bigint
  tick: number
}

export const getPoolInfo = async ({
  pool_address,
  provider,
}: {
  pool_address: Address
  provider: PublicClient
}): Promise<PoolInfo> => {
  if (!provider) {
    throw new Error('No provider')
  }

  const poolContract = getUniswapV3Pool({
    address: pool_address,
  })

  const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
    poolContract.read.token0(),
    poolContract.read.token1(),
    poolContract.read.fee(),
    poolContract.read.tickSpacing(),
    poolContract.read.liquidity(),
    poolContract.read.slot0(),
  ])

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}
