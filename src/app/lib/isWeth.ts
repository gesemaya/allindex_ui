import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains'

export const isWETH = (networkId: number, address: string) => {
  const wethAddress = WETH_ADDRESS[networkId]

  return wethAddress === address.toLowerCase()
}

export const WETH_ADDRESS: { [key: number]: string } = {
  [`${polygon.id}`]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  [`${optimism.id}`]: '0x4200000000000000000000000000000000000006',
  [`${arbitrum.id}`]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [`${goerli.id}`]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [`${mainnet.id}`]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}
