import { useThemeContext } from '../../../context/naked/ThemeContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { ChartSizeEnums, LayoutEnums } from '../../../types/Enums'
import LeftPanel from './panels/LeftPanel'
import OrderPanel from './panels/OrderPanel'
import RightPanel from './panels/RightPanel'
import { useDataContext } from '../../../context/DataContext'
import { DescriptionFunc, TitleFunc, useChainLoader } from '../../../route/RouteWrapper'
import { formatNumberToString } from '../../../util/formatNumbers'
import DefaultChartLayout from '../../charts/layouts/DefaultChartLayout'

const PoolPageLayout = () => {
  const { chart, appLayout } = useThemeContext()
  const breakpoint = useBreakpoint({ base: 0, sm: 1, md: 2, lg: 3 })
  const isDefaultLayout = appLayout === LayoutEnums.DEFAULT
  const chartIsNotFullScreen = chart.size === ChartSizeEnums.DEFAULT

  const { token0, token1, poolSummary } = useDataContext()
  const { currentChainInfo } = useChainLoader()

  const pageTitle =
    token0 && token1 && poolSummary
      ? `${token0?.symbol}/${token1?.symbol} at ${formatNumberToString(poolSummary?.t0_price)} | Trade on ${
          currentChainInfo.name
        } | Oku Trade`
      : `Pool | Oku Trade`
  const pageDescription =
    token0 && token1 && poolSummary
      ? `${token0?.symbol}/${token1?.symbol} ${
          poolSummary.t1_price * poolSummary.t1_change
        } over the past 24h with a trading volume of ${formatNumberToString(
          (poolSummary.t0_volume_usd + poolSummary.t1_volume_usd) / 2
        )} with $${formatNumberToString(poolSummary.total_fees_usd)} in fees. The TVL is $${formatNumberToString(
          poolSummary.tvl_usd
        )}. Trade on ${
          currentChainInfo.name
        } and other chains today. Limit orders, analytics, charts, and more on Oku Trade.`
      : 'Swap on Ethereum and other chains today. Charting, analytics, trending tokens, and more on Oku Trade.'

  return (
    <div className="flex-row grow gap-2 px-1.5 p-1 flex w-full h-full">
      <TitleFunc pageTitle={pageTitle} />
      <DescriptionFunc pageDescription={pageDescription} />
      <div className="flex gap-2 grow" style={{ flexDirection: isDefaultLayout ? 'row' : 'row-reverse' }}>
        {breakpoint > 1 && (
          <LeftPanel
            isDefaultLayout={isDefaultLayout}
            chartIsNotFullScreen={chartIsNotFullScreen}
            breakpoint={breakpoint}
          />
        )}
        <div className="w-full flex flex-1 flex-col gap-1 gap-y-1.5">
          <div className="flex flex-1 min-h-[400px] md:min-h-[400px] lg:min-h-[300px]">
            <DefaultChartLayout />
          </div>
          <div className="flex gap-1 h-fit" style={{ flexDirection: breakpoint < 1 ? 'column' : 'row' }}>
            {breakpoint <= 1 && (
              <LeftPanel
                isDefaultLayout={isDefaultLayout}
                chartIsNotFullScreen={chartIsNotFullScreen}
                breakpoint={breakpoint}
              />
            )}
            <OrderPanel breakpoint={breakpoint} chartIsNotFullScreen={chartIsNotFullScreen} />
          </div>
        </div>
      </div>
      <RightPanel breakpoint={breakpoint} chartIsNotFullScreen={chartIsNotFullScreen} />
    </div>
  )
}

export default PoolPageLayout
