import { useChainLoader } from '../../../route/RouteWrapper'
import { DefaultTokenList } from '../../../../config'
import { T2, T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getTokenByAddress, IToken } from '../../../lib/getToken'
import { TokenInfo } from '../../../lib/tokenList'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { getTokenSymbol } from '../../../util/getTokenName'
import { ZERO_ADDRESS } from '../../../constants/addresses'
import { useSwapPageContext } from '../../../context/SwapPageContext'
import { useUserOrderContext } from '../../../context/UserOrderContext'
import { getHoverColor } from '../../charts/utils/getHoverColor'
import SearchDropdownInput from '../../inputs/SearchDropdownInput'
import { Divider } from '../../misc/Divider'
import ModalOverlay from '../../modals/ModalOverlay'
import { TokenSearchResults } from './TokenSearchResults'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ISelectTokenDropdown {
  token: IToken
  setToken: (value: IToken) => void
  isToken0: boolean
}

function SelectTokenDropdown(props: ISelectTokenDropdown) {
  const { token, setToken, isToken0 } = props
  const [showDropdown, setShowDropdown] = useState(false)
  const [isExpandedDropdown, setIsExpandedDropdown] = useState(false)
  const onClose = () => {
    setIsExpandedDropdown(false)
    setShowDropdown(false)
  }
  const { currentChain } = useChainLoader()
  const [defaultList, setDefaultList] = useState<IToken[] | undefined>(undefined)

  useEffect(() => {
    const defaultList = DefaultTokenList.tokens.filter(
      ({ chainId }) => chainId.toString().toLowerCase() === currentChain.toString().toLowerCase()
    ) as IToken[]

    setDefaultList(defaultList)
  }, [currentChain])

  return (
    <div className="flex flex-col  items-end gap-2">
      <DropdownButton onClick={() => setShowDropdown(true)} tokenAddress={token.address} tokenSym={token.symbol} />
      {showDropdown && <ModalOverlay onClose={onClose} showOverlay={false} />}
      {showDropdown && (
        <Dropdown
          defaultList={defaultList}
          onClose={onClose}
          setToken={setToken}
          isExpandedDropdown={isExpandedDropdown}
          setIsExpandedDropdown={setIsExpandedDropdown}
          isToken0={isToken0}
        />
      )}
    </div>
  )
}

export default SelectTokenDropdown

interface IDropdownButton {
  onClick: () => void
  tokenAddress: string | undefined
  tokenSym: string | undefined
}

const DropdownButton = (props: IDropdownButton) => {
  const { onClick, tokenAddress, tokenSym } = props
  const { currentChainInfo } = useChainLoader()
  const tokenLogo = tokenAddress ? getTokenLogoUrl(tokenAddress, currentChainInfo.id) : ''
  const [, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      onClick={onClick}
      className="flex flex-row rounded-[6px] h-fit w-fit p-1.5 items-center justify-center "
      style={{ backgroundColor: colors.gray[700] }}
    >
      <div className="h-[16px] w-[16px] rounded-full] mr-1">
        <img className="rounded-full" src={tokenLogo} alt={tokenSym} />
      </div>
      <div className="flex flex-row gap-2">
        <T2>{tokenSym}</T2>
        <ChevronDownIcon color={colors.gray[50]} width={10} />
      </div>
    </button>
  )
}

interface IDropdown {
  isExpandedDropdown: boolean
  setIsExpandedDropdown: (value: boolean) => void
  setToken: (value: IToken) => void
  onClose: () => void
  isToken0: boolean
  defaultList: IToken[] | undefined
}

const Dropdown = (props: IDropdown) => {
  const { isExpandedDropdown, setIsExpandedDropdown, setToken, onClose, isToken0, defaultList } = props
  return (
    <div
      onFocus={() => window.log.log('focus')}
      onBlur={() => window.log.log('blur')}
      className="absolute z-[20] mt-8 h-fit w-fit border-1[px] rounded-[12px] border-[1px]  w-full max-w-[346px]"
      style={{ borderColor: colors.gray[700], backgroundColor: colors.gray[900] }}
    >
      <DropdownLarge
        defaultList={defaultList}
        isExpandedDropdown={isExpandedDropdown}
        setIsExpandedDropdown={setIsExpandedDropdown}
        setToken={setToken}
        onClose={onClose}
        isToken0={isToken0}
      />
    </div>
  )
}
const tokenList: { [key: string]: { symbol: string; address: string; isNative?: boolean }[] } = {
  ethereum: [
    { symbol: 'ETH', address: ZERO_ADDRESS, isNative: true },
    { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
    { symbol: 'WBTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
    { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    { symbol: 'WETH', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
    { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  ],
  arbitrum: [
    { symbol: 'ETH', address: ZERO_ADDRESS, isNative: true },
    { symbol: 'USDT', address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9' },
    { symbol: 'USDC.e', address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8' },
    { symbol: 'DAI', address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1' },
    { symbol: 'WETH', address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1' },
    { symbol: 'ARB', address: '0x912ce59144191c1204e64559fe8253a0e49e6548' },
  ],
  optimism: [
    { symbol: 'ETH', address: ZERO_ADDRESS, isNative: true },
    { symbol: 'USDT', address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58' },
    { symbol: 'DAI', address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1' },
    { symbol: 'USDC', address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607' },
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006' },
    { symbol: 'OP', address: '0x4200000000000000000000000000000000000042' },
  ],
  polygon: [
    { symbol: 'MATIC', address: ZERO_ADDRESS, isNative: true },
    { symbol: 'DAI', address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' },
    { symbol: 'USDT', address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' },
    { symbol: 'WETH', address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' },
    { symbol: 'USDC', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
    { symbol: 'WMATIC', address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' },
  ],
  goerli: [
    { symbol: 'ETH', address: ZERO_ADDRESS, isNative: true },
    { symbol: 'DAI', address: '0x73967c6a0904aA032C103b4104747E88c566B1A2' },
    { symbol: 'WBTC', address: '0x5b113b574962A171Ef8b922e736D38edC34cdE0B' },
    { symbol: 'USDT', address: '0x509Ee0d083DdF8AC028f2a56731412edD63223B9' },
  ],
  bsc: [],
  boba: [{ symbol: 'ETH', address: ZERO_ADDRESS, isNative: true }],
  moonbeam: [{ symbol: 'GLMR', address: ZERO_ADDRESS, isNative: true }],
  zksync: [{ symbol: 'ETH', address: ZERO_ADDRESS, isNative: true }],
}

interface IInitialTokenList {
  setToken: (value: IToken) => void
  onClose: () => void
}

const InitialTokenList = (props: IInitialTokenList) => {
  const { currentChainInfo } = useChainLoader()
  const { setToken, onClose } = props
  const chain = currentChainInfo.internalName
  const { userTokenBalances } = useUserOrderContext()

  const userTokens = useMemo(() => {
    // only want to show 6 of the user's tokens
    const tokenBalances = userTokenBalances ? userTokenBalances.slice(0, 6) : []

    const tokens = tokenBalances.map((token) => {
      return {
        address: token.token_address,
        symbol: getTokenSymbol(token.token_address, token.token_symbol, currentChainInfo.id),
        logo: getTokenLogoUrl(token.token_address, currentChainInfo.id),
      }
    })

    // Add popular tokens if userTokens list is less than 6
    if (tokens.length < 6) {
      const filterSortedList = tokenList[chain]
        .filter((token) => {
          // filter out tokens where it's the same as a token in userTokens using the address
          return !tokens.some((userToken) => userToken.address === token.address)
        })
        .slice(0, 6 - tokens.length)

      filterSortedList.forEach((token) => {
        tokens.push({
          address: token.address,
          symbol: getTokenSymbol(token.address, token.symbol, currentChainInfo.id),
          logo: getTokenLogoUrl(token.address, currentChainInfo.id),
        })
      })
    }

    const hasNative = tokens.some((token) => token.address === ZERO_ADDRESS)
    // If no native token is in user's top 6, add as 7th token
    if (!hasNative) {
      const nativeToken = tokenList[chain].find((token) => token.isNative)

      tokens.push({
        address: ZERO_ADDRESS,
        symbol: getTokenSymbol(nativeToken!.address, nativeToken?.symbol, currentChainInfo.id),
        logo: getTokenLogoUrl(ZERO_ADDRESS, currentChainInfo.id),
      })
    }

    return tokens
  }, [userTokenBalances])

  return (
    <div className="flex flex-row w-full flex-wrap gap-2 mt-2 justify-center">
      {userTokens &&
        userTokens.length > 0 &&
        userTokens.map((token) => {
          const tokenLogo = getTokenLogoUrl(token.address, currentChainInfo.id)
          const tokenSymbol = getTokenSymbol(token.address, token.symbol, currentChainInfo.id)
          return (
            <InitialTokenItem
              tokenLogo={tokenLogo}
              tokenSymbol={tokenSymbol}
              onClick={() => {
                setToken(getTokenByAddress(token.address, currentChainInfo.id))

                onClose()
              }}
              key={token.address}
            />
          )
        })}
    </div>
  )
}

interface IInitialTokenItem {
  tokenLogo: string | undefined
  tokenSymbol: string | undefined
  onClick: () => void
}

const InitialTokenItem = (props: IInitialTokenItem) => {
  const { tokenLogo, tokenSymbol, onClick } = props
  return (
    <button className="py-2 hover:bg-[#293249] w-fit border-[1px] rounded-[6px] border-gray-600" onClick={onClick}>
      <div className="h-[14px] px-1 rounded-full] mr-1 flex flex-row gap-2 justify-center">
        <img className="rounded-full" src={tokenLogo} alt={tokenSymbol} />
        <T2>{tokenSymbol}</T2>
      </div>
    </button>
  )
}

interface IDropdownLarge {
  isExpandedDropdown: boolean
  setIsExpandedDropdown: (value: boolean) => void
  setToken: (value: IToken) => void
  onClose: () => void
  isToken0: boolean
  defaultList: IToken[] | undefined
}

const DropdownLarge = (props: IDropdownLarge) => {
  const { isToken0, onClose, defaultList } = props
  const [input, setInput] = useState('')
  const { currentChain } = useChainLoader()
  const [searchResults, setSearchResults] = useState<IToken[] | undefined>(defaultList)
  const onChange = (val: string) => {
    setInput(val)
    if (val.length >= 2) {
      setSearchResults(sortSearch(val, DefaultTokenList.tokens, currentChain) as IToken[])
    } else {
      setSearchResults(defaultList)
    }
  }

  const navigate = useNavigate()
  const { token0, token1 } = useSwapPageContext()
  const changeToken = (token: IToken) => {
    token1 &&
      token0 &&
      (isToken0 ? navigate(`../${token.address}/${token1.address}`) : navigate(`../${token0.address}/${token.address}`))
  }
  const [, setHover] = useState(false)
  return (
    <div className="w-full">
      <div className="flex flex-row gap-2 p-2 justify-between">
        <T3>Select Token</T3>
        <button onClick={onClose} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <XMarkIcon color={getHoverColor(colors.white)} width={14} />
        </button>
      </div>
      <div className="my-2">
        <div className="px-2">
          <SearchDropdownInput onChange={onChange} value={input} />
          <InitialTokenList setToken={changeToken} onClose={onClose} />
        </div>
        {searchResults ? (
          <>
            <Divider containerClasses="mt-3 mx-2" />
            <TokenSearchResults searchResults={searchResults} setToken={changeToken} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

const sortSearch = (val: string, results: TokenInfo[], network: number) => {
  const result = results
    .filter(
      ({ name, symbol, address, chainId }) =>
        chainId.toString().toLowerCase() === network.toString().toLowerCase() &&
        (symbol.toLowerCase().includes(val.toLowerCase()) ||
          name.toLowerCase().includes(val.toLowerCase()) ||
          address.toLowerCase().includes(val.toLowerCase()))
    )
    .sort((a, b) => {
      const firstSym = a.symbol.toLowerCase().indexOf(val.toLowerCase())
      const firstName = a.name.toLowerCase().indexOf(val.toLowerCase())
      const firstAdd = a.address.toLowerCase().indexOf(val.toLowerCase())
      const first = firstSym === -1 ? (firstName === -1 ? firstAdd : firstName) : firstSym
      const secondSym = b.symbol.toLowerCase().indexOf(val.toLowerCase())
      const secondName = b.name.toLowerCase().indexOf(val.toLowerCase())
      const secondAdd = b.address.toLowerCase().indexOf(val.toLowerCase())
      const second = secondSym === -1 ? (secondName === -1 ? secondAdd : secondName) : secondSym
      return first - second
    })

  return result
}
