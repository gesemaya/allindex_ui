import { calculateGasMargin, sendEncodedFunctionData, updateGasMargin } from '../util/calculateGasMargin'
import { CHAINLINK_LIMIT_ORDER_CONTRACT, DEFAULT_EOA_ADDRESS_FOR_QUOTES, ZERO_ADDRESS } from '../constants/addresses'
import { Int } from '@gfxlabs/oku'
import { Address, encodeFunctionData, getContract, Hex, WalletClient } from 'viem'
import { PublicClient } from 'wagmi'
import { ReturnTypeOfMethod } from '../hooks/useClient'
import { chainlinkLimitOrderABI } from '../../generated'
import { nearestUsableTick } from '@/app/v3-sdk/v3'

export const createLimitOrderContract = (signer?: WalletClient, provider?: PublicClient) => {
  // window.log.log(CHAINLINK_LIMIT_ORDER_CONTRACT(chain))

  let chainId = 1
  if (signer && signer.chain) {
    chainId = signer.chain.id
  } else if (provider && provider.chain) {
    chainId = provider.chain.id
  }

  const address = CHAINLINK_LIMIT_ORDER_CONTRACT(chainId)
  return getContract({
    abi: chainlinkLimitOrderABI,
    address: address,
    publicClient: provider,
    walletClient: signer,
  })
}

export interface INewOrder {
  pool: string
  targetTick: number
  amount: bigint
  direction: boolean | number
  startingNode?: number
  signer: WalletClient
  provider: PublicClient
  chain: number
  tickSpacing: number
}

/*
    pool: address of the pool that the order is for.
    targetTick: the tick that the order is targeting. Will automatically round to the nearest tick.
    amount: amount of token to sell or buy. In BigNumber format.
    direction: true for sell, false for buy.
        If current tick needs to move up to meet targetTick, then direction is true.
        If current tick needs to move down to meet targetTick, then direction is false.
    startingNode: Need to determine a good startingNode IF it's a unique order (No other users have added liquidity to it)
        This is a node that is close to the targetTick.
        NOT used if the order is not unique.
        Can be 0. Will have the contract determine the startingNode.
*/

/*
    Contract must be approved to spend the user's buy token
    After the order is created, the contract will emit a 'NewOrder' event.
    Event includes info about suer's order, including userDataId
    userDataId is used to identify the user's order, and the OrderFilled event will include the userDataId
*/

export const newOrder = async ({
  pool,
  targetTick,
  amount,
  direction,
  signer,
  provider,
  chain,
  tickSpacing,
}: INewOrder): Promise<Hex> => {
  try {
    const nearestTick = nearestUsableTick(targetTick, tickSpacing)
    const dir = direction ? 1 : 0
    //Deadline is the date in 1 hour days, expressed in ms
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime()
    return sendEncodedFunctionData(
      provider,
      signer,
      CHAINLINK_LIMIT_ORDER_CONTRACT(chain),
      encodeFunctionData({
        functionName: 'newOrder',
        abi: chainlinkLimitOrderABI,
        args: [pool as Address, nearestTick, amount, dir === 1, 0n, BigInt(deadline)],
      })
    )
  } catch (error) {
    window.log.log(error)
    throw new Error(`Error for newOrder in limitOrder.ts, ${error}`)
  }
}

export interface IClaimOrder {
  userDataId: Int
  userAddress: `0x${string}`
  signer: WalletClient
  provider: PublicClient
  chain: number
}

/*
    userDataId: the userDataId of the order that the user wants to claim. Only claimable once an OrderFilled event is emitted.
    getFeePerUser() is called to get the fee that the user needs to pay to claim the order. If too much is sent, a refund will be payable to the user.
    OR
    The contract can be approved to spend the user's tokens, and the user can call claimOrder() directly.
*/
export const claimOrder = async ({ provider, userDataId, userAddress, signer, chain }: IClaimOrder) => {
  try {
    const limitOrderContract = createLimitOrderContract(signer, provider)
    const userFee = await limitOrderContract.read.getFeePerUser([BigInt(userDataId)])
    window.log.log(userFee)
    return sendEncodedFunctionData(
      provider,
      signer,
      CHAINLINK_LIMIT_ORDER_CONTRACT(chain),
      encodeFunctionData({
        functionName: 'claimOrder',
        abi: chainlinkLimitOrderABI,
        args: [BigInt(userDataId), userAddress],
      }),
      {
        value: userFee,
      }
    )
  } catch (error) {
    window.log.log(error)
    throw new Error(`Error for claimOrder in limitOrder.ts, ${error}`)
  }
}

export interface ICancelOrder {
  pool: string
  targetTick: number
  direction: boolean
  signer: WalletClient
  provider: PublicClient
  chain: number
}

export const cancelOrder = async ({ pool, targetTick, direction, signer, provider, chain }: ICancelOrder) => {
  try {
    window.log.log(pool, targetTick, direction)
    const deadline = Date.now() + 60 * 60 // 1 hour from moment of pressing cancel
    return sendEncodedFunctionData(
      provider,
      signer,
      CHAINLINK_LIMIT_ORDER_CONTRACT(chain),
      encodeFunctionData({
        functionName: 'cancelOrder',
        abi: chainlinkLimitOrderABI,
        args: [pool as Address, targetTick, direction, BigInt(deadline)],
      })
    )
  } catch (error) {
    window.log.log(error)
    throw new Error(`Error for cancelOrder in limitOrder.ts, ${error}`)
  }
}

export interface IPoolToData {
  pool: string
  provider: PublicClient
  chain: number
}

export interface IMinimumAssets {
  tokenAddress: string
  provider: PublicClient
  chain: number
}

export interface IPooToDataResponse {}

export const poolToData = async ({ pool, provider }: IPoolToData) => {
  try {
    const limitOrderContract = createLimitOrderContract(undefined, provider)
    const tx = await limitOrderContract.read.poolToData([pool as Address])
    return tx
  } catch (error) {
    window.log.log(error)
    throw new Error(`Error in poolToData in limitOrder.ts, ${error}`)
  }
}

export const minimumAssets = async ({ tokenAddress, provider }: IMinimumAssets) => {
  try {
    const limitOrderContract = createLimitOrderContract(undefined, provider)
    return await limitOrderContract.read.minimumAssets([tokenAddress as Address])
  } catch (error) {
    window.log.log(error)
    throw new Error(`Error for minimumAssets in limitOrder.ts, ${error}`)
  }
}
