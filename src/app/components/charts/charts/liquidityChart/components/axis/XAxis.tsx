import { colors } from '../../../../../../constants/colors'
import { formatNumberToString } from '../../../../../../util/formatNumbers'
import { PoolTokenInfo } from '../../../../../../context/DataContext'
import { barWidthfactor } from '../../constants'
import { ChartRenderer } from '../../draw'
import { IBounds, ITick } from '../../type'
import { getDecimals } from '../../util'

interface IXAxis {
  chart: ChartRenderer<ITick>
  height: number
  width: number
  bounds?: IBounds
  token?: PoolTokenInfo
  showAxis?: boolean
  tickSpacing?: number
}

function XAxis(props: IXAxis) {
  const { chart, width, height } = props
  const textSpacing = getDecimals(chart.inv_x(width)) > 5 ? 150 : 140
  const totalTicks = width / textSpacing
  const barWidth = (width / totalTicks) * barWidthfactor
  const xArray = Array.from({ length: totalTicks + 4 }, (_, i) => i * barWidth)

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} y={0} x={0} fill={'#333333'} />
        {xArray.map((p, index) => {
          const px = chart.inv_x(p)
          return (
            <g key={index}>
              <text style={{ userSelect: 'none' }} fontSize={11} fill={colors.gray[300]} x={p - barWidth / 4} y={15}>
                {formatNumberToString(px)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default XAxis
