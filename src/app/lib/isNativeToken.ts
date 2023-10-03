import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains'

export const isWrappedNativeToken = (networkId: number, address: string) => {
  const wrappedNativeTokenAddress = WRAPPED_NATIVE_TOKEN_ADDRESS[networkId]

  return wrappedNativeTokenAddress === address.toLowerCase()
}

export const WRAPPED_NATIVE_TOKEN_ADDRESS: { [key: number]: string } = {
  [`${polygon.id}`]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [`${optimism.id}`]: '0x4200000000000000000000000000000000000042',
  [`${arbitrum.id}`]: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  [`${goerli.id}`]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [`${mainnet.id}`]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}
