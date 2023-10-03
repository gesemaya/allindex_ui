import { useChainLoader } from '../../route/RouteWrapper'
import StarSVG from '../../assets/star.svg'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getTokenByAddress } from '../../lib/getToken'
import { getTokenSymbol } from '../../util/getTokenName'
import { CHAIN_INFO } from '../../constants/chainInfo'
import { WATCH_LIST_TITLE } from '../../constants/misc'
import { getHoverColor } from '../charts/utils/getHoverColor'
import BaseDropdown from './BaseDropdown'
import { useEffect, useState } from 'react'

interface ITokenButton {
  setShowModal: (value: boolean) => void
  setToken: (token: string) => void
  token: {
    symbol: string
    name: string
    address: string
    decimals: number
    logoURI: string
  }
}

function PoolDropDown({ token, setToken }: { token: string; setToken: (value: string) => void }) {
  const { currentChain } = useChainLoader()
  const [showModal, setShowModal] = useState(false)
  const [tokens, setTokens] = useState<Map<string, any>>(new Map())
  const { currentChainInfo } = useChainLoader()

  tokens.set(WATCH_LIST_TITLE, { symbol: WATCH_LIST_TITLE, logoURI: StarSVG })

  useEffect(() => {
    const tokensInfo = CHAIN_INFO[currentChain].tokenList.map(async (token) => getTokenByAddress(token, currentChain))

    tokensInfo.forEach((token) => {
      token.then((token) => {
        tokens.set(token.symbol!, token)
      })
    })
  }, [])

  return (
    <BaseDropdown
      showModal={showModal}
      setShowModal={setShowModal}
      buttonStyle={{
        borderRadius: '18px',
        height: '32px',
        paddingLeft: '10px',
        borderWidth: 1,
        borderColor: colors.gray[700],
        paddingRight: 4,
      }}
      buttonContent={
        <div className="flex gap-x-3 items-center justify-center ">
          {token !== '' && (
            <div className="h-[16px] w-[16px] rounded-[16px]">
              <img src={tokens.get(token).logoURI} alt={token} className=" rounded-full" />
            </div>
          )}
          {token === '' ? <T3 color={colors.gray[400]}>Select token</T3> : <T3 color={colors.white}>{token}</T3>}
        </div>
      }
      modalContent={
        <div
          className={`bg-[${colors.gray[900]}] border-[1px] border-[#FFFFFF30] rounded-[12px] h-fit text-white  flex flex-col `}
        >
          {[...tokens.keys()].map((token) => {
            const thisToken = tokens.get(token)
            return (
              <TokenButton
                key={getTokenSymbol(thisToken.address, thisToken.symbol, currentChainInfo.id)}
                token={thisToken}
                setShowModal={setShowModal}
                setToken={setToken}
              />
            )
          })}
        </div>
      }
      fullWidthButton
      fullWidthModal
    />
  )
}

const TokenButton = (props: ITokenButton) => {
  const { token, setShowModal, setToken } = props
  const [hover, setHover] = useState(false)
  const { currentChainInfo } = useChainLoader()
  return (
    <button
      className="text-white hover:bg-sky-700 flex py-2 px-4 rounded-[12px] items-center"
      style={{ backgroundColor: hover ? getHoverColor(colors.gray[900]) : colors.gray[900] }}
      key={getTokenSymbol(token.address, token.symbol, currentChainInfo.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        setToken(getTokenSymbol(token.address, token.symbol, currentChainInfo.id)!)
        setShowModal(false)
      }}
    >
      <img
        src={token.logoURI}
        alt={getTokenSymbol(token.address, token.symbol, currentChainInfo.id)}
        className="w-6 h-6 rounded-full mr-3"
      />
      <T3>{getTokenSymbol(token.address, token.symbol, currentChainInfo.id)}</T3>
    </button>
  )
}

export default PoolDropDown
