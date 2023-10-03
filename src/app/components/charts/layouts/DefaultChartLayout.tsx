import { ChartEnums } from '../../../types/Enums'
import LiquidityChart from '../charts/liquidityChart/LiquidityChart'
import { useChartDataContext } from '../context/ChartDataContext'
import TopBarChart from '../tools/TopBarChart'
import { TradingViewChart } from '../tradingview/chart'

function DefaultChartLayout() {
  const { chartType } = useChartDataContext()
  return (
    <div className="flex flex-1 flex-col bg-[#0E0E0E] outline outline-1 outline-gray-800 rounded-lg w-full" style={{}}>
      {chartType !== ChartEnums.TRADINGVIEW ? <TopBarChart /> : <></>}
      <div className="flex flex-1 w-full">
        <>
          {
            {
              [ChartEnums.DEPTH]: <>{<LiquidityChart />}</>,
              [ChartEnums.CANDLE]: <></>,
              [ChartEnums.TRADINGVIEW]: (
                <>
                  <TradingViewChart />
                </>
              ),
            }[chartType]
          }
        </>
      </div>
    </div>
  )
}

export default DefaultChartLayout
