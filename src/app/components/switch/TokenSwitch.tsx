import { useChainLoader } from '../../route/RouteWrapper'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { getTokenLogoUrl } from '../../util/getTokenLogo'
import { getTokenSymbol } from '../../util/getTokenName'
import { PoolTokenInfo } from '../../context/DataContext'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { ReactElement, useState } from 'react'

interface IBaseSwitch {
  token: PoolTokenInfo
  setTokenSelected: (value: number) => void
  token0Address: string
  token0Symbol: string
  token1Address: string
  token1Symbol: string
  isLogo?: boolean
}

interface IButton {
  onClick: () => void
  children: string | ReactElement
  color: string
  weight: FontWeightEnums
}

interface IHighlight {
  token: PoolTokenInfo
  isLogo?: boolean
}

function TokenSwitch(props: IBaseSwitch) {
  const { token, setTokenSelected, token0Address, token0Symbol, token1Address, token1Symbol, isLogo = false } = props
  const { currentChain } = useChainLoader()
  return !isLogo ? (
    <div
      className="min-w-[140px] h-[32px] rounded-[5px] border-[1px] text-[14px] font-normal items-center relative"
      style={{ backgroundColor: colors.gray[900], borderColor: colors.gray[800] }}
    >
      {token !== undefined && <Highlight token={token} />}
      <div className="flex flex-row flex-1 rounded-[5px] w-full h-full absolute ">
        <ChooseItemButton
          color={token.selected === 0 ? colors.gray[100] : colors.gray[500]}
          weight={token.selected === 0 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            window.log.log('clicked', token.selected)
            if (token.selected !== 0) {
              setTokenSelected(0)
            }
          }}
        >
          {getTokenSymbol(token0Address, token0Symbol, currentChain)!}
        </ChooseItemButton>
        <ChooseItemButton
          color={token.selected === 1 ? colors.gray[100] : colors.gray[500]}
          weight={token.selected === 1 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            window.log.log('clicked1', token.selected)
            if (token.selected !== 1) {
              setTokenSelected(1)
            }
            setTokenSelected(1)
          }}
        >
          {getTokenSymbol(token1Address, token1Symbol, currentChain)!}
        </ChooseItemButton>
      </div>
    </div>
  ) : (
    <div
      className="min-w-[75px] h-[32px] rounded-full border-[1px] text-[14px] font-normal items-center relative"
      style={{ backgroundColor: colors.gray[900], borderColor: colors.gray[800] }}
    >
      {token !== undefined && <Highlight token={token} isLogo={true} />}
      <div className="flex flex-row flex-1 rounded-[5px] w-full h-full absolute ">
        <ChooseItemButton
          color={token.selected === 0 ? colors.gray[100] : colors.gray[500]}
          weight={token.selected === 0 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            // window.log.log('clicked', token.selected)
            setTokenSelected(0)
          }}
        >
          <>
            <img
              className="rounded-full h-[16px]"
              src={getTokenLogoUrl(token0Address, currentChain)}
              alt={getTokenSymbol(token0Address, token0Symbol, currentChain)!}
            />
          </>
        </ChooseItemButton>
        <ChooseItemButton
          color={token.selected === 1 ? colors.gray[100] : colors.gray[500]}
          weight={token.selected === 1 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            // window.log.log('clicked1', token.selected)
            setTokenSelected(1)
          }}
        >
          <img
            className="rounded-full h-[16px]"
            src={getTokenLogoUrl(token1Address, currentChain)}
            alt={getTokenSymbol(token1Address, token1Symbol, currentChain)!}
          />
        </ChooseItemButton>
      </div>
    </div>
  )
}

export default TokenSwitch

const ChooseItemButton = (props: IButton) => {
  const { onClick, color, children, weight } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      onClick={onClick}
      className="flex flex-1 justify-center items-center rounded-[5px]"
    >
      {' '}
      {typeof children === 'string' ? (
        <T3 weight={weight} color={hover ? getHoverColor(color) : color}>
          {children}
        </T3>
      ) : (
        children
      )}
    </button>
  )
}

const Highlight = (props: IHighlight) => {
  const { token } = props
  return (
    <div className={` h-full absolute py-1 w-full  px-1 flex `}>
      <div
        style={{ backgroundColor: colors.gray[600] }}
        className={`h-full w-[50%] rounded-[5px] transform transition-all duration-300  ${
          token.selected === 1 ? 'transform translate-x-[100%]' : ''
        }`}
      ></div>
    </div>
  )
}
