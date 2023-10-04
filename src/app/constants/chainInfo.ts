import arbitrumLogoUrl from '@/app/assets/arbitrum-logo.svg'
import bobaLogoUrl from '@/app/assets/boba-logo.png'
import bscLogoUrl from '@/app/assets/bsc-logo.svg'
import ethLogoUrl from '@/app/assets/ethereum-logo.png'


import goerliLogoUrl from '@/app/assets/goerli-logo.svg'
import moonbeamLogoUrl from '@/app/assets/moonbeam-logo.svg'
import optimismLogoUrl from '@/app/assets/optimism-logo.svg'
import polygonLogoUrl from '@/app/assets/polygon-logo.png'
import zksyncLogoUrl from '@/app/assets/zksync-logo.svg'
import { Chain } from 'wagmi'
import { bsc, arbitrum, goerli, mainnet, optimism, polygon, boba, moonbeam, zkSync } from 'wagmi/chains'
import { ZERO_ADDRESS } from './addresses'

export const CHAINS_LIST = [mainnet, polygon, goerli, arbitrum, optimism, bsc, boba, moonbeam, zkSync] as const

export const getChainIdFromName = (name: string = 'ethereum') => {
  // Removing space for two words name as 'Arbitrum One"
  name.replace(' ', '').toLowerCase()
  switch (name) {
    case 'ethereum':
      return mainnet.id
    case 'polygon':
      return polygon.id
    case 'optimism':
      return optimism.id
    case 'arbitrum':
    case 'arbitrumone':
      return arbitrum.id
    case 'bsc':
    case 'bnbsmartchain':
      return bsc.id
    case 'boba':
      return boba.id
    case 'moonbeam':
      return moonbeam.id
    case 'goerli':
      return goerli.id
    case 'zksync':
    case 'zkSync':
      return zkSync.id
    default:
      return 0
  }
}
export const GFX_CHAT = {
  WS_PATH: (url: string) => {
    let base = new URL(url)
    base.protocol = base.protocol.replace('http', 'ws')
    base.pathname = (base.pathname + '/ws').replaceAll('//ws', '/ws')
    return base.toString()
  },
}

export const isValidChain = (chain: number) => {
  return !!CHAIN_MAP_ID[chain.toString()]
}

export const isValidChainName = (chain?: string) => {
  if (!chain) {
    return false
  }
  return !!CHAIN_MAP_INTERNALNAME[chain]
}

export interface IChainInfo extends Chain {
  logoUrl: string
  scanSite: string
  scanUrl: string
  defaultPool: string
  internalName: string
  defaultToken0: string
  defaultToken1: string
  tokenList: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
    address: `0x${string}`
    WETH9Address: `0x${string}`
  }
  blocksUntilBehind: number
}

export const CHAIN_INFO: { [chainId: number]: IChainInfo } = {
  [mainnet.id]: {
    ...mainnet,
    blocksUntilBehind: 10,
    logoUrl: ethLogoUrl,
    scanSite: 'Etherscan',
    scanUrl: 'https://etherscan.io/',
    defaultPool: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
    defaultToken0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    defaultToken1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    tokenList: [
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    ],
    internalName: 'ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  },
  [goerli.id]: {
    ...goerli,
    blocksUntilBehind: 10,
    logoUrl: goerliLogoUrl,
    scanSite: 'Etherscan (Goerli)',
    scanUrl: 'https://goerli.etherscan.io/',
    defaultPool: '0xD11ee14805642dCb5BF840845836AFe3cfc16383',
    defaultToken0: '0x3a034fe373b6304f98b7a24a3f21c958946d4075',
    defaultToken1: '0x695364ffaa20f205e337f9e6226e5e22525838d9',
    tokenList: [
      '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      '0x509ee0d083ddf8ac028f2a56731412edd63223b9',
      '0xc04b0d3107736c32e19f1c62b2af67be61d63a05',
      '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    ],
    internalName: 'goerli',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  },
  [polygon.id]: {
    ...polygon,
    blocksUntilBehind: 75,
    logoUrl: polygonLogoUrl,
    scanSite: 'Polygon Scan',
    scanUrl: 'https://polygonscan.com/',
    defaultPool: '0xa374094527e1673a86de625aa59517c5de346d32',
    defaultToken0: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    defaultToken1: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    tokenList: [
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    ],
    internalName: 'polygon',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    },
  },
  [optimism.id]: {
    ...optimism,
    blocksUntilBehind: 75,
    logoUrl: optimismLogoUrl,
    scanSite: 'Optimism Explorer',
    scanUrl: 'https://optimistic.etherscan.io/',
    defaultPool: '0x1c3140ab59d6caf9fa7459c6f83d4b52ba881d36',
    defaultToken0: '0x4200000000000000000000000000000000000042',
    defaultToken1: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    tokenList: [
      '0x4200000000000000000000000000000000000006',
      '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      '0x68f180fcce6836688e9084f035309e29bf0a2095',
      '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    ],
    internalName: 'optimism',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0x4200000000000000000000000000000000000006',
    },
  },
  [arbitrum.id]: {
    ...arbitrum,
    blocksUntilBehind: 500,
    logoUrl: arbitrumLogoUrl,
    scanSite: 'Arbiscan',
    scanUrl: 'https://arbiscan.io/',
    defaultPool: '0xcda53b1f66614552f834ceef361a8d12a0b8dad8',
    defaultToken0: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    defaultToken1: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    tokenList: [
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    ],
    internalName: 'arbitrum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    },
  },
  [bsc.id]: {
    ...bsc,
    blocksUntilBehind: 50,
    logoUrl: bscLogoUrl,
    scanSite: 'BscScan',
    scanUrl: 'https://bscscan.com/',
    defaultPool: '0x6fe9e9de56356f7edbfcbb29fab7cd69471a4869',
    defaultToken0: '0x55d398326f99059ff775485246999027b3197955',
    defaultToken1: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    tokenList: [
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      '0x55d398326f99059ff775485246999027b3197955',
      '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    ],
    internalName: 'bsc',
    nativeCurrency: {
      name: 'Binance Coin (BNB)',
      symbol: 'BNB',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
  },
  [boba.id]: {
    ...boba,
    blocksUntilBehind: 5,
    logoUrl: bobaLogoUrl,
    scanSite: 'BobaScan',
    scanUrl: 'https://bobascan.com/',
    defaultPool: '0xdF37543dae7986E48E3ce83F390A828A9F3D23BA',
    defaultToken0: '0x66a2a913e447d6b4bf33efbec43aaef87890fbbc',
    defaultToken1: '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
    tokenList: [
      '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
      '0x5de1677344d3cb0d7d465c10b72a8f60699c062d',
      '0x66a2a913e447d6b4bf33efbec43aaef87890fbbc',
      '0xdc0486f8bf31df57a952bcd3c1d3e166e3d9ec8b',
    ],
    internalName: 'boba',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
    },
  },
  [moonbeam.id]: {
    ...moonbeam,
    blocksUntilBehind: 15,
    logoUrl: moonbeamLogoUrl,
    scanSite: 'MoonScan',
    scanUrl: 'https://moonscan.io/',
    defaultPool: '0xba66370d96a9d61afa66283900b78c1f6ed02782',
    defaultToken0: '0xab3f0245b83feb11d15aaffefd7ad465a59817ed',
    defaultToken1: '0xacc15dc74880c9944775448304b263d191c6077f',
    tokenList: [
      '0xacc15dc74880c9944775448304b263d191c6077f',
      '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
      '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
      '0x922d641a426dcffaef11680e5358f34d97d112e1',
    ],
    internalName: 'moonbeam',
    nativeCurrency: {
      name: 'Glimmer',
      symbol: 'GLMR',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0xacc15dc74880c9944775448304b263d191c6077f',
    },
  },
  [zkSync.id]: {
    ...zkSync,
    blocksUntilBehind: 50,
    logoUrl: zksyncLogoUrl,
    scanSite: 'BobaScan',
    scanUrl: 'https://explorer.zksync.io/',
    defaultPool: '0xff577f0e828a878743ecc5e2632cbf65cecf17cf',
    defaultToken0: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    defaultToken1: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    tokenList: [
      '0x000000000000000000000000000000000000800A',
      '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
      '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011',
      '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
    ],
    internalName: 'zksync',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: ZERO_ADDRESS,
      WETH9Address: '0x000000000000000000000000000000000000800A',
    },
  },
}

export const CHAIN_MAP_INTERNALNAME = Object.fromEntries(
  Object.values(CHAIN_INFO).map((x) => {
    return [x.internalName, x]
  })
)

export const CHAIN_MAP_ID = Object.fromEntries(
  Object.values(CHAIN_INFO).map((x) => {
    return [x.id.toString(), x]
  })
)
