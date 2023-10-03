import { boba, bsc, polygon, arbitrum, optimism, mainnet, goerli, moonbeam, zkSync } from 'wagmi/chains'

export const GFX_RPC_URL = 'https://mainnet-rpc.apiary.software'
export const GFX_WS_URL = 'wss://mainnet-rpc.apiary.software'
export const BSC_RPC_URL = 'https://bsc-dataseed3.binance.org'
export const BOBA_RPC_URL = `https://mainnet.boba.network`
export const ZKSYNC_RPC_URL = `wss://mainnet.era.zksync.io/ws`
export const MOONBEAM_RPC_URL = `https://rpc.api.moonbeam.network`
export const GOERLI_RPC_URL = 'https://goerli-brilliant.staging.gfx.town'
export const POLYGON_RPC_URL = 'https://rpc.ankr.com/polygon'
export const OPTIMISM_RPC_URL = 'https://rpc.ankr.com/optimism'
export const ARBITRUM_RPC_URL = 'https://rpc.ankr.com/arbitrum'

// a function that returns the url for the given chainId
export const GET_RPC_URL = (chainId: number = 1) => {
  switch (chainId) {
    case mainnet.id: // mainnet
      return GFX_RPC_URL
    case goerli.id: // goerli
      return GOERLI_RPC_URL
    case bsc.id:
      return BSC_RPC_URL
    case boba.id:
      return BOBA_RPC_URL
    case moonbeam.id:
      return MOONBEAM_RPC_URL
    case polygon.id:
      return POLYGON_RPC_URL
    case optimism.id:
      return OPTIMISM_RPC_URL
    case arbitrum.id:
      return ARBITRUM_RPC_URL
    case zkSync.id:
      return ZKSYNC_RPC_URL
    default:
      return GFX_RPC_URL
  }
}
