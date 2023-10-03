import { colors } from '../../../../../../../constants/colors'
import { PoolTokenInfo, useDataContext } from '../../../../../../../context/DataContext'
import { useChartDataContext } from '../../../../../context/ChartDataContext'
import { xAxisHeight } from '../../../constants'
import { ChartRenderer } from '../../../draw'
import { IBounds, ITick } from '../../../type'
import ToolTip from '../ToolTip'
import React from 'react'

interface IHighlightOverlay {
  chart: ChartRenderer<ITick>
  width: number
  height: number
  bounds: IBounds
  hoveredTick: ITick | undefined
}

function HighlightOverlay(props: IHighlightOverlay) {
  const { token, poolSummary } = useDataContext()
  let { chart, hoveredTick } = props
  const { highlightBounds } = useChartDataContext()

  return (
    <div className="absolute " style={{ height: chart.height + 8, width: chart.width }}>
      <svg width={'100%'} height={'100%'} className="absolute">
        {
          // <MidLine height={chart.height} />
        }
        <RenderBounds chart={chart} highlightBounds={highlightBounds} token={token} />
        {hoveredTick && hoveredTick.amount > 0 && (
          <ToolTip
            chart={chart}
            hoveredTick={hoveredTick}
            clientHeight={chart.height - xAxisHeight}
            clientWidth={chart.width}
            token={token}
            poolSummary={poolSummary}
          />
        )}
      </svg>
    </div>
  )
}

export default HighlightOverlay

const RenderBounds = (props: {
  chart: ChartRenderer<ITick>
  highlightBounds: IBounds | undefined
  token: PoolTokenInfo
}) => {
  let { chart, highlightBounds, token } = props

  if (!chart) {
    return <></>
  }
  if (!highlightBounds || !highlightBounds.upper || !highlightBounds.lower) {
    return <></>
  }
  let bounds = [
    {
      tick: highlightBounds.upper,
      amount: 0,
    },
    {
      tick: highlightBounds.lower,
      amount: 0,
    },
  ]
  if (token.selected === 0) {
    bounds[0].tick = highlightBounds.lower
    bounds[1].tick = highlightBounds.upper
  }
  let pair = chart.transform(bounds)
  if (pair.length !== 2) {
    return <></>
  }
  if (pair[0] === undefined || pair[1] === undefined) {
    return <></>
  }

  return (
    <>
      <rect
        x={pair[0].x}
        y={0}
        width={Math.abs(pair[1].x - pair[0].x)}
        height={chart.height}
        fill={'#3E607E36'}
        strokeWidth={4}
      />
      <rect
        x={pair[0].x - 12 / 2}
        y={chart.height - 6}
        width={12}
        height={12}
        stroke={colors.blue[500]}
        strokeWidth={2}
        fill={'#00000000'}
        rx={10}
      />
      <rect
        x={pair[0].x - 12 / 2 + Math.abs(pair[1].x - pair[0].x)}
        y={chart.height - 12 / 2}
        width={12}
        height={12}
        stroke={colors.blue[500]}
        strokeWidth={2}
        fill={'#00000000'}
        rx={10}
      />
    </>
  )
}
