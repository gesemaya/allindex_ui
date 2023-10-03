import { getTokenByAddress } from '../lib/getToken'

export const getTokenSymbol = (address: string, fallback_name: string | undefined, chain: number) => {
  if (address === '') {
    return fallback_name
  }
  let token_symbol = getTokenByAddress(address, chain).symbol
  if (!token_symbol || token_symbol === 'NULL') {
    token_symbol = fallback_name
  }
  return token_symbol!
}
