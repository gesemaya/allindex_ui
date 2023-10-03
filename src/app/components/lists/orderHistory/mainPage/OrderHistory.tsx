import OrderHistoryDropDown from '../../../dropdown/OrderHistoryDropdown'
import OrderHistoryList from './OrderHistoryList'
import { useState } from 'react'

export const OrderHistory = () => {
  const [filter, setFilter] = useState('All')
  return (
    <div className="flex gap-1 flex-col flex-1">
      <div className="flex flex-row">
        <OrderHistoryDropDown filter={filter} setFilter={setFilter} />
      </div>
      <OrderHistoryList filter={filter} />
    </div>
  )
}

export default OrderHistory
