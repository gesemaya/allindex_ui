import {
  appendLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from './localStorage'
import { arbitrum, boba, bsc, goerli, mainnet, moonbeam, optimism, polygon, zkSync } from 'wagmi/chains'

const PRESET_POOLS: { [key: number]: string[] } = {
  [mainnet.id]: [
    '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
    '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
    '0x99ac8ca7087fa4a2a1fb6357269965a2014abc35',
    '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed',
    '0xa6cc3c2531fdaa6ae1a3ca84c2855806728693e8',
    '0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801',
    '0x3416cf6c708da44db2624d63ea0aaef7113527c6',
    '0x5777d92f208679db4b9778590fa3cab3ac9e2168',
    '0x290a6a7460b308ee3f19023d2d00de604bcf5b42',
    '0xac4b3dacb91461209ae9d41ec517c2b9cb1b7daf',
    '0xa3f558aebaecaf0e11ca4b2199cc5ed341edfd74',
    '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
    '0x11b815efb8f581194ae79006d24e0d814b7697f6',
    '0x4585fe77225b41b697c938b018e2ac67ac5a20c0',
    '0x4e0924d3a751be199c426d52fb1f2337fa96f736',
    '0x9a772018fbd77fcd2d25657e5c547baff3fd7d16',
    '0x11950d141ecb863f01007add7d1a342041227b58',
    '0x109830a1aaad605bbf02a9dfa7b0b92ec2fb7daa',
    '0x60594a405d53811d3bc4766596efd80fd545a270',
    '0x840deeef2f115cf50da625f7368c24af6fe74410',
    '0xe8c6c9227491c0a8156a0106a0204d881bb7e531',
    '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8',
    '0xc5af84701f98fa483ece78af83f11b6c38aca71d',
    '0x7bea39867e4169dbe237d55c8242a8f2fcdcc387',
  ],
  [goerli.id]: ['0xD11ee14805642dCb5BF840845836AFe3cfc16383'],
  [polygon.id]: [
    '0x847b64f9d3a95e977d157866447a5c0a5dfa0ee5',
    '0x0e44ceb592acfc5d3f09d996302eb4c499ff8c10',
    '0x167384319b41f7094e62f7506409eb38079abff8',
    '0x94ab9e4553ffb839431e37cc79ba8905f45bfbea',
    '0x88f3c15523544835ff6c738ddb30995339ad57d6',
    '0x45dda9cb7c25131df268515131f647d726f50608',
    '0xa374094527e1673a86de625aa59517c5de346d32',
    '0x9b08288c3be4f62bbf8d1c20ac9c5e6f9467d8b7',
    '0x50eaedb835021e4a108b7290636d62e9765cc6d7',
    '0x86f1d8390222a3691c28938ec7404a1661e618e0',
    '0xeef1a9507b3d505f0062f2be9453981255b503c8',
    '0x1f6082db7c8f4b199e17090cd5c8831a1dad1997',
    '0xdac8a8e6dbf8c690ec6815e0ff03491b2770255d',
    '0x3a5329ee48a06671ad1bf295b8a233ee9b9b975e',
    '0x0a63d3910ffc1529190e80e10855c4216407cc45',
    '0x5645dcb64c059aa11212707fbf4e7f984440a8cf',
    '0x7de263d0ad6e5d208844e65118c3a02a9a5d56b6',
    '0x2aceda63b5e958c45bd27d916ba701bc1dc08f7a',
    '0x4d05f2a005e6f36633778416764e82d1d12e7fbb',
    '0x3d0acd52ee4a9271a0ffe75f9b91049152bac64b',
    '0x3e31ab7f37c048fc6574189135d108df80f0ea26',
    '0xd866fac7db79994d08c0ca2221fee08935595b4b',
    '0x98b9162161164de1ed182a0dfa08f5fbf0f733ca',
    '0x4ccd010148379ea531d6c587cfdd60180196f9b1',
    '0xfe343675878100b344802a6763fd373fdeed07a4',
    '0x357faf5843c7fd7fb4e34fbeabdac16eabe8a5bc',
  ],
  [arbitrum.id]: [
    '0x17c14d2c404d167802b16c450d3c99f88f2c4f4d',
    '0xc82819f72a9e77e2c0c3a69b3196478f44303cf4',
    '0x81c48d31365e6b526f6bbadc5c9aafd822134863',
    '0xa62ad78825e3a55a77823f00fe0050f567c1e4ee',
    '0x135e49cc315fed87f989e072ee11132686cf84f3',
    '0xa961f0473da4864c5ed28e00fcc53a3aab056c1b',
    '0x149e36e72726e0bcea5c59d40df2c43f60f5a22d',
    '0x8e295789c9465487074a65b1ae9ce0351172393f',
    '0x97bca422ec0ee4851f2110ea743c1cd0a14835a1',
    '0x92c63d0e701caae670c9415d91c474f686298f00',
    '0x8c9d230d45d6cfee39a6680fb7cb7e8de7ea8e71',
    '0xf0428617433652c9dc6d1093a42adfbf30d29f74',
    '0x1aeedd3727a6431b8f070c0afaa81cc74f273882',
    '0x446bf9748b4ea044dd759d9b9311c70491df8f29',
    '0x42d7c8302a746f98ec74f0dbc95fc39b46c1abb6',
    '0xc91b7b39bbb2c733f0e7459348fd0c80259c8471',
    '0xC31E54C7A869B9FCBECC14363CF510D1C41FA443',
    '0x641C00A822e8b671738d32a431a4Fb6074E5c79d',
    '0xCDA53B1F66614552F834CEEF361A8D12A0B8DAD8',
    '0xC6F780497A95E246EB9449F5E4770916DCD6396A',
    '0x2f5e87C9312fa29aed5c179E456625D79015299c',
    '0x13398E27A21BE1218B6900CBEDF677571DF42A48',
    '0x31FA55E03BAD93C7F8AFFDD2EC616EBFDE246001',
    '0x468B88941E7CC0B88C1869D68AB6B570BCEF62FF',
    '0xd37Af656Abf91c7f548FfFC0133175b5e4d3d5e6',
    '0xc6962004f452be9203591991d15f6b388e09e8d0',
    '0xdbaeb7f0dfe3a0aafd798ccecb5b22e708f7852c',
    '0xbe3ad6a5669dc0b8b12febc03608860c31e2eef6',
    '0x80a9ae39310abf666a87c743d6ebbd0e8c42158e',
    '0x99db8dba7b30ab3c6447c4388d81dcc27c5a8b61',
    '0x1862200e8e7ce1c0827b792d0f9546156f44f892',
    '0x1edd8c76f74d816f7472be69b174fe7b3084221e',
    '0x4d834a9b910e6392460ebcfb59f8eef27d5c19ff',
    '0x0632742c132413cd47438691d8064ff9214ac216',
    '0xa8328bf492ba1b77ad6381b3f7567d942b000baf',
    '0x50450351517117cb58189edba6bbad6284d45902',
  ],
  [optimism.id]: [
    '0xb589969d38ce76d3d7aa319de7133bc9755fd840',
    '0x1c3140ab59d6caf9fa7459c6f83d4b52ba881d36',
    '0xdd0c6bae8ad5998c358b823df15a2a4181da1b80',
    '0x03af20bdaaffb4cc0a521796a223f7d85e2aac31',
    '0x0bb50d3e479e4682558fdb86f41a205e2c035ae5',
    '0x6168ec836d0b1f0c37381ec7ed1891a412872121',
    '0x320616dbe138aa2f3db7a5a46ba79a13032cc5f2',
    '0xb2ac2e5a3684411254d58b1c5a542212b782114d',
    '0x68f5c0a2de713a54991e01858fd27a3832401849',
    '0x73b14a78a0d396c521f954532d43fd5ffe385216',
    '0x85149247691df622eaf1a8bd0cafd40bc45154a9',
    '0xc858a329bf053be78d6239c4a4343b8fbd21472b',
    '0xf1f199342687a7d78bcc16fce79fa2665ef870e1',
    '0xbf16ef186e715668aa29cef57e2fd7f9d48adfe6',
    '0x04f6c85a1b00f6d9b75f91fd23835974cc07e65c',
    '0x85c31ffa3706d1cce9d525a00f1c7d4a2911754c',
    '0xfc1f3296458f9b2a27a0b91dd7681c4020e09d05',
    '0x95d9d28606ee55de7667f0f176ebfc3215cfd9c0',
    '0xaefc1edaede6adadcdf3bb344577d45a80b19582',
    '0x0392B358CE4547601BEFA962680BEDE836606AE2',
    '0x36E42931A765022790B797963E42C5522D6B585A',
    '0x03A9DC118B231480058E7A3B051042EC83663794',
    '0x95D7D146AE40D4822C2750276B54B6EED530D374',
    '0x7f1c919a92bce8790a85d6360b85cf21b997a6b5',
    '0x1a54ae9f662b463f8d432482975c17e51518b50d',
    '0xff7fbdf7832ae524deda39ca402e03d92adff7a5',
    '0x55bc964fe3b0c8cc2d4c63d65f1be7aef9bb1a3c',
    '0x535541f1aa08416e69dc4d610131099fa2ae7222',
    '0xadb35413ec50e0afe41039eac8b930d313e94fa4',
    '0x730691cdac3cbd4d41fc5eb9d8abbb0cea795b94',
  ],
  [bsc.id]: ['0x6fe9e9de56356f7edbfcbb29fab7cd69471a4869'],
  [boba.id]: [
    '0xdF37543dae7986E48E3ce83F390A828A9F3D23BA',
    '0x162b1fda171463974e5262bac5824da233f11e00',
    '0xfe1a0c58e38fa71618545df15e5479559ce51108',
    '0xb1ed67e29b2497404a2ac7f2a2989c3328ec2999',
    '0x66faef55892dae3932a043d3238ecaa271d36e0d',
  ],
  [moonbeam.id]: ['0xB64fD2Cf30588e4ACbb92e98b28d976a61914D29', '0xba66370d96a9d61afa66283900b78c1f6ed02782'],
  [zkSync.id]: ['0xff577f0e828a878743ecc5e2632cbf65cecf17cf', '0x50b0b9e02aa6f72a70fefbdb50bdc2f27e594135'],
}

type MarketWatchAction = 'ADD' | 'REMOVE'

export const updateMarketWatch = (action: MarketWatchAction, pool_address: string, chain: number) => {
  const pools = getMarketWatch(chain)

  if (action === 'ADD') {
    const newList = appendLocalStorageItem(createMarketWatchKey(chain), pool_address)

    return newList
  } else if (action === 'REMOVE') {
    const newList = removeLocalStorageItem(createMarketWatchKey(chain), pool_address)

    return newList
  }
  return pools
}

export const getMarketWatch = (chain: number) => {
  const pools = getLocalStorageItem(createMarketWatchKey(chain)) as string[]

  if (pools === null || pools.length === 0) {
    setLocalStorageItem(createMarketWatchKey(chain), PRESET_POOLS[chain])
    return PRESET_POOLS[chain]
  } else {
    return pools
  }
}

export const createMarketWatchKey = (chain: number = 1) => `market_watch_${chain}`
