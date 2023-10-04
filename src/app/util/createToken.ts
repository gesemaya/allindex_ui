import { Token } from '@/app/v3-sdk/token'

export const createToken = ({
  chainId = 1,
  address,
  decimals = 18,
  symbol,
  name,
}: {
  chainId: number
  address: `0x${string}`
  decimals: number
  symbol: string
  name: string
}) => new Token(chainId, address, decimals, symbol, name)
