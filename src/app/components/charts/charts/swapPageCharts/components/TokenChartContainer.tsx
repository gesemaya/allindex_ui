import { useChainLoader } from '../../../../../route/RouteWrapper'
import { T1 } from '../../../../typography/Typography'
import { colors } from '../../../../../constants/colors'
import { SwapChartEnums, tokenChartTimeIncrementEnums } from '../../../../../types/Enums'
import { SwapCandle } from '@gfxlabs/oku'
import { fetchSwapChart } from '../../../../../data/swapChart'
import { timePeriodOptions } from '../../../constants/candleStickConstants'
import ChartError from '../../../tools/ChartError'
import ChartLoader from '../../../tools/ChartLoader'
import { IBounds } from '../../liquidityChart/type'
import { ITokenChartContainer, IXAxisData, IYAxisData } from '../types'
import { getDataFromBounds } from '../util'
import Controller from './Controller'
import SwitchChart from './SwitchChart'
import XAxis from './XAxis'
import YAxis from './YAxis'
import { useEffect, useState } from 'react'
import { getXAxisDataArray, getYAxisDataArray, getYBoundsSwitch } from '../../../../../util/charting'
import { ZERO_ADDRESS } from '../../../../../constants/addresses'

const initialCandleBarWidth = 10

const TokenChartContainer = (props: ITokenChartContainer) => {
  const { chart, timeIncrement, width, height, token, bounds, setBounds, loading, setLoading } = props
  const chartContainerWidth = width
  const chartContainerHeight = height
  const xAxisHeight = 30
  const yAxisWidth = 70
  const xAxisWidth = chartContainerWidth - yAxisWidth
  const yAxisHeight = chartContainerHeight - xAxisHeight
  const minXAxisTickWidth = 70
  const minYAxisTickHeight = 20
  const minTimeIncrement = timePeriodOptions[0]
  const [yBounds, setYBounds] = useState<IBounds | undefined>(undefined)
  const [totalData, setTotalData] = useState<SwapCandle[] | undefined>(undefined)
  const [viewData, setViewData] = useState<SwapCandle[] | undefined>(undefined)
  const [xAxisData, setXAxisData] = useState<IXAxisData[]>([])
  const [yAxisData, setYAxisData] = useState<IYAxisData[]>([])
  const [yRatio, setYRatio] = useState(0.1)
  const { cushRpc } = useChainLoader()
  const [error, setError] = useState(false)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    setError(false)
    if (token.address === ZERO_ADDRESS) return
    setLoading(true)
    fetchSwapChart(cushRpc, {
      tokenAddresses: [token.address],
      granularity: timeSwitch(timeIncrement),
      startTime: Date.now() - timeSwitch(timeIncrement) * 500,
      endTime: Date.now(),
    })
      .then((res) => {
        const totalData = res.token_candles[token.address.toLowerCase()]
        setTotalData(totalData)
        if (totalData.length > 1) {
          setLoading(false)
        }
        if (res.token_candles[token.address.toLowerCase()] === null) {
          setNoData(true)
        } else {
          setError(false)
        }
      })
      .catch((err) => {
        setError(true)
        window.log.log(err)
      })
  }, [token, cushRpc, timeIncrement])

  // window.log.log(totalData)

  useEffect(() => {
    if (totalData !== undefined) {
      const barWidth = initialCandleBarWidth
      const tick = timeSwitch(timeIncrement)
      const upperTime = new Date().valueOf()
      setBounds({ lower: upperTime! - (tick * xAxisWidth) / barWidth, upper: upperTime! })
    }
  }, [totalData, chart, xAxisWidth])

  useEffect(() => {
    if (totalData && totalData.length > 0) {
      if (bounds === undefined) {
        // setViewData() //initial view
      } else {
        const viewData = getDataFromBounds(totalData, bounds.lower, bounds.upper, timeSwitch(timeIncrement))
        if (viewData.length > 1) {
          setViewData(viewData)
        }
      }
    }
  }, [bounds])

  useEffect(() => {
    if (viewData) {
      const newYBounds = getYBoundsSwitch(chart, viewData, yRatio)
      // window.log.log(bounds, chart)
      setYBounds(newYBounds)
      setYAxisData(getYAxisDataArray(newYBounds, yAxisHeight, minYAxisTickHeight))
    }
  }, [chart, viewData, yRatio])

  useEffect(() => {
    if (bounds) {
      // window.log.log((timeSwitch(timeIncrement)/(bounds.upper-bounds.lower))*width)
      // const x =getXAxisDataArray(bounds, xAxisWidth, minXAxisTickWidth, minTimeIncrement, timeSwitch(timeIncrement))
      setXAxisData(
        getXAxisDataArray(bounds, xAxisWidth, minXAxisTickWidth, minTimeIncrement, timeSwitch(timeIncrement))
      )
    }
  }, [bounds])

  return (
    <div className="flex items-center justify-center flex-1 ">
      {noData ? (
        <T1 color={colors.gray[300]}>No Data Available </T1>
      ) : error ? (
        <ChartError />
      ) : bounds && yBounds && viewData && !loading ? (
        <div className="flex flex-1 text-white flex-row">
          <div className="flex flex-col  ">
            {SwitchChart(
              chart,
              chartContainerHeight - xAxisHeight,
              chartContainerWidth - yAxisWidth,
              bounds,
              setBounds,
              yBounds,
              viewData
            )}
            <XAxis width={xAxisWidth} height={xAxisHeight} data={xAxisData} />
            <Controller
              width={xAxisWidth}
              height={chartContainerHeight}
              bounds={bounds}
              incrementSize={timeSwitch(timeIncrement)}
              setBounds={setBounds}
              // upperMax={viewData[viewData.length-1].time}
            />
          </div>
          <YAxis
            width={yAxisWidth}
            height={yAxisHeight}
            data={yAxisData}
            yBounds={yBounds}
            setYBounds={setYBounds}
            yRatio={yRatio}
            setYRatio={setYRatio}
            canZoom={chart !== SwapChartEnums.VOLUME}
          />
        </div>
      ) : (
        <ChartLoader />
      )}
    </div>
  )
}

export default TokenChartContainer

const timeSwitch = (timeIncrement: tokenChartTimeIncrementEnums) => {
  switch (timeIncrement) {
    case tokenChartTimeIncrementEnums.DAY_1:
      return 60000 * 60 * 24
    case tokenChartTimeIncrementEnums.DAY_7:
      return 60000 * 60 * 24 * 7
    case tokenChartTimeIncrementEnums.DAY_14:
      return 60000 * 60 * 24 * 14
    case tokenChartTimeIncrementEnums.DAY_30:
      return 60000 * 60 * 24 * 30
    case tokenChartTimeIncrementEnums.YEAR_1:
      return 60000 * 60 * 24 * 365
    default:
      return 60000
  }
}
