import { IToken } from '../lib/getToken'
import { constructPosition } from '../util/constructPosition'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../constants/addresses'
import { approveIfNeeded } from './getAllowance'
import { getPoolInfo } from './getPoolInfo'
import { CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Address, Hex, PublicClient, WalletClient, encodeFunctionData, parseUnits } from 'viem'
import { uniswapNftManagerABI } from '../../generated'

export async function getDeployPositionCallData({
  user_address,
  pool,
  token0,
  token1,
  token0Amount,
  token1Amount,
  provider,
  signer,
  tick,
  currentChain,
}: {
  user_address: Address
  pool: Address
  provider: PublicClient
  token0: IToken
  token1: IToken
  token0Amount: bigint
  token1Amount: bigint
  signer: WalletClient
  tick: {
    lower: number
    upper: number
  }
  currentChain: number
}): Promise<Hex> {
  try {
    const token0Raw = CurrencyAmount.fromRawAmount(token0, token0Amount.toString())
    const token1Raw = CurrencyAmount.fromRawAmount(token1, token1Amount.toString())

    //TODO: use of uniswap api - waiting on koray
    const poolInfo = await getPoolInfo({ pool_address: pool, provider })
    const positionToMint = await constructPosition(token0Raw, token1Raw, poolInfo, tick)
    const mintAmount = positionToMint.mintAmountsWithSlippage(new Percent(75, 10_000))
    return encodeFunctionData({
      abi: uniswapNftManagerABI,
      functionName: 'mint',
      args: [
        {
          deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
          recipient: user_address,
          fee: poolInfo.fee,
          token0: poolInfo.token0,
          token1: poolInfo.token1,
          tickLower: tick.lower,
          tickUpper: tick.upper,
          amount0Min: BigInt(mintAmount.amount0.toString()),
          amount1Min: BigInt(mintAmount.amount1.toString()),
          amount0Desired: BigInt(positionToMint.mintAmounts.amount0.toString()),
          amount1Desired: BigInt(positionToMint.mintAmounts.amount1.toString()),
        },
      ],
    })
  } catch (err) {
    const error = err
    window.log.error(err)

    throw new Error('Error in getDeployPositionCallData')
  }
}

export const deployPosition = async ({
  user_address,
  pool_address,
  token0,
  token1,
  token0Amount,
  token1Amount,
  provider,
  signer,
  tick,
  currentChain,
}: {
  user_address: Address
  pool_address: Address
  provider: PublicClient
  token0: IToken
  token1: IToken
  token0Amount: bigint
  token1Amount: bigint
  signer: WalletClient
  tick: {
    lower: number
    upper: number
  }
  currentChain: number
}) => {
  try {
    // first try to get approvals
    const approvee = NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain)
    await approveIfNeeded({
      signer,
      provider,
      amount: token0Amount,
      token: token0.address,
      approvee,
    })
    await approveIfNeeded({
      signer,
      provider,
      amount: token1Amount,
      token: token1.address,
      approvee,
    })
    const calldata = await getDeployPositionCallData({
      user_address,
      pool: pool_address,
      provider,
      token0,
      token1,
      token0Amount,
      token1Amount,
      signer,
      tick,
      currentChain,
    })
    return signer.sendTransaction({
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
      chain: signer.chain,
      account: user_address,
    })
  } catch (err) {
    const error = err
    window.log.error(err)

    throw new Error('Error in deployPosition')
  }
}

export const getMintCallData = async ({
  token0,
  token1,
  fee,
  tickLower,
  tickUpper,
  token0Amount,
  token1Amount,
  currentChain,
  provider,
  recipient,
}: {
  token0: IToken
  token1: IToken
  fee: number
  tickLower: number
  tickUpper: number
  token0Amount: string
  token1Amount: string
  currentChain: number
  provider: PublicClient
  recipient: Address
}) => {
  try {
    const parsedToken0 = parseUnits(token0Amount, token0.decimals)
    const parsedToken1 = parseUnits(token1Amount, token1.decimals)
    window.log.log(
      token0.address,
      token1.address,
      fee,
      tickLower,
      tickUpper,
      parsedToken0,
      parsedToken1,
      0,
      0,
      recipient,
      Math.floor(Date.now() / 1000) + 600
    )
    return encodeFunctionData({
      abi: uniswapNftManagerABI,
      functionName: 'mint',
      args: [
        {
          token0: token0.address,
          token1: token1.address,
          fee,
          tickLower,
          tickUpper,
          amount0Desired: parsedToken0,
          amount1Desired: parsedToken1,
          amount0Min: 0n,
          amount1Min: 0n,
          recipient,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 600),
        },
      ],
    })
  } catch (e) {
    window.log.error(e)
    throw new Error('Error in getMintCallData')
  }
}
