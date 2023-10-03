import { sendEncodedFunctionData } from '../util/calculateGasMargin'
import { MAXUINT128 } from '../constants/misc'
import { Address, PublicClient, encodeFunctionData, getContract, WalletClient } from 'viem'
import { uniswapNftManagerABI } from '../../generated'

export async function removeLiquidity({
  positionId,
  user_address,
  contract,
  provider,
  signer,
  removePercent = 100,
}: {
  positionId: string
  contract: Address
  user_address: `0x${string}`
  provider: PublicClient
  signer: WalletClient
  removePercent?: number
}) {
  const nftManager = getContract({
    address: contract,
    abi: uniswapNftManagerABI,
    publicClient: provider,
    walletClient: signer,
  })
  const chainPosition = await nftManager.read.positions([BigInt(positionId)])
  let liq = chainPosition[7]
  if (removePercent < 100) {
    liq = (liq * BigInt(removePercent)) / 100n
  }

  const decreaseLiquidityTxn = encodeFunctionData({
    abi: uniswapNftManagerABI,
    functionName: 'decreaseLiquidity',
    args: [
      {
        tokenId: BigInt(positionId),
        liquidity: liq,
        amount0Min: 0n,
        amount1Min: 0n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
      },
    ],
  })

  const collectFeesTxn = encodeFunctionData({
    abi: uniswapNftManagerABI,
    functionName: 'collect',
    args: [
      {
        tokenId: BigInt(positionId),
        recipient: user_address,
        amount0Max: MAXUINT128,
        amount1Max: MAXUINT128,
      },
    ],
  })

  return sendEncodedFunctionData(
    provider,
    signer,
    contract as Address,
    encodeFunctionData({
      abi: uniswapNftManagerABI,
      functionName: 'multicall',
      args: [[decreaseLiquidityTxn, collectFeesTxn]],
    })
  )
}

export const claimAndRemoveLiquidityMulticall = removeLiquidity
