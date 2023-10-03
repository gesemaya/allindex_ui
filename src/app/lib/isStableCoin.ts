import { arbitrum, boba, bsc, goerli, mainnet, moonbeam, optimism, polygon, zkSync } from 'wagmi/chains'

export const isStableCoin = (networkId: number, address: string) => {
  const stableCoins = stableCoinAddress[networkId].map((item) => {
    return item.toLowerCase()
  })
  return stableCoins.includes(address.toLowerCase())
}

export const stableCoinAddress: { [key: number]: string[] } = {
  [`${polygon.id}`]: [
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  ],
  [`${optimism.id}`]: [
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
    '0x8aE125E8653821E851F12A49F7765db9a9ce7384',
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
  ],
  [`${arbitrum.id}`]: [
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  ],
  [`${goerli.id}`]: [
    '0x1F2cd0D7E5a7d8fE41f886063E9F11A05dE217Fa',
    '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60',
    '0xeeDF8CB30F8E4750Ce4361Ed48169940F007906F',
  ],
  [`${mainnet.id}`]: [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    '0x0000000000085d4780B73119b644AE5ecd22b376',
    '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    '0x853d955acef822db058eb8505911ed77f175b99e',
    '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
    '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
    '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
    '0x1a13f4ca1d028320a707d99520abfefca3998b7f',
  ],
  [`${bsc.id}`]: [],
  [`${moonbeam.id}`]: [],
  [`${boba.id}`]: [
    '0x66a2a913e447d6b4bf33efbec43aaef87890fbbc',
    '0x5de1677344d3cb0d7d465c10b72a8f60699c062d',
    '0xf74195bb8a5cf652411867c5c2c5b8c2a402be35',
  ],
  [`${moonbeam.id}`]: [
    '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
    '0x931715FEE2d06333043d11F658C8CE934aC61D0c',
    '0x765277eebeca2e31912c9946eae1021199b39c61',
    '0x06e605775296e851ff43b4daa541bb0984e9d6fd',
    '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
    '0x8e70cd5b4ff3f62659049e74b6649c6603a0e594',
  ],
  [`${zkSync.id}`]: ['0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', '0x503234F203fC7Eb888EEC8513210612a43Cf6115'],
}
