import { useChainLoader } from '../../../../route/RouteWrapper'
import { OrderBuyAmount, OrderPriceAmount, OrderSellAmount } from '../../../orders/OrdersInfo'
import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { capitalizeFirstLetter } from '../../../../util/capitalizeFirstLetter'
import { getTokenSymbol } from '../../../../util/getTokenName'
import { getMMDDYYYY } from '../../../../util/timeConvert'
import { Order } from '@gfxlabs/oku'
import ManageOrderDropdown from '../../../dropdown/ManageOrderDropdown'

interface IOrderItem {
  order: Order
}

const OrderHistoryItem = (props: IOrderItem) => {
  const { order } = props
  const { currentChainInfo } = useChainLoader()

  return (
    <div
      className="relative grid grid-cols-5 min-[1200px]:grid-cols-12 min-[1600px]:grid-cols-8 min-[1600px]:gap-x-4 min-[1880px]:grid-cols-12 w-full text-[12px] font-normal pr-6 gap-x-2"
      style={{ backgroundColor: colors.gray.dark }}
    >
      <div className="col-start-1">
        <T3 color={colors.gray[100]}>{order.type && capitalizeFirstLetter(order.type)}</T3>
      </div>
      <div className="col-start-2 min-[1200px]:col-start-3 min-[1600px]:col-start-2">
        <T3 color={colors.gray[100]}>{order.status && capitalizeFirstLetter(order.status)}</T3>
      </div>
      <div className="col-start-3 min-[1200px]:col-start-5 min-[1600px]:col-start-3 flex flex-nowrap">
        <T3 color={colors.gray[100]}>
          {getTokenSymbol(order.base_currency_address!, order.base_currency, currentChainInfo.id)}
        </T3>
        <T3 color={'#7C85A2'}>
          /{getTokenSymbol(order.quote_currency_address!, order.quote_currency, currentChainInfo.id)}
        </T3>
      </div>
      <div className="col-start-4 min-[1200px]:col-start-8 min-[1600px]:col-start-5 hidden min-[1200px]:block">
        <T3 color={colors.gray[100]}>{order.fee! / 10000}%</T3>
      </div>
      <div className="min-[1880px]:col-start-6 min-[1880px]:flex max-[1880px]:hidden whitespace-nowrap">
        <T3>
          <OrderBuyAmount order={order} />
        </T3>
      </div>
      <div className="min-[1880px]:col-start-8 min-[1880px]:flex max-[1880px]:hidden whitespace-nowrap">
        <T3>
          <OrderSellAmount order={order} />
        </T3>
      </div>
      <div className="min-[1600px]:col-start-6 max-[1600px]:hidden min-[1880px]:col-start-10">
        <T3>{order.time ? getMMDDYYYY(order.time) : ''}</T3>
      </div>
      <div className="col-start-5 min-[1200px]:col-start-12 min-[1600px]:col-start-8 min-[1880px]:col-start-12 justify-self-end whitespace-nowrap">
        <T3 color={colors.gray[100]}>
          <OrderPriceAmount order={order} />
        </T3>
      </div>
      <div className="absolute right-0 top-[-8px]">
        <ManageOrderDropdown order={order} isOrderPage={false} />
      </div>
    </div>
  )
}

export default OrderHistoryItem
