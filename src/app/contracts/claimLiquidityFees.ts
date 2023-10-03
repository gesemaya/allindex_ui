import { IToken } from '../lib/getToken'
import { sendEncodedFunctionData } from '../util/calculateGasMargin'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../constants/addresses'
import { CollectOptions, NonfungiblePositionManager } from '@uniswap/v3-sdk'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { PublicClient, WalletClient, Hex } from 'viem'

export async function claimLiquidityFees({
  positionId,
  user_address,
  token0,
  token1,
  signer,
  provider,
  token0ExpectedOwed,
  token1ExpectedOwed,
  currentChain,
}: {
  positionId: string
  user_address: `0x${string}`
  token0: IToken
  token1: IToken
  signer: WalletClient
  provider: PublicClient
  token0ExpectedOwed: bigint
  token1ExpectedOwed: bigint
  currentChain: number
}) {
  const token0Raw = CurrencyAmount.fromRawAmount(token0, token0ExpectedOwed.toString())
  const token1Raw = CurrencyAmount.fromRawAmount(token1, token1ExpectedOwed.toString())

  const collectOptions: CollectOptions = {
    tokenId: positionId,
    expectedCurrencyOwed0: token0Raw,
    expectedCurrencyOwed1: token1Raw,
    recipient: user_address,
  }

  const { calldata, value } = NonfungiblePositionManager.collectCallParameters(collectOptions)
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
