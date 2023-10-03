import { DescriptionFunc, TitleFunc, useChainLoader } from '../../route/RouteWrapper'
import { useModalContext } from '../../context/naked/ModalContext'
import { useThemeContext } from '../../context/naked/ThemeContext'
import useMobile from '../../hooks/useMobile'
import { LayoutEnums } from '../../types/Enums'
import { useUserOrderContext } from '../../context/UserOrderContext'
import ChartPanel from '../sections/liquidityPage/ChartPanel'
import FeeTierPanel from '../sections/liquidityPage/FeeTierPanel'
import OpenPositionsPanel from '../sections/liquidityPage/OpenPositionsPanel'
import PositionPanel from '../sections/liquidityPage/PositionPanel'
import RangePanel from '../sections/liquidityPage/RangePanel'
import BaseSwitch from '../switch/BaseSwitch'
import { UserPositions } from '@gfxlabs/oku'
import { useEffect, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { useDataContext } from '../../context/DataContext'
import { formatNumberToString } from '../../util/formatNumbers'

export const LiquidityPageLayout = () => {
  const { isMobile } = useMobile()
  const [position, setPosition] = useState(false)
  const { address } = useAccount()
  const { currentChainInfo } = useChainLoader()
  const { appLayout } = useThemeContext()

  const { token0, token1, poolSummary } = useDataContext()

  const provider = usePublicClient({ chainId: currentChainInfo.id })
  const { setIsLoading } = useModalContext()
  useEffect(() => {
    setIsLoading(false)
  })
  const [positions, setPositions] = useState<UserPositions[] | undefined>(undefined)
  const { currentPositions } = useUserOrderContext()

  useEffect(() => {
    if (currentPositions) {
      const positions = currentPositions
        .filter((pos) => pos.current_liquidity !== '0')
        .sort((a, b) => {
          const bValue =
            Number(b.current_position_values.amount0_current_usd) +
            Number(b.current_position_values.amount1_current_usd)
          const aValue =
            Number(a.current_position_values.amount0_current_usd) +
            Number(a.current_position_values.amount1_current_usd)

          return bValue - aValue
        })

      setPositions(positions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, currentPositions, provider])

  const isDefaultLayout = appLayout === LayoutEnums.DEFAULT

  const pageTitle =
    token0 && token1
      ? `${token0?.symbol}/${token1?.symbol} | LP Position Manager | Oku Trade`
      : `LP Position Manager | Oku Trade`
  const pageDescription =
    token0 && token1 && poolSummary
      ? `${token0?.symbol}/${token1?.symbol} has a 24h trading volume of $${formatNumberToString(
          poolSummary.total_volume_7d_usd
        )} with $${
          (poolSummary.fee / 1000000) * poolSummary.total_volume_7d_usd
        } in fees. The TVL is $${formatNumberToString(
          poolSummary.tvl_usd
        )}. Liquidity depth, chart analytics, position creation, and more on Oku Trade.`
      : 'Liquidity depth, chart analytics, position creation, and more on Oku Trade.'
  return (
    <div className="flex-col flex flex-1 w-full h-full">
      <TitleFunc pageTitle={pageTitle} />
      <DescriptionFunc pageDescription={pageDescription} />
      <div
        className={`flex flex-1  ${
          isMobile ? 'flex-col' : isDefaultLayout ? 'flex-row-reverse' : 'flex-row'
        } h-full gap-2 p-2`}
        style={{ flexDirection: isMobile ? 'column' : isDefaultLayout ? 'row-reverse' : 'row' }}
      >
        <div className="flex md:flex-1 flex-col gap-2 ">
          <ChartPanel />
          {isMobile ? (
            <BaseSwitch item={position} setItem={setPosition} item1={'Add Position'} item2={'Manage Positions'} />
          ) : (
            <OpenPositionsPanel positions={positions} />
          )}
        </div>
        <div className="flex flex-col gap-2 sm:max-w-[286px]">
          {!isMobile || !position ? (
            <div className="flex flex-col h-full gap-2">
              <FeeTierPanel />
              <RangePanel />
              <PositionPanel />
            </div>
          ) : (
            <OpenPositionsPanel positions={positions} />
          )}
        </div>
      </div>
    </div>
  )
}
