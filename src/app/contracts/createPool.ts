import { IToken } from '../lib/getToken'
import { Pool, encodeSqrtRatioX96 } from '@uniswap/v3-sdk'
import { parseUnits } from 'ethers'
import { Hex, encodeFunctionData } from 'viem'
import { uniswapNftManagerABI } from '../../generated'

export const createNewPoolWithRatio = ({
  token0,
  token1,
  fee,
  initialPrice,
}: {
  token0: IToken
  token1: IToken
  fee: number
  initialPrice: number
}) => {
  const initial = parseUnits(initialPrice.toString(), token1!.decimals)
  window.log.log(initialPrice, fee, encodeSqrtRatioX96(1, initial.toString()).toString(), initial.toString())

  const sqrtRatioX96 = encodeSqrtRatioX96(initial.toString(), 1).toString()

  const newPool = new Pool(token0, token1, fee, sqrtRatioX96, 0, 0, [])

  return newPool
}

export const getCreatePoolCallData = async ({
  token0,
  token1,
  fee,
  initialPrice,
}: {
  token0: IToken
  token1: IToken
  fee: number
  initialPrice: number
}): Promise<Hex> => {
  try {
    const parsedToken0 = parseUnits('1', token0.decimals)
    const parsedToken1 = parseUnits(initialPrice.toString(), token1.decimals)
    return encodeFunctionData({
      abi: uniswapNftManagerABI,
      functionName: 'createAndInitializePoolIfNecessary',
      args: [
        token0.address,
        token1.address,
        fee,
        BigInt(encodeSqrtRatioX96(parsedToken1.toString(), parsedToken0.toString()).toString()),
      ],
    })
  } catch (e) {
    window.log.error(e)
    throw new Error('Error in getCreatePoolCallData')
  }
}
