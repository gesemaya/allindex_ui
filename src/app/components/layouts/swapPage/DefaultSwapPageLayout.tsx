import { DescriptionFunc, TitleFunc, useChainLoader } from '../../../route/RouteWrapper'
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import { IToken } from '../../../lib/getToken'
import { topBarheight } from '../../charts/charts/liquidityChart/constants'
import SwapFormContainer from '../../forms/OrderForms/SwapFormController'
import ChartPanel from './panels/ChartPanel'
import TokenOverviewPanel from './panels/TokenOverviewPanel'
import TrendingPanel from './panels/TrendingPanel'
import { TokenOverview } from '@gfxlabs/oku'
import { useCurrentClient } from '../../../hooks/useClient'

export interface ITokens {
  token0: string
  token1: string
}

interface IDefaultSwapPageLayout {
  token0: IToken
  token1: IToken
}

export type ITokenOverview = [TokenOverview | undefined, TokenOverview | undefined]

function DefaultSwapPageLayout(props: IDefaultSwapPageLayout) {
  const { token0, token1 } = props
  const { height, width } = useWindowDimensions()
  const gapSize = 8
  const leftPanelWidth = 380
  const rightPanelWidth = 390
  const chartPanelHeight = height - topBarheight - 100 < 700 ? 700 : height - topBarheight - 70
  const chartPanelWidth = width - leftPanelWidth - rightPanelWidth - 4 * gapSize
  const { currentChainInfo } = useChainLoader()
  const { data: tokenOverview0 } = useCurrentClient('cush_getTokenOverview', [token0.address], {})
  const { data: tokenOverview1 } = useCurrentClient('cush_getTokenOverview', [token1.address], {})

  const pageTitle =
    token0 && token1
      ? `${token0?.symbol}/${token1?.symbol} | Swap on ${currentChainInfo.name} | Oku Trade`
      : `swap on ${currentChainInfo.name} | Oku Trade`
  const pageDescription =
    token0 && token1
      ? `${token0.symbol}/${token1.symbol} ${(tokenOverview0?.price_deltas?.week_change_usd! * 100).toFixed(
          2
        )}% over the past 7d. Swap ${token0.name} and ${token1.name} on ${
          currentChainInfo.name
        } today. Charting, analytics, trending tokens, and more ok Oku Trade`
      : `Charting, analytics, trending tokens, and more ok Oku Trade`
  return (
    <div
      className={`flex flex-col-reverse xl:flex-row flex-1 w-full  `}
      style={{ gap: gapSize, padding: gapSize, minHeight: 700 }}
    >
      <TitleFunc pageTitle={pageTitle} />
      <DescriptionFunc pageDescription={pageDescription} />
      <div className="flex flex-col xl:flex-row gap-2 flex-1 ">
        <div className={`flex flex-1 xl:max-w-[380px]`} style={{ maxHeight: width > 1280 ? chartPanelHeight : '' }}>
          <TrendingPanel />
        </div>
        <div className="flex  " style={{ maxHeight: chartPanelHeight }}>
          <ChartPanel
            height={chartPanelHeight}
            width={width > 1280 ? chartPanelWidth : width - 60}
            token0={token0}
            token1={token1}
            tokenOverview0={tokenOverview0}
            tokenOverview1={tokenOverview1}
          />
        </div>
      </div>
      <div
        className={`flex flex-col md:flex-row xl:flex-col flex-1 xl:max-w-[390px] h-full`}
        style={{ gap: gapSize, height: chartPanelHeight }}
      >
        <div style={{ flex: width > 1280 ? 0 : 1 }}>{<SwapFormContainer />}</div>
        <TokenOverviewPanel
          token0={token0}
          token1={token1}
          tokenOverview0={tokenOverview0}
          tokenOverview1={tokenOverview1}
        />
      </div>
    </div>
  )
}

export default DefaultSwapPageLayout
