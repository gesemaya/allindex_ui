import PoolSection from '../../../lists/poolList/PoolSection'
import TradingHistory from '../../../lists/tradingHistory/TradingHistory'

interface IRightPanel {
  breakpoint: number
  chartIsNotFullScreen: boolean
}

function RightPanel(props: IRightPanel) {
  const { chartIsNotFullScreen, breakpoint } = props
  return (
    breakpoint < 3 || (
      <div className={`flex min-w-[280px] max-w-[280px] gap-2 flex-1 flex-col`}>
        <PoolSection />
        <TradingHistory />
      </div>
    )
  )
}

export default RightPanel
