import { IToken } from '../lib/getToken'
import { calculateGasMargin, sendEncodedFunctionData } from '../util/calculateGasMargin'
import { constructPosition } from '../util/constructPosition'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../constants/addresses'
import { getPoolInfo } from './getPoolInfo'
import { CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { AddLiquidityOptions, NonfungiblePositionManager } from '@uniswap/v3-sdk'
import { Address, Hex, PublicClient, WalletClient, parseUnits } from 'viem'
import { approveIfNeeded } from './getAllowance'

export async function addLiquidity({
  positionId,
  pool_address,
  user_address,
  token0,
  token1,
  provider,
  signer,
  tick,
  token0Amount,
  token1Amount,
  currentChain,
}: {
  positionId: string
  pool_address: Address
  user_address: Address
  token0: IToken
  token1: IToken
  provider: PublicClient
  signer: WalletClient
  tick: { lower: number; upper: number }
  token0Amount: bigint
  token1Amount: bigint
  currentChain: number
}) {
  await approveIfNeeded({
    token: token0.address,
    amount: token0Amount,
    provider,
    signer,
    approvee: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
  })
  await approveIfNeeded({
    token: token1.address,
    amount: token1Amount,
    provider,
    signer,
    approvee: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
  })

  const token0Raw = CurrencyAmount.fromRawAmount(token0, token0Amount.toString())

  const token1Raw = CurrencyAmount.fromRawAmount(token1, token1Amount.toString())

  const poolInfo = await getPoolInfo({ pool_address, provider })

  const positionToIncreaseBy = await constructPosition(token0Raw, token1Raw, poolInfo, tick)

  const addLiquidityOptions: AddLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(positionToIncreaseBy, addLiquidityOptions)

  return sendEncodedFunctionData(
    provider,
    signer,
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
    calldata as Hex,
    {
      value: BigInt(value),
    }
  )
}
