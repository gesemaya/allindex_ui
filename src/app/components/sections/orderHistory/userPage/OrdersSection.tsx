import { T1 } from '../../../typography/Typography'
import { Order, UserPositions } from '@gfxlabs/oku'
import FilterOrdersDropdown from '../../../dropdown/FilterOrdersDropdown'
import FilterPositionsDropdown from '../../../dropdown/FilterPositionsDropdown'
import OrdersHistoryTable from '../../../tables/OrdersHistoryTable'
import PositionsHistoryTable from '../../../tables/PositionsHistoryTable'
import { useState } from 'react'
import { useAccount } from 'wagmi'

function OrdersSection(props: { orderHistoryData: Order[]; positionData: UserPositions[] }) {
  const { orderHistoryData, positionData } = props
  const { isConnected } = useAccount()
  const [showPositions, setShowPositions] = useState(false)
  const [positionsFilter, setPositionsFilter] = useState<string[]>([])
  const [ordersFilter, setOrdersFilter] = useState<string[]>([])

  const filteredSortedPositionsData = positionData
    .filter((position) => positionsFilter.length === 0 || positionsFilter.includes(position.status))
    .sort((a, b) => {
      const bValue =
        Number(b.current_position_values.amount0_current_usd) + Number(b.current_position_values.amount1_current_usd)
      const aValue =
        Number(a.current_position_values.amount0_current_usd) + Number(a.current_position_values.amount1_current_usd)

      return bValue - aValue
    })

  const filteredOrdersData = orderHistoryData.filter(
    (order) => ordersFilter.length === 0 || ordersFilter.includes(order.status!)
  )

  return (
    <div className="flex flex-1 rounded-[16px] flex-col px-4 overflow:auto">
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row gap-4 text-[16px]">
          <button
            className={`hover:text-[#4C82FB] ${!showPositions ? 'text-[#4C82FB]' : 'text-white'}`}
            onClick={() => setShowPositions(false)}
          >
            Orders
          </button>
          <button
            className={`hover:text-[#4C82FB] ${showPositions ? 'text-[#4C82FB]' : 'text-white'}`}
            onClick={() => setShowPositions(true)}
          >
            Positions
          </button>
        </div>
        {showPositions ? (
          <FilterPositionsDropdown filter={positionsFilter} setFilter={setPositionsFilter} />
        ) : (
          <FilterOrdersDropdown filter={ordersFilter} setFilter={setOrdersFilter} />
        )}
      </div>
      {isConnected ? (
        showPositions ? (
          <PositionsHistoryTable positions={filteredSortedPositionsData} />
        ) : (
          <OrdersHistoryTable historyData={filteredOrdersData} />
        )
      ) : (
        <T1>Please Connect Wallet</T1>
      )}
    </div>
  )
}

export default OrdersSection
