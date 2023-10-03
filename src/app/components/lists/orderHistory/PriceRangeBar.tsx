import { colors } from '../../../constants/colors'

interface IPriceRangeBar {
  currentPrice: number
  rangeLower: number
  rangeUpper: number
  isClosed: boolean
}

function PriceRangeBar(props: IPriceRangeBar) {
  const { currentPrice, rangeLower, rangeUpper, isClosed } = props

  const priceMultiplier = 5
  const width = 98
  const height = 8
  const radius = 1

  const [lower, upper] = rangeLower < rangeUpper ? [rangeLower, rangeUpper] : [rangeUpper, rangeLower]

  let maxValue = priceMultiplier * currentPrice
  let rangeStart = (lower / maxValue) * width
  let rangeWidth = ((upper - lower) / maxValue) * width + 5
  let currentPriceLocation = (currentPrice / maxValue) * width

  return (
    <div className="flex items-center h-4 overflowX" style={{ width: width }}>
      <div
        className="absolute"
        style={{
          height: height,
          width: width,
          backgroundColor: colors.blue[800],
          borderRadius: radius,
          borderColor: colors.blue[600],
          borderWidth: '0.5px',
          borderStyle: 'solid',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            height: height - 2,
            width: rangeWidth,
            marginLeft: rangeStart,
            backgroundColor: isClosed ? colors.gray[700] : colors.blue[500],
          }}
        ></div>
      </div>
      <div className="absolute h-3 w-[1.1px] bg-[#F5F6FC]" style={{ marginLeft: currentPriceLocation }} />
    </div>
  )
}

export default PriceRangeBar
