import { getNearestTick, price2Tick, tick2Price } from '../../../../lib/liquidity'
import { BetweenNumbers } from '../../../../util/between'
import { useDataContext } from '../../../../context/DataContext'
import ChartLoadingState from '../../../loadingStates/ChartLoadingState'
import LiquidityContainer from './components/containers/LiquidityContainer'
import { maxTick, minTick, xAxisHeight, yAxisWidth } from './constants'
import { ChartRenderer } from './draw'
import { IBounds, IChartAttributes, ITick, ITickPrice } from './type'
import { getLiquidityDataFromSnapshot } from './util'
import { useCallback, useEffect, useState } from 'react'
import { useElementSize } from 'usehooks-ts'

function LiquidityChart() {
  const { token, liquidityChart } = useDataContext()
  const [lastPoolAddress, setLastPoolAddress] = useState('')
  const [loadingChart, setLoadingChart] = useState(false)
  const [currentTick, setCurrentTick] = useState<undefined | number>(undefined)
  const [hoveredTick, setHoveredTick] = useState<ITick | undefined>(undefined)
  const [ref, { width: clientWidth, height: clientHeight }] = useElementSize()
  const [liqData, setLiqData] = useState<
    { ticks: ITickPrice[]; currentTick: number; tickSpacing: number } | undefined
  >()
  const [chart, setChart] = useState<ChartRenderer<ITick> | undefined>(undefined)

  const defaultBounds = useCallback(() => {
    if (!(liquidityChart && token)) {
      return undefined
    }
    const px = tick2Price(liquidityChart.current_pool_tick, token)
    const pxDiff = px * Math.min(0.3, liquidityChart.tick_spacing / 250)
    const pxLow = Math.max(px + pxDiff, 0)
    const pxHigh = Math.max(px - pxDiff, 0)
    if (isNaN(pxHigh) || isNaN(pxLow)) {
      return undefined
    }
    const newBounds = {
      lower: price2Tick(pxLow, token),
      upper: price2Tick(pxHigh, token),
    }
    if (newBounds.lower > newBounds.upper) {
      ;[newBounds.lower, newBounds.upper] = [newBounds.upper, newBounds.lower]
    }
    return newBounds
  }, [liquidityChart, token])

  const [bounds, setBoundsRaw] = useState<IBounds | undefined>(defaultBounds())

  const setBounds = (v?: IBounds) => {
    if (v) {
      if (liquidityChart) {
        if (v.upper - v.lower < liquidityChart.tick_spacing * 4) {
          return
        }
        if (v.upper > maxTick) {
          return
        }
        if (v.upper < minTick) {
          return
        }
        if (v.lower < minTick) {
          return
        }
      }
      setBoundsRaw(v)
    } else {
      setBoundsRaw(defaultBounds())
    }
  }

  useEffect(() => {
    if (liquidityChart) {
      const newVal = liquidityChart.pool
      if (newVal !== lastPoolAddress) {
        setBounds(undefined)
        setLastPoolAddress(newVal)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityChart])

  useEffect(() => {
    if (bounds === undefined) {
      setBounds(undefined)
    }
    if (liquidityChart && token) {
      setLoadingChart(false)
      let nearestTick = liquidityChart.current_pool_tick
      setCurrentTick(nearestTick)
      const ans = getLiquidityDataFromSnapshot(token, liquidityChart)
      setLiqData({
        ticks: ans,
        currentTick: liquidityChart.current_pool_tick,
        tickSpacing: liquidityChart.tick_spacing,
      })
    } else {
      setLoadingChart(true)
    }
    if (bounds === undefined) {
      setBounds(undefined)
    }
  }, [liquidityChart, token])

  useEffect(() => {
    let currentBounds = bounds ? bounds : defaultBounds()
    if (bounds === undefined) {
      setBounds(bounds)
      return
    }
    if (liqData && currentBounds) {
      const vLower = getNearestTick(currentBounds.lower, liqData.tickSpacing, token) - liqData.tickSpacing * 3
      const vUpper = getNearestTick(currentBounds.upper, liqData.tickSpacing, token) + liqData.tickSpacing * 3
      let data = liqData.ticks.filter((x) => {
        return BetweenNumbers(vLower, vUpper, x.tick)
      })
      let chartData = [...data]

      if (
        !chartData.find((x) => {
          return x.tick === Math.floor(vUpper)
        })
      ) {
        chartData.push({
          tick: vUpper,
          price: tick2Price(vUpper, token),
          amount: 0,
        })
      }

      if (
        !chartData.find((x) => {
          return x.tick === Math.floor(vLower)
        })
      ) {
        chartData.unshift({
          tick: vLower,
          price: tick2Price(vLower, token),
          amount: 0,
        })
      }
      // chartData is sorted - and we can be happy with knowing that
      chartData.sort((a, b) => {
        const nameA = a.tick
        const nameB = b.tick
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        // names must be equal
        return 0
      })
      const attrs: IChartAttributes<ITick> = {
        before(t) {
          if (t) {
            return t.reverse()
          }
          return t
        },
        x(tick) {
          const price = tick2Price(tick.tick, token)
          return price
        },
        y(tick) {
          return -tick.amount
        },
        width(tick) {
          return tick2Price(tick.tick + liqData.tickSpacing, token) - tick2Price(tick.tick, token)
        },
        height(tick) {
          return tick.amount
        },
      }
      const newChart = new ChartRenderer(attrs, chartData, clientWidth - yAxisWidth, clientHeight - xAxisHeight - 55)
      //window.log.log(newChart, bounds, currentTick)
      setChart(newChart)
    }
  }, [bounds, liqData, clientWidth, clientHeight, token])
  return (
    <div ref={ref} className="flex flex-1 w-full">
      {loadingChart ? (
        <ChartLoadingState />
      ) : (
        chart &&
        chart.data &&
        chart.data.length > 0 &&
        bounds &&
        liqData &&
        currentTick !== undefined && (
          <LiquidityContainer
            height={clientHeight - 20}
            width={clientWidth}
            bounds={bounds}
            chart={chart}
            currentTick={currentTick}
            hoveredTick={hoveredTick}
            setHoveredTick={setHoveredTick}
            setBounds={setBounds}
            tickSpacing={liqData.tickSpacing}
          />
        )
      )}
    </div>
  )
}

export default LiquidityChart
