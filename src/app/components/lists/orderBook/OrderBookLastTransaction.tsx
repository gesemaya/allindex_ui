import { FormatNumber } from '../../numbers/FormatNumber'
import { T1, T3 } from '../../typography/Typography'
import { useThemeContext } from '../../../context/naked/ThemeContext'
import { useDataContext } from '../../../context/DataContext'
import { LastTradeResponse } from '@gfxlabs/oku'
import { LastTrandsactionHeight } from './constants'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

const OrderBookLastTransaction = ({ trade }: { trade: LastTradeResponse | undefined }) => {
  const { colors } = useThemeContext()
  const { poolSummary } = useDataContext()
  const [blink, setBlink] = useState('white')

  useEffect(() => {
    if (trade && trade.price) {
      side === 'BUY' ? setBlink(colors.pos_color) : setBlink(colors.neg_color)
    }
  }, [trade?.price])

  useEffect(() => {
    if (blink === colors.pos_color || blink === colors.neg_color) {
      setTimeout(() => {
        setBlink('white')
      }, 150)
    }
  }, [blink])

  if (!trade) {
    return (
      <div role="status" className="animate-pulse px-10 my-1 " style={{ height: LastTrandsactionHeight }}>
        <div className="h-[20px] bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px]  mx-auto"></div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  const { price, side } = trade
  const tokenPriceUSD = poolSummary.is_preferred_token_order ? poolSummary.t0_price_usd : poolSummary.t1_price_usd

  return (
    <div
      className="flex items-center flex-row w-full justify-evenly px-2 hover:bg-[#FFFFFF10]"
      style={{ height: LastTrandsactionHeight }}
    >
      <div className="flex flex-row  justify-between w-full items-end">
        <div className="flex flex-row">
          {side === 'BUY' ? <ArrowUpIcon width={16} color={blink} /> : <ArrowDownIcon width={16} color={blink} />}
          <T1 color={blink}>
            <FormatNumber num={price} smallNumberOn2Zeros={true} />
          </T1>
        </div>
        <T3 color={blink}>
          $
          <FormatNumber num={tokenPriceUSD} smallNumberOn2Zeros={true} />
        </T3>
      </div>
    </div>
  )
}

export default OrderBookLastTransaction
