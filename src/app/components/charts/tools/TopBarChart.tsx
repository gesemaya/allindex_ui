import { useChainLoader } from '../../../route/RouteWrapper'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import useMobile from '../../../hooks/useMobile'
import { ChartEnums } from '../../../types/Enums'
import { getTokenSymbol } from '../../../util/getTokenName'
import { useDataContext } from '../../../context/DataContext'
import ChooseChartButton from '../../buttons/ChooseChartButton'
import TokenSwitch from '../../switch/TokenSwitch'
import { useChartDataContext } from '../context/ChartDataContext'

function TopBarChart() {
  const { chartType, setChartType } = useChartDataContext()
  const { token, poolSummary, setToken } = useDataContext()
  const { currentChainInfo } = useChainLoader()
  const { isMobile } = useMobile()
  const price = poolSummary?.t0_price
  return (
    <div className="flex flex-row w-full justify-between items-center" style={{ padding: 12 }}>
      <div>
        {chartType === ChartEnums.TRADINGVIEW ? (
          !isMobile && (
            <div className="flex flex-row items-center gap-2 ">
              <TokenSwitch
                token={token}
                token0Address={poolSummary.t0}
                token0Symbol={poolSummary.t0_symbol}
                token1Address={poolSummary.t1}
                token1Symbol={poolSummary.t1_symbol}
                setTokenSelected={setToken}
              />
            </div>
          )
        ) : (
          <div
            className="flex  h-fit  gap-6 "
            style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'start' : 'center' }}
          >
            <TokenSwitch
              token={token}
              token0Address={poolSummary.t0}
              token0Symbol={poolSummary.t0_symbol}
              token1Address={poolSummary.t1}
              token1Symbol={poolSummary.t1_symbol}
              setTokenSelected={setToken}
            />
            <div className="flex flex-row gap-5">
              <div className="flex flex-row gap-2">
                <T3 color={colors.gray[400]}>Current Price: </T3>
                <T3 color={colors.gray[400]}>
                  {price ? (token.selected === 1 ? price.toFixed(6) : (1 / price).toFixed(6)) : 'Loading'}{' '}
                  {token.selected === 1
                    ? getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)
                    : getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)}{' '}
                  per{' '}
                  {token.selected === 1
                    ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)
                    : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)}
                </T3>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-3 ">
        <div className="flex flex-row gap-1  items-center">
          <ChooseChartButton
            onClick={() => {
              setChartType(ChartEnums.TRADINGVIEW)
            }}
            focus={chartType === ChartEnums.TRADINGVIEW}
          >
            Price
          </ChooseChartButton>
          <ChooseChartButton
            onClick={() => {
              setChartType(ChartEnums.DEPTH)
            }}
            focus={chartType === ChartEnums.DEPTH}
          >
            Depth
          </ChooseChartButton>
        </div>
        )
      </div>
    </div>
  )
}

export default TopBarChart
