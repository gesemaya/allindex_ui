import { useChainLoader } from '../../../route/RouteWrapper'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useRpcBlockContext } from '../../../context/naked/RpcBlockContext'
import { useDebounceState } from '../../../hooks/useDebounce'
import { FontWeightEnums } from '../../../types/Enums'
import { getTokenSymbol } from '../../../util/getTokenName'
import { useDataContext } from '../../../context/DataContext'
import { LastTradeResponse, OrderBookResponse } from '@gfxlabs/oku'
import { SkeletonLines } from '../../loadingStates/SkeletonLines'
import { ITrade, OrderBookItems } from './OrderBookItems'
import OrderBookOptions from './OrderBookOptions'
import { filterAsks, filterBids } from './filterOrders'
import { Trans } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCurrentClient } from '../../../hooks/useClient'

interface IOrderBookTitles {
  baseSymbol: string
  quoteSymbol: string
}

const OrderBookTitles = (props: IOrderBookTitles) => {
  const { baseSymbol, quoteSymbol } = props
  return (
    <div className="flex flex-row w-full px-2 text-gray-300 mb-2">
      <div className="flex flex-1">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          <Trans>Price</Trans> ({quoteSymbol})
        </T3>
      </div>
      <div className="flex flex-1 justify-end min-w-[100px]">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          <Trans>Amount</Trans> ({baseSymbol})
        </T3>
      </div>
      <div className="flex flex-1 justify-end">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          <Trans>Total</Trans> ({quoteSymbol})
        </T3>
      </div>
    </div>
  )
}

function OrderBook() {
  const { poolSummary, token, poolAddress } = useDataContext()

  const { blockNumberByChain } = useRpcBlockContext()

  const [asks, setAsks] = useDebounceState<ITrade[]>([], 50)
  const [bids, setBids] = useDebounceState<ITrade[]>([], 50)
  const [lastTrade, setLastTrade] = useState<LastTradeResponse>()
  const [token0Price, setToken0Price] = useState(0)
  const [baseSymbol, setBaseSymbol] = useState('')
  const [quoteSymbol, setQuoteSymbol] = useState('')
  const [optionSelect, setOptionSelect] = useState<'default' | 'asks' | 'bids'>('default')

  const [selectedGranularity, setSelectedGranularity] = useState(1)
  const { currentChainInfo } = useChainLoader()
  const [orderBook, setOrderBook] = useState<OrderBookResponse | undefined>(undefined)

  const [priceDecimals, setPriceDecimals] = useState(0)
  const [amountDecimals, setAmountDecimals] = useState(0)
  const [currentScalar, setCurrentScalar] = useState(0)

  const getSelectedGranularities = () => {
    return token.selected === 1 ? poolSummary.default_granularities : poolSummary.default_flipped_granularities
  }

  const { refetch, data: currentBooks } = useCurrentClient('cush_orderBookSet', [
    poolAddress,
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    blockNumberByChain,
  ])

  useEffect(() => {
    refetch()
  }, [poolAddress, blockNumberByChain])

  useEffect(() => {
    if (currentBooks) {
      let dat: undefined | OrderBookResponse = undefined
      if (token.selected === 0) {
        if (currentBooks.flipped) {
          dat = currentBooks.flipped[selectedGranularity]
        }
      } else {
        if (currentBooks.default) {
          dat = currentBooks.default[selectedGranularity]
        }
      }
      if (dat) {
        setOrderBook(dat)
      }
    }
  }, [selectedGranularity, currentBooks, token, poolSummary])

  useEffect(() => {
    if (token && poolSummary && orderBook && orderBook.asks && orderBook.bids) {
      setAsks(filterAsks(orderBook.asks))
      setBids(filterBids(orderBook.bids))
      setLastTrade(orderBook.last_trade)
      setPriceDecimals(orderBook.price_decimals)
      setAmountDecimals(orderBook.amount_decimals)
      setBaseSymbol(
        token.selected === 1
          ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)!
          : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)!
      )
      setQuoteSymbol(
        token.selected === 1
          ? getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)!
          : getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)!
      )
      setToken0Price(poolSummary.t0_price_usd)
      if (getSelectedGranularities) {
        const grans = getSelectedGranularities()
        if (grans) {
          setCurrentScalar(grans[selectedGranularity])
        }
      }
    }
  }, [orderBook, token])

  // window.log.log(poolSummary, poolSummary.default_granularities,  poolSummary.DefaultFlippedGranularities , asks , bids , orderBook)
  return (
    <div className="bg-[#0E0E0E] text-white  text-[12px] font-normal rounded-lg flex flex-1 flex-col outline outline-1 outline-gray-800  items-center w-full  ">
      {poolSummary &&
      poolSummary.default_granularities &&
      poolSummary.default_flipped_granularities &&
      asks &&
      bids &&
      orderBook ? (
        <div className="w-full flex flex-1 flex-col h-full py-3">
          <OrderBookOptions
            onOptionSelect={setOptionSelect}
            activeOption={optionSelect}
            suggestedGranularities={getSelectedGranularities()}
            selectedGranularity={selectedGranularity}
            setSelectedGranularity={setSelectedGranularity}
          />
          <OrderBookTitles baseSymbol={baseSymbol} quoteSymbol={quoteSymbol} />
          <OrderBookItems
            activeOption={optionSelect}
            lastTrade={lastTrade}
            asks={asks}
            bids={bids}
            priceDecimals={priceDecimals}
            amountDecimals={amountDecimals}
            token0Price={token0Price}
            scalar={currentScalar}
          />
        </div>
      ) : (
        <SkeletonLines lines={5} random />
      )}
    </div>
  )
}

export default OrderBook
