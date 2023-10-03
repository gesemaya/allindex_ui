import { IToken } from '../lib/getToken'
import { sendEncodedFunctionData } from '../util/calculateGasMargin'
import { getNearestTick, getTickSpacing } from '../util/calculateTick'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../constants/addresses'
import { getCreatePoolCallData } from './createPool'
import { getMintCallData } from './deployPosition'
import { Address, WalletClient, encodeFunctionData, parseUnits } from 'viem'
import { PublicClient } from 'wagmi'
import { approveIfNeeded } from './getAllowance'
import { uniswapNftManagerABI } from '../../generated'

export const createPoolAddLiqMulticall = async (
  token0: IToken,
  token1: IToken,
  fee: number,
  initialPrice: number,
  token0Amount: number,
  token1Amount: number,
  user_address: Address,
  tick: { lower: number; upper: number },
  signer: WalletClient,
  provider: PublicClient,
  currentChain: number
) => {
  try {
    const newPoolCallData = await getCreatePoolCallData({
      token0,
      token1,
      fee,
      initialPrice,
    })

    const deployPositionCallData = await getMintCallData({
      token0,
      token1,
      token0Amount: token0Amount.toString(),
      token1Amount: token1Amount.toString(),
      tickLower: getNearestTick(tick.lower, getTickSpacing(fee)!),
      tickUpper: getNearestTick(tick.upper, getTickSpacing(fee)!),
      fee,
      provider,
      currentChain,
      recipient: user_address,
    })

    await approveIfNeeded({
      token: token0.address,
      amount: parseUnits(token0Amount.toString(), token0.decimals),
      provider,
      signer,
      approvee: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
    })

    await approveIfNeeded({
      token: token1.address,
      amount: parseUnits(token1Amount.toString(), token1.decimals),
      provider,
      signer,
      approvee: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
    })

    return sendEncodedFunctionData(
      provider,
      signer,
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
      encodeFunctionData({
        abi: uniswapNftManagerABI,
        functionName: 'multicall',
        args: [[newPoolCallData, deployPositionCallData]],
      })
    )
  } catch (e) {
    window.log.log(e)

    throw new Error('Error creating pool')
  }
}
