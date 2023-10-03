import { useChainLoader } from '../../../route/RouteWrapper'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getTokenSymbol } from '../../../util/getTokenName'
import { useDataContext } from '../../../context/DataContext'
import { SkeletonLines } from '../../loadingStates/SkeletonLines'
import TradeHistoryItem from './TradeHistoryItem'
import TradeHistoryTitles from './TradeHistoryTitles'
import styles from './tradeHistory.module.css'
import { Hash, SwapHistoryResponse } from '@gfxlabs/oku'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { useCurrentClient } from '../../../hooks/useClient'

function TradingHistory() {
  const { currentChainInfo } = useChainLoader()
  const { poolSummary, blockNumber, poolAddress } = useDataContext()
  const [shouldAnimate, setShouldAnimate] = useState<Hash[]>([])
  const [clientHeight, setClientHeight] = useState(0)
  const [baseSymbol, setBaseSymbol] = useState('')
  const [quoteSymbol, setQuoteSymbol] = useState('')
  const lineHeight = 20

  const [currentList, setCurrentList] = useState<Hash[]>([])
  const { width } = useWindowSize()

  useEffect(() => {
    if (poolSummary) {
      setBaseSymbol(getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)!)
      setQuoteSymbol(getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)!)
    }
  }, [poolSummary])

  const { data: tradeHistory } = useCurrentClient('cush_recentSwaps', [poolAddress, 50, true], {
    queryKey: [blockNumber],
  })

  const [trades, setTrades] = useState<null | SwapHistoryResponse>(null)

  useEffect(() => {
    if (!tradeHistory) {
      return
    }
    if (!(tradeHistory.swaps && tradeHistory.swaps.length > 0 && trades && trades.swaps.length > 0)) {
      setTrades(tradeHistory)
      setCurrentList(tradeHistory.swaps.map((swap) => swap.transaction))
      setShouldAnimate([])
      return
    }
    if (!(tradeHistory.swaps[0].event.eventAddress === trades.swaps[0].event.eventAddress)) {
      if (tradeHistory.swaps) {
        setTrades(tradeHistory)
        setCurrentList(tradeHistory.swaps.map((swap) => swap.transaction))
        setShouldAnimate([])
      }
      return
    }
    const newSwaps = tradeHistory.swaps.filter((swap) => !currentList.includes(swap.transaction))

    if (newSwaps.length > 0) {
      setShouldAnimate(newSwaps.map((swap) => swap.transaction))
      setCurrentList(tradeHistory.swaps.map((swap) => swap.transaction))
    }
  }, [tradeHistory])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      setClientHeight(ref.current?.clientHeight)
    }
  }, [ref.current?.clientHeight])

  return (
    <div className="flex flex-1 ">
      <div className="bg-[#0E0E0E] w-full rounded-xl flex flex-col items-center outline outline-1 outline-gray-800 pt-3 pb-2">
        <T3 color={colors.gray[50]}>Trading History</T3>
        <TradeHistoryTitles baseSymbol={baseSymbol} quoteSymbol={quoteSymbol} />
        <div className={`relative w-full overflow-hidden ${width < 700 ? 'h-[600px]' : 'h-full'}`} ref={ref}>
          <div className="relative md:absolute  w-full">
            {tradeHistory ? (
              <div className="w-full flex flex-col">
                {tradeHistory.swaps
                  .slice((-1 * clientHeight) / lineHeight)
                  .reverse()
                  .map((trade, index) => {
                    let shouldBlink = shouldAnimate.includes(trade.transaction)
                    // console.log(index, shouldBlink)
                    return (
                      <div
                        className={`${shouldBlink ? styles.firstRowAnimation : ''} h-[20px]`}
                        onAnimationEnd={() => (shouldBlink = false)}
                        key={index}
                      >
                        <TradeHistoryItem trade={trade} isNew={shouldBlink} scanUrl={currentChainInfo.scanUrl} />
                      </div>
                    )
                  })}
              </div>
            ) : (
              <SkeletonLines lines={13} random />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradingHistory
