import { isWrappedNativeToken } from './isNativeToken'
import { isStableCoin } from './isStableCoin'
import { isWETH } from './isWeth'

export const shouldPrioritizeToken0 = (token0: string, token1: string, networkId: number) => {
  const token0IsStableCoin = isStableCoin(networkId, token0)
  const token1IsStableCoin = isStableCoin(networkId, token1)

  if (token0IsStableCoin || token1IsStableCoin) {
    return token0IsStableCoin
  }

  const token0IsWeth = isWETH(networkId, token0)
  const token1IsWeth = isWETH(networkId, token1)

  if (token0IsWeth || token1IsWeth) {
    return token0IsWeth
  }

  const token0IsNativeToken = isWrappedNativeToken(networkId, token0)
  const token1IsNativeToken = isWrappedNativeToken(networkId, token1)

  if (token0IsNativeToken || token1IsNativeToken) {
    return token0IsNativeToken
  }

  return true
}
