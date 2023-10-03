import { colors } from '../../../../../../constants/colors'
import { formatNumberToString } from '../../../../../../util/formatNumbers'
import { yFactor } from '../../constants'
import { ITick } from '../../type'
import { getYAxisData } from '../../util'

interface IYAxis {
  height: number
  width: number
  data: ITick[]
  showAxis?: boolean
}

function YAxis(props: IYAxis) {
  const { height, width, data, showAxis = true } = props
  const maxValue = data.reduce((max, tick) => (max > tick.amount ? max : tick.amount), 0)
  const topValue = yFactor * maxValue
  const fontSize = 10
  const yAxisValues = getYAxisData(topValue, height)

  return (
    <div
      className=" absolute"
      style={{
        height: height,
        width: width,
        right: 0,
      }}
    >
      <svg width={width} height={height}>
        {showAxis &&
          yAxisValues.map((value, index) => {
            const y = (1 - value / maxValue) * height
            return (
              <text key={index} style={{ userSelect: 'none' }} fontSize={fontSize} fill={colors.gray[300]} x={10} y={y}>
                {y > fontSize ? formatNumberToString(value) : ''}
              </text>
            )
          })}
      </svg>
    </div>
  )
}

export default YAxis
