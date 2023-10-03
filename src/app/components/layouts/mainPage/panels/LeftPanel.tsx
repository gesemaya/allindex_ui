import { leftPanelWidth } from '../../../../constants/dimensions'
import OrderBook from '../../../lists/orderBook/OrderBook'
import TradingHistory from '../../../lists/tradingHistory/TradingHistory'
import BaseSwitch from '../../../switch/BaseSwitch'
import { useState } from 'react'

interface ILeftPanel {
  breakpoint: number
  chartIsNotFullScreen: boolean
  isDefaultLayout: boolean
}

function LeftPanel(props: ILeftPanel) {
  const { chartIsNotFullScreen, breakpoint } = props
  const [item, setItem] = useState(false)

  return chartIsNotFullScreen ? (
    <div
      className={`w-full
    ${breakpoint <= 1 ? '' : `max-w-[280px] min-w-[${leftPanelWidth}px]`}`}
    >
      <div className="flex flex-1 h-full w-full flex-col gap-1  ">
        <div className={`${breakpoint > 2 ? 'hidden' : ''}`}>
          <BaseSwitch item={item} setItem={setItem} item1={'Order Book'} item2={'Trading History'} />
        </div>
        {breakpoint < 3 && item ? <TradingHistory /> : <OrderBook />}
      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default LeftPanel
