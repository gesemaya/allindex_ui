import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T1, T2 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums } from '../../../types/Enums'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { getTokenSymbol } from '../../../util/getTokenName'
import { UserPositions } from '@gfxlabs/oku'
import { getHoverColor } from '../../charts/utils/getHoverColor'
import { formatUnits } from 'ethers'
import { useEffect, useState } from 'react'

interface IButton {
  onClick: () => void
}

const RemoveLiquidityButton = (props: IButton) => {
  const { onClick } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      className="rounded-[8px] flex items-center h-[38px] justify-center"
      style={{ backgroundColor: hover ? getHoverColor(colors.blue[400]) : colors.blue[400] }}
    >
      <T1 weight={FontWeightEnums.SEMIBOLD}>Remove all liquidity</T1>
    </button>
  )
}

interface IClosePosition {
  onClick: () => void
  position: UserPositions
}

export const ClosePosition = (props: IClosePosition) => {
  const { onClick, position } = props
  const { currentChain } = useChainLoader()
  const [token0Logo, setToken0Logo] = useState<string>()
  const [token1Logo, setToken1Logo] = useState<string>()

  useEffect(() => {
    const token0Logo = getTokenLogoUrl(position.position_pool_data?.token0!, currentChain)
    const token1Logo = getTokenLogoUrl(position.position_pool_data?.token1!, currentChain)

    setToken0Logo(token0Logo)
    setToken1Logo(token1Logo)
  }, [position])

  return (
    <div
      className="flex flex-col w-[285px] h-[197px] p-3 border-[1px] rounded-[15px] justify-between"
      style={{ backgroundColor: colors.gray.dark, borderColor: colors.gray[800] }}
    >
      <div className="flex flex-row justify-between">
        <T1 weight={FontWeightEnums.SEMIBOLD}>Close Position</T1>
      </div>
      <div
        className="flex flex-col gap-3 px-4 py-3 rounded-[13px]"
        style={{ backgroundColor: colors.gray[800], borderColor: colors.gray[700] }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <img src={token0Logo} alt={position.position_pool_data.token0_symbol} className="h-3 w-3 rounded-full" />
            <T2>
              {getTokenSymbol(
                position.position_pool_data.token0,
                position.position_pool_data.token0_symbol,
                currentChain
              )}
            </T2>
          </div>
          <T2>
            <FormatNumber
              num={Number(
                formatUnits(
                  position.current_position_values.amount0_current,
                  position.position_pool_data.token0_decimals
                )
              )}
            />{' '}
            {getTokenSymbol(
              position.position_pool_data.token0,
              position.position_pool_data.token0_symbol,
              currentChain
            )}{' '}
          </T2>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <img src={token1Logo} alt={position.position_pool_data.token0_symbol} className="h-3 w-3 rounded-full" />
            <T2>
              {getTokenSymbol(
                position.position_pool_data.token1,
                position.position_pool_data.token1_symbol,
                currentChain
              )}
            </T2>
          </div>
          <T2>
            <FormatNumber
              num={Number(
                formatUnits(
                  position.current_position_values.amount1_current,
                  position.position_pool_data.token1_decimals
                )
              )}
            />{' '}
            {getTokenSymbol(
              position.position_pool_data.token1,
              position.position_pool_data.token1_symbol,
              currentChain
            )}{' '}
          </T2>
        </div>
      </div>
      <RemoveLiquidityButton onClick={onClick} />
    </div>
  )
}

interface IClaimFees {
  onClaim: () => void
  position: UserPositions
}

export const ClaimFees = (props: IClaimFees) => {
  const { onClaim, position } = props
  const [token0Logo, setToken0Logo] = useState<string>()
  const [token1Logo, setToken1Logo] = useState<string>()
  const { currentChain } = useChainLoader()

  useEffect(() => {
    const token0Logo = getTokenLogoUrl(position.position_pool_data?.token0!, currentChain)
    const token1Logo = getTokenLogoUrl(position.position_pool_data?.token1!, currentChain)

    setToken0Logo(token0Logo)
    setToken1Logo(token1Logo)
  }, [position])

  return (
    <div
      className="flex flex-col w-[285px] h-[197px] p-3 border-[1px] rounded-[15px] justify-between"
      style={{ backgroundColor: colors.gray.dark, borderColor: colors.gray[800] }}
    >
      <div className="flex flex-row justify-between">
        <T1 weight={FontWeightEnums.SEMIBOLD}>Claim fees</T1>
      </div>
      <div
        className="flex flex-col gap-3 px-4 py-3 rounded-[13px]"
        style={{ backgroundColor: colors.gray[800], borderColor: colors.gray[700] }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <img src={token0Logo} alt={position.position_pool_data?.token0_symbol} className="h-3 w-3 rounded-full" />
            <div>
              <T2>
                Pool{' '}
                {getTokenSymbol(
                  position.position_pool_data.token0,
                  position.position_pool_data?.token0_symbol!,
                  currentChain
                )}{' '}
              </T2>
            </div>
          </div>
          <T2>
            <FormatNumber
              num={Number(
                formatUnits(
                  position.current_fee_info.token0FeesUncollected,
                  position.position_pool_data.token0_decimals
                )
              )}
            />{' '}
            {getTokenSymbol(
              position.position_pool_data.token0,
              position.position_pool_data?.token0_symbol!,
              currentChain
            )}{' '}
          </T2>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <img src={token1Logo} alt={position.position_pool_data?.token1_symbol} className="h-3 w-3 rounded-full" />
            <T2>
              Pool{' '}
              {getTokenSymbol(
                position.position_pool_data.token1,
                position.position_pool_data?.token1_symbol!,
                currentChain
              )}{' '}
            </T2>
          </div>
          <T2>
            <FormatNumber
              num={Number(
                formatUnits(
                  position.current_fee_info.token1FeesUncollected,
                  position.position_pool_data.token1_decimals
                )
              )}
            />{' '}
            {getTokenSymbol(
              position.position_pool_data.token1,
              position.position_pool_data?.token1_symbol!,
              currentChain
            )}{' '}
          </T2>
        </div>
      </div>
      <button
        className="w-full text-white font-semibold h-[38px] flex items-center justify-center rounded-[8px] bg-blue-400 hover:bg-blue-800"
        onClick={onClaim}
      >
        {' '}
        Claim All Fees
      </button>
    </div>
  )
}
