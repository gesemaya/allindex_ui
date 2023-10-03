import ChartLoadingState from '../../../../../loadingStates/ChartLoadingState'
import { xAxisHeight, yAxisWidth } from '../../constants'
import { ChartRenderer } from '../../draw'
import { IBounds, ITick } from '../../type'
import XAxis from '../axis/XAxis'
import YAxis from '../axis/YAxis'
import BarChart from '../chart/BarChart'
import ChartController from '../chartController/ChartController'
import HighlightOverlay from '../tools/overlay/HighlightOverlay'

interface IChartContainer {
  chart: ChartRenderer<ITick>
  height: number
  width: number
  hoveredTick: ITick | undefined
  currentTick: number
}

const ChartContainer = (props: IChartContainer) => {
  const { chart, height, width, hoveredTick, currentTick } = props
  const chartHeight = height - xAxisHeight
  return (
    <div className="absolute" style={{ height: height, width: width }}>
      {chart && !isNaN(chart.stretch_x) ? (
        <div className="flex flex-1 flex-col absolute">
          <div style={{ width: width, height: chartHeight }}>
            <BarChart
              chart={chart}
              height={chartHeight}
              width={width}
              hoveredTick={hoveredTick}
              currentTick={currentTick}
            />
            <YAxis height={chartHeight} width={yAxisWidth} data={chart.data} showAxis={true} />
          </div>
          <XAxis chart={chart} height={xAxisHeight} width={width - yAxisWidth} />
        </div>
      ) : (
        <ChartLoadingState />
      )}
    </div>
  )
}

interface ILiquidityChartContainer {
  height: number
  width: number
  bounds: IBounds
  chart: ChartRenderer<ITick>
  setBounds: (value?: IBounds) => void
  hoveredTick: ITick | undefined
  setHoveredTick: (value: ITick | undefined) => void
  currentTick: number
  tickSpacing: number
}

function LiquidityChartContainer(props: ILiquidityChartContainer) {
  const { height, width, bounds, setBounds, chart, hoveredTick, setHoveredTick, currentTick, tickSpacing } = props

  return (
    <div className="relative ">
      <ChartContainer chart={chart} height={height} width={width} hoveredTick={hoveredTick} currentTick={currentTick} />
      {bounds && (
        <HighlightOverlay chart={chart} height={height - 4} width={width} bounds={bounds} hoveredTick={hoveredTick} />
      )}
      {bounds && (
        <ChartController
          chart={chart}
          height={height}
          width={width}
          setHoveredTick={setHoveredTick}
          bounds={bounds}
          setBounds={setBounds}
          currentTick={currentTick}
          tickSpacing={tickSpacing}
        />
      )}
    </div>
  )
}

export default LiquidityChartContainer
