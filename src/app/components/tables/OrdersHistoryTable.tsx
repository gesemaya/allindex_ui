import { useChainLoader } from '../../route/RouteWrapper'
import { OrderBuyAmount, OrderPriceAmount, OrderSellAmount } from '../orders/OrdersInfo'
import OrderStatusTag from '../tags/OrderStatusTag'
import { T1, T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import { getTokenSymbol } from '../../util/getTokenName'
import { getMMDDYYYY, timeNumberConvertString } from '../../util/timeConvert'
import { Order } from '@gfxlabs/oku'
import ManageOrderDropdown from '../dropdown/ManageOrderDropdown'
import { PoolPairFromSymbol } from '../dropdown/PairDropdown'
import Paginator from './Paginator'
import { TableDrawer } from './TableDrawer'
import { useEffect, useMemo, useState } from 'react'

interface IOrdersHistoryTable {
  historyData: Order[]
}

function OrdersHistoryTable(props: IOrdersHistoryTable) {
  const { historyData } = props
  const [currentPage, setCurrentPage] = useState(1)
  const { currentChainInfo } = useChainLoader()

  const thClass = 'p-4 first:rounded-tl-xl last:rounded-tr-xl'

  let PageSize = 10

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return historyData.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, historyData])

  const makeDrawer = () => {
    return new TableDrawer<Order>(
      [
        {
          title: 'Type',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (order) => {
            return <T2>{order.type ? capitalizeFirstLetter(order.type) : ''}</T2>
          },
        },
        {
          title: 'Status',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (order) => {
            return <OrderStatusTag status={order.status as any} />
          },
        },
        {
          title: 'Pool',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (order) => {
            return (
              <div className="flex gap-1">
                <PoolPairFromSymbol
                  token0Address={order.base_currency_address ? order.base_currency_address : ''}
                  token1Address={order.quote_currency_address ? order.quote_currency_address : ''}
                  token0Symbol={
                    getTokenSymbol(order.base_currency_address!, order.base_currency!, currentChainInfo.id)!
                  }
                  token1Symbol={
                    getTokenSymbol(order.quote_currency_address!, order.quote_currency!, currentChainInfo.id)!
                  }
                />
                <div className="rounded-[6px] p-1" style={{ backgroundColor: colors.gray[600] }}>
                  <T2>{order.fee! / 10000}%</T2>
                </div>
              </div>
            )
          },
        },
        {
          title: 'Buy Amount',
          headerClass: `${thClass} text-right`,
          dataClass: `${thClass} text-right`,
          render: (order) => {
            return (
              <div className="flex justify-end">
                <T2>
                  <OrderBuyAmount order={order} />
                </T2>
              </div>
            )
          },
        },
        {
          title: 'Sell Amount',
          headerClass: `${thClass} text-right`,
          dataClass: `${thClass} text-right`,
          render: (order) => {
            return (
              <div className="flex justify-end">
                <T2>
                  <OrderSellAmount order={order} />
                </T2>
              </div>
            )
          },
        },
        {
          title: 'Price',
          headerClass: `${thClass} text-right`,
          dataClass: `${thClass} text-right`,
          render: (order: Order) => {
            return (
              <div className="flex justify-end">
                <T2>
                  <OrderPriceAmount order={order} />
                </T2>
              </div>
            )
          },
        },
        {
          title: 'Time',
          headerClass: `${thClass} text-right pl-2`,
          dataClass: `${thClass} text-right pl-2`,
          render: (order) => {
            return (
              <>
                <T2>{order.time ? getMMDDYYYY(order.time) : ''}</T2>
                <T3 color={'#7C85A2'}>{order.time ? timeNumberConvertString(order.time) : ''}</T3>
              </>
            )
          },
        },
        {
          title: <>{''}</>,
          headerClass: 'rounded-tr-xl',
          dataClass: 'flex justify-end p-4',
          render: (order) => {
            return <ManageOrderDropdown order={order} isOrderPage={true} />
          },
        },
      ],
      {
        tableClass: 'w-full overflow-y-auto',
        tbodyClass: '',
        headerRowClass: 'h-16 text-[#7C85A2] text-[14px] font-regular bg-[#0E111A] rounded-tr-xl rounded-tl-xl',
        dataRowClass: 'border-[1px] border-[#293249]',
      }
    ).withData(currentTableData)
  }

  const [drawer, setDrawer] = useState(makeDrawer())

  useEffect(() => {
    setDrawer(makeDrawer())
  }, [currentChainInfo, currentTableData])

  return (
    <>
      {historyData && historyData.length <= 0 ? (
        <div className="mt-10 flex flex-1 justify-center w-full">
          <T1>No Orders Yet</T1>
        </div>
      ) : (
        <>
          {drawer.render()}
          <Paginator
            currentPage={currentPage}
            totalCount={historyData.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  )
}

export default OrdersHistoryTable
