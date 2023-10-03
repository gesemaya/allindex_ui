import TopBarLiquidityChart from '../../../../tools/TopBarLiquidityChart'
import { topBarheight } from '../../constants'
import { ChartRenderer } from '../../draw'
import { IBounds, ITick } from '../../type'
import LiquidityChartContainer from './LiquidityChartContainer'
import { useLocation } from 'react-router-dom'

interface ILiquidityContainer {
  height: number
  width: number
  bounds: IBounds
  setBounds: (value?: IBounds) => void
  chart: ChartRenderer<ITick>
  hoveredTick: ITick | undefined
  setHoveredTick: (value: ITick | undefined) => void
  currentTick: number
  tickSpacing: number
}

function LiquidityContainer(props: ILiquidityContainer) {
  const { height, width, bounds, setBounds, chart, hoveredTick, setHoveredTick, currentTick, tickSpacing } = props
  const chartContainerHeight = height - topBarheight
  const location = useLocation()

  return (
    <div>
      {!location.pathname.includes('chart') && !location.pathname.includes('pool') && (
        <TopBarLiquidityChart height={topBarheight} width={width} />
      )}
      <LiquidityChartContainer
        chart={chart}
        bounds={bounds}
        setBounds={setBounds}
        currentTick={currentTick}
        height={chartContainerHeight}
        width={width}
        hoveredTick={hoveredTick}
        setHoveredTick={setHoveredTick}
        tickSpacing={tickSpacing}
      />
    </div>
  )
}

export default LiquidityContainer
