import { FormatByGranularity, FormatNumber } from '../../numbers/FormatNumber'
import { useThemeContext } from '../../../context/naked/ThemeContext'
import { ITrade } from './OrderBookItems'
import { OrderItemHeight } from './constants'

interface IOrderBookItem {
  trade: ITrade
  isBid: boolean
  weight: number
  priceDecimals: number
  amountDecimals: number
  scalar?: number
}

const OrderBookItem = (props: IOrderBookItem) => {
  const { trade, isBid = true, weight = 0, amountDecimals, priceDecimals, scalar = 1 } = props
  const { colors } = useThemeContext()
  const granularity = scalar
  return (
    <div
      className="flex flex-row w-full px-2 hover:bg-[#FFFFFF10] gap-x-2 relative"
      style={{ height: OrderItemHeight }}
    >
      <div
        className="bg-red-200 mt-[1px] flex rounded-[4px] absolute right-0"
        style={{
          width: (80 * weight).toString().concat('%'),
          height: OrderItemHeight - 4,
          backgroundColor: isBid ? colors.pos_vol_color : colors.neg_vol_color,
        }}
      />
      <div className="grid grid-cols-3 justify-between gap-x-1 w-full z-[2]">
        <div>
          <div style={{ color: isBid ? colors.pos_color : colors.neg_color, userSelect: 'none' }}>
            <FormatByGranularity num={Number(trade.price) * 10 ** -priceDecimals} granularity={granularity} />
          </div>
        </div>
        <div className="text-end">
          <div style={{ userSelect: 'none', textAlign: 'center' }}>
            <FormatNumber num={Number(parseFloat(trade.size) * 10 ** -amountDecimals)} singleLetterNotation={true} />
          </div>
        </div>
        <div className="text-end pr-1">
          <div style={{ userSelect: 'none' }}>
            <FormatNumber
              num={
                Number(parseFloat(trade.size) * 10 ** -amountDecimals) * (Number(trade.price) * 10 ** -priceDecimals)
              }
              singleLetterNotation={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBookItem
