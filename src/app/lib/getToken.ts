import { ZERO_ADDRESS } from '../constants/addresses'
import { DefaultTokenList } from '../../config'
import noTokenLogo from '../assets/no-token-logo.webp'
import { CHAIN_INFO } from '@/app/constants/chainInfo'
import { createToken } from '../util/createToken'
import { getTokenLogoUrl } from '../util/getTokenLogo'
import { TokenInfo, TokenList } from './tokenList'
import { Token } from '@/app/v3-sdk/token'

export interface IToken extends Token {
  logoURI: string
}

const nullToken = (symbol: string) => {
  return {
    chainId: 1,
    address: ZERO_ADDRESS,
    decimals: 18,
    name: 'UNKNOWN TOKEN',
    symbol: symbol,
    logoURI: noTokenLogo,
    isNative: false,
    isToken: true,
  } as any
}

const formKey = (symbol: string, chain: number): string => {
  return `${symbol.toUpperCase()}_${chain}`
}

const indexTokenList = (t: TokenList): Map<string, TokenInfo> => {
  const o = new Map()
  t.tokens.forEach((tok) => {
    if (tok.logoURI) {
      if (tok.logoURI.includes('ipfs://')) {
        tok.logoURI = tok.logoURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
      }
    }
    o.set(formKey(tok.symbol.toUpperCase(), tok.chainId), tok)
    o.set(formKey(tok.address.toLowerCase(), tok.chainId), tok)
  })
  return o
}

const defaultTokenListIndex = indexTokenList(DefaultTokenList)

export const NewDefaultToken = (chainId: number) => {
  return getTokenByAddress('', chainId)
}

export const getTokenByAddress = (addr: string, chain: number): IToken => {
  if (!CHAIN_INFO[chain]) {
    return nullToken('NULL')
  }
  if (!addr || addr == '' || addr === ZERO_ADDRESS) {
    // return native token
    const { address, decimals, name, symbol, WETH9Address } = CHAIN_INFO[chain].nativeCurrency

    const SDKtoken = createToken({ chainId: chain, address, decimals, name, symbol }) as IToken
    const logoURI = getTokenLogoUrl(WETH9Address, chain)
    SDKtoken.logoURI = logoURI || noTokenLogo //token.logoURI || noTokenLogo

    return SDKtoken
  }
  const token = defaultTokenListIndex.get(formKey(addr, chain))
  if (!token) {
    return nullToken('NULL')
  }
  const { chainId, address: tokenAddress, decimals, name, symbol } = token
  const address = tokenAddress as `0x${string}`
  const SDKtoken = createToken({ chainId, address, decimals, name, symbol }) as IToken
  SDKtoken.logoURI = token.logoURI || noTokenLogo
  return SDKtoken
}
