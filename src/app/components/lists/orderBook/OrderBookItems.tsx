import { FormatNumber } from '../../numbers/FormatNumber'
import useBreakpoint from '../../../hooks/useBreakpoint'
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import { headerHeight } from '../../../constants/dimensions'
import { useDataContext } from '../../../context/DataContext'
import { LastTradeResponse, OrderBookTick } from '@gfxlabs/oku'
import getMouseLocation from '../../charts/utils/getMouseLocation'
import OrderBookHover from './OrderBookHover'
import OrderBookItem from './OrderBookItem'
import OrderBookLastTransaction from './OrderBookLastTransaction'
import { OrderBookViewOptions } from './OrderBookOptions'
import { LastTrandsactionHeight, modalHeight, OrderItemHeight } from './constants'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { useElementSize, useInterval, useTimeout } from 'usehooks-ts'

export interface ITrade extends OrderBookTick {
  total: number
}

interface IOrderBookItems {
  activeOption: OrderBookViewOptions
  lastTrade: LastTradeResponse | undefined
  asks: ITrade[]
  bids: ITrade[]
  priceDecimals: number
  amountDecimals: number
  token0Price: number
  scalar?: number
}

export const OrderBookItems = (props: IOrderBookItems) => {
  const { activeOption, lastTrade, asks, bids, priceDecimals, amountDecimals, token0Price, scalar } = props

  const { height: pageHeight } = useWindowDimensions()

  const [ref, { height }] = useElementSize()
  const [amountToShow, setAmountToShow] = useState(0)
  const { setChosenValue } = useDataContext()

  const calculateShowAmount = (h: number) => {
    if (h > pageHeight) {
      h = pageHeight
    }
    let amount =
      activeOption === 'default'
        ? Math.floor((h - LastTrandsactionHeight) / OrderItemHeight / 2)
        : Math.floor(h / OrderItemHeight)
    amount = Math.max(amount, 10)
    return amount
  }

  useEffect(() => {
    setAmountToShow(10)
  }, [pageHeight])

  useInterval(() => {
    let newNumber = calculateShowAmount(height)
    if (newNumber !== amountToShow) {
      setAmountToShow(newNumber)
    }
  }, 250)

  useEffect(() => {
    setAmountToShow(calculateShowAmount(height))
  }, [height])

  const [offsetAsks, setOffsetAsks] = useState<undefined | { top: number; left: number }>(undefined)
  const [offsetBids, setOffsetBids] = useState<undefined | { top: number; left: number }>(undefined)
  const [highlightAsks, setHighlightAsks] = useState<number | undefined>(undefined)
  const [highlightBids, setHighlightBids] = useState<number | undefined>(undefined)
  const [isAsksHovered, setIsAsksHovered] = useState(false)
  const [isBidsHovered, setIsBidsHovered] = useState(false)
  const { token } = useDataContext()

  const [askData, setAskData] = useState<undefined | { avgPrice: JSX.Element; t0Sum: JSX.Element; t1Sum: JSX.Element }>(
    undefined
  )
  const [bidData, setBidData] = useState<undefined | { avgPrice: JSX.Element; t0Sum: JSX.Element; t1Sum: JSX.Element }>(
    undefined
  )

  const [refAsks, sizeAsks] = useElementSize()
  const [refBids, sizeBids] = useElementSize()

  const modalOffset = 100

  const onDragAsks = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, width: number) => {
    const { y } = getMouseLocation(e)
    const quant = Math.ceil(y / OrderItemHeight) === amountToShow ? amountToShow - 1 : Math.floor(y / OrderItemHeight)
    const data = asks.slice(-(amountToShow - quant))
    setHighlightAsks(quant * OrderItemHeight)
    setOffsetAsks({ top: y, left: width })
    const t0Sum = sumArray(data.map((item) => parseFloat(item.size)))
    const t1Sum = sumArray(
      data.map(
        (item) => (parseFloat(item.size) / 10 ** amountDecimals) * (parseFloat(item.price) / 10 ** priceDecimals)
      )
    )

    const avgPrice = weightedSumArray(data.map((item) => [parseFloat(item.price), parseFloat(item.size)]))

    setAskData({
      avgPrice: <FormatNumber num={avgPrice.weightedPrice / 10 ** priceDecimals} singleLetterNotation={true} />,
      t0Sum: (
        <FormatNumber
          num={token.selected === 0 ? Number(t1Sum) : Number(t0Sum) / 10 ** amountDecimals}
          singleLetterNotation={true}
        />
      ),
      t1Sum: (
        <FormatNumber
          num={token.selected === 0 ? Number(t0Sum) / 10 ** amountDecimals : Number(t1Sum)}
          singleLetterNotation={true}
        />
      ),
    })
  }

  const sumArray = (arr: number[]) => {
    const sum = arr.reduce((grabSum, val) => grabSum + val, 0)
    return sum
  }

  const weightedSumArray = (arr: number[][]) => {
    const sizeArr = arr.map((item) => item[1])
    const sumSize = sumArray(sizeArr)
    const weight = sizeArr.map((item) => item / sumSize)
    const weightedPriceArr = arr.map((item, index) => item[0] * weight[index])
    return { weightedPrice: sumArray(weightedPriceArr), weightSizeArray: weight }
  }

  const onDragBids = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, width: number) => {
    const { y } = getMouseLocation(e)
    if (sizeBids)
      setOffsetBids({ top: y < sizeBids?.height - modalOffset ? y : sizeBids?.height - modalHeight, left: width })
    const quant = Math.floor(y / OrderItemHeight) === 0 ? 1 : Math.ceil(y / OrderItemHeight)
    const data = bids.slice(0, quant)
    setHighlightBids(quant * OrderItemHeight)
    const t0Sum = sumArray(data.map((item) => parseFloat(item.size)))
    const t1Sum = sumArray(
      data.map(
        (item) => (parseFloat(item.size) / 10 ** amountDecimals) * (parseFloat(item.price) / 10 ** priceDecimals)
      )
    )
    const avgPrice = weightedSumArray(data.map((item) => [parseFloat(item.price), parseFloat(item.size)]))
    setBidData({
      avgPrice: <FormatNumber num={avgPrice.weightedPrice / 10 ** priceDecimals} singleLetterNotation={true} />,
      t0Sum: (
        <FormatNumber
          num={token.selected === 0 ? Number(t1Sum) : Number(t0Sum) / 10 ** amountDecimals}
          singleLetterNotation={true}
        />
      ),
      t1Sum: (
        <FormatNumber
          num={token.selected === 0 ? Number(t0Sum) / 10 ** amountDecimals : Number(t1Sum)}
          singleLetterNotation={true}
        />
      ),
    })
  }

  const onMouseLeaveAsks = () => {
    setOffsetAsks(undefined)
    setHighlightAsks(undefined)
    setAskData(undefined)
  }

  const onMouseLeaveBids = () => {
    setOffsetBids(undefined)
    setHighlightBids(undefined)
    setBidData(undefined)
  }

  const onMouseDownAsks = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const { y } = getMouseLocation(e)
    const quant = Math.ceil(y / OrderItemHeight) === amountToShow ? amountToShow - 1 : Math.floor(y / OrderItemHeight)
    const data = asks.slice(-(amountToShow - quant))
    const chosenData = data[0]
    setChosenValue({ side: 'ask', trade: chosenData })
  }

  const onMouseDownBids = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const { y } = getMouseLocation(e)
    const quant = Math.floor(y / OrderItemHeight) === 0 ? 1 : Math.ceil(y / OrderItemHeight)
    const data = bids.slice(0, quant)
    const chosenData = data[quant - 1]
    setChosenValue({ side: 'bid', trade: chosenData })
  }

  return (
    <div className={`flex flex-1 flex-col w-full`} ref={ref}>
      {amountToShow > 0 && (
        <div className="flex flex-col  ">
          <div
            ref={refAsks}
            className={`w-full overflow-hidden flex-col position flex ${activeOption !== 'asks' ? 'block' : 'hidden'}`}
            onMouseEnter={() => setIsAsksHovered(true)}
            onMouseLeave={() => setIsAsksHovered(false)}
          >
            {asks.slice(-amountToShow).map((trade, index, arr) => {
              const weight = weightedSumArray(arr.map((item) => [parseFloat(item.price), parseFloat(item.size)]))
              return (
                <OrderBookItem
                  weight={weight.weightSizeArray[index] / Math.max(...weight.weightSizeArray)}
                  trade={trade}
                  isBid={false}
                  key={index}
                  priceDecimals={priceDecimals}
                  amountDecimals={amountDecimals}
                  scalar={scalar}
                />
              )
            })}
            {sizeAsks && (
              <div
                className={`absolute ${isAsksHovered ? 'z-10' : ''}`}
                style={{
                  width: sizeAsks.width,
                  height: sizeAsks.height,
                }}
              >
                <svg className="absolute" width={sizeAsks.width} height={sizeAsks.height}>
                  {highlightAsks !== undefined && (
                    <g>
                      <rect
                        y={highlightAsks}
                        width={sizeAsks.width}
                        fill={'#2346FD26'}
                        height={sizeAsks.height - highlightAsks}
                      ></rect>
                      <line
                        strokeWidth={2}
                        stroke={'#2346FD'}
                        y1={highlightAsks}
                        y2={highlightAsks}
                        x1={0}
                        x2={sizeAsks.width}
                      ></line>
                    </g>
                  )}
                </svg>
                <div
                  onMouseMove={(e) => onDragAsks(e, sizeAsks.width)}
                  onMouseDown={(e) => onMouseDownAsks(e)}
                  onMouseLeave={onMouseLeaveAsks}
                  className="absolute"
                  style={{ width: sizeAsks.width, height: sizeAsks.height }}
                ></div>
                {offsetAsks && askData && (
                  <OrderBookHover data={askData} offsetLeft={offsetAsks.left} offsetTop={offsetAsks.top} />
                )}
              </div>
            )}
          </div>
          {activeOption === 'default' && <OrderBookLastTransaction trade={lastTrade} />}
          <div
            ref={refBids}
            className={`w-full overflow-hidden flex-col   flex ${activeOption !== 'bids' ? 'block' : 'hidden'}`}
            onMouseEnter={() => setIsBidsHovered(true)}
            onMouseLeave={() => setIsBidsHovered(false)}
          >
            {bids.slice(0, amountToShow).map((trade, index, arr) => {
              const weight = weightedSumArray(arr.map((item) => [parseFloat(item.price), parseFloat(item.size)]))

              return (
                <OrderBookItem
                  weight={weight.weightSizeArray[index] / Math.max(...weight.weightSizeArray)}
                  trade={trade}
                  isBid={true}
                  key={index}
                  priceDecimals={priceDecimals}
                  amountDecimals={amountDecimals}
                  scalar={scalar}
                />
              )
            })}
            {sizeBids && (
              <div
                className={`absolute ${isBidsHovered ? 'z-10' : ''}`}
                style={{
                  width: sizeBids.width,
                  height: sizeBids.height,
                }}
              >
                <svg className="absolute" width={sizeBids.width} height={sizeBids.height}>
                  {highlightBids !== undefined && (
                    <g>
                      <rect y={0} fill={'#2346FD26'} width={sizeBids.width} height={highlightBids}></rect>
                      <line
                        strokeWidth={2}
                        stroke={'#2346FD'}
                        y1={highlightBids}
                        y2={highlightBids}
                        x1={0}
                        x2={sizeBids.width}
                      ></line>
                    </g>
                  )}
                </svg>
                <div
                  onMouseMove={(e) => onDragBids(e, sizeBids.width)}
                  onMouseDown={(e) => onMouseDownBids(e)}
                  onMouseLeave={onMouseLeaveBids}
                  className="absolute"
                  style={{ width: sizeBids.width, height: sizeBids.height }}
                ></div>
                {offsetBids && bidData && (
                  <OrderBookHover data={bidData} offsetLeft={offsetBids.left} offsetTop={offsetBids.top} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
