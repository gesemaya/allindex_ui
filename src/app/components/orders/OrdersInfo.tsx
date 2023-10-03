import { useChainLoader } from '../../route/RouteWrapper'
import { Order } from '../../client'
import { getTokenSymbol } from '../../util/getTokenName'
import { FormatNumber } from '../numbers/FormatNumber'

/*
*****ORDERS FOLLOW THIS LOGIC*****
** LIMIT ORDERS **
** SELL =>
Buy: amount_total*price
Sell: amount_total
** BUY =>
Buy: amount_total/price
Sell: amount_total 
** MARKET ORDERS **
** SELL => 
Buy: amount_total*price
Sell: amount_total 
** BUY =>
Buy: amount_total
Sell: amount_total*price
*/

interface IOrderInfo {
  order: Order
}

export const OrderBuyAmount = (props: IOrderInfo) => {
  const { order } = props
  const { currentChainInfo } = useChainLoader()
  const base_symbol = getTokenSymbol(order.base_currency_address!, order.base_currency, currentChainInfo.id)
  const quote_symbol = getTokenSymbol(order.quote_currency_address!, order.quote_currency, currentChainInfo.id)

  if (order.type === 'MARKET') {
    if (order.side === 'BUY') {
      return (
        <div className="flex gap-1">
          <FormatNumber num={order.amount_total ? order.amount_total : 0} singleLetterNotation={true} />
          <span>{base_symbol}</span>
        </div>
      )
    } else {
      const numValue = Number(order.amount_total) * Number(order.price)
      return (
        <div className="flex gap-1">
          <FormatNumber num={numValue} singleLetterNotation={true} />
          <span>{quote_symbol}</span>
        </div>
      )
    }
  } else {
    if (order.side === 'BUY') {
      const numValue = Number(order.amount_total) / Number(order.price)
      return (
        <div className="flex gap-1">
          <FormatNumber num={numValue} singleLetterNotation={true} />
          <span>{base_symbol}</span>
        </div>
      )
    } else {
      const numValue = Number(order.amount_total) * Number(order.price)
      return (
        <div className="flex gap-1">
          <FormatNumber num={numValue} singleLetterNotation={true} />
          <span>{quote_symbol}</span>
        </div>
      )
    }
  }
}

export const OrderSellAmount = (props: IOrderInfo) => {
  const { order } = props
  const { currentChainInfo } = useChainLoader()
  const base_symbol = getTokenSymbol(order.base_currency_address!, order.base_currency, currentChainInfo.id)
  const quote_symbol = getTokenSymbol(order.quote_currency_address!, order.quote_currency, currentChainInfo.id)

  if (order.type === 'MARKET') {
    if (order.side === 'BUY') {
      const numValue = Number(order.amount_total) * Number(order.price)
      return (
        <div className="flex gap-1">
          <FormatNumber num={numValue} singleLetterNotation={true} />
          <span>{quote_symbol}</span>
        </div>
      )
    } else {
      return (
        <div className="flex gap-1">
          <FormatNumber num={Number(order.amount_total)} singleLetterNotation={true} />
          <span>{base_symbol}</span>
        </div>
      )
    }
  } else {
    if (order.side === 'BUY') {
      return (
        <div className="flex gap-1">
          <FormatNumber num={Number(order.amount_total)} singleLetterNotation={true} />
          <span>{quote_symbol}</span>
        </div>
      )
    } else {
      return (
        <div className="flex gap-1">
          <FormatNumber num={Number(order.amount_total)} singleLetterNotation={true} />
          <span>{base_symbol}</span>
        </div>
      )
    }
  }
}

export const OrderPriceAmount = (props: IOrderInfo) => {
  const { order } = props
  const { currentChainInfo } = useChainLoader()
  const base_symbol = getTokenSymbol(order.base_currency_address!, order.base_currency, currentChainInfo.id)
  const quote_symbol = getTokenSymbol(order.quote_currency_address!, order.quote_currency, currentChainInfo.id)

  const orderPrice = order.should_flip ? 1 / Number(order.avg_price) : Number(order.avg_price)
  return (
    <div className="flex gap-1">
      <FormatNumber num={orderPrice} singleLetterNotation={true} />
      <span>{order.should_flip ? base_symbol : quote_symbol}</span>
    </div>
  )
}
