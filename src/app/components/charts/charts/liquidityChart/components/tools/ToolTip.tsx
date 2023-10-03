import { useChainLoader } from '../../../../../../route/RouteWrapper'
import { colors } from '../../../../../../constants/colors'
import { tick2Price } from '../../../../../../lib/liquidity'
import { formatNumberToString } from '../../../../../../util/formatNumbers'
import { getTokenSymbol } from '../../../../../../util/getTokenName'
import { PoolTokenInfo } from '../../../../../../context/DataContext'
import { PoolSummary } from '@gfxlabs/oku'
import { hoverHeight, hoverWidth } from '../../constants'
import { ChartRenderer } from '../../draw'
import { ITick } from '../../type'

interface IToolTip {
  chart: ChartRenderer<ITick>
  hoveredTick: ITick
  clientHeight: number
  clientWidth: number
  token: PoolTokenInfo
  poolSummary: PoolSummary
}

function ToolTip(props: IToolTip) {
  const { chart, token, poolSummary } = props

  const { currentChain } = useChainLoader()
  const hoveredTick = chart.transform([props.hoveredTick])[0]

  let baseX = 0
  let baseY = 0

  return hoveredTick ? (
    <g>
      <rect width={hoverWidth} height={hoverHeight} fill={'#0B0B0E96'} x={baseX} y={baseY} rx={16} ry={16} />
      <text style={{ userSelect: 'none' }} fontSize={12} fill={colors.gray[500]} x={baseX + 12} y={baseY + 24}>
        {' '}
        Tick {hoveredTick.data.tick}
      </text>
      <text style={{ userSelect: 'none' }} fill="white" fontSize={12} x={baseX + 12} y={baseY + 44}>
        {token.selected === 1
          ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChain)
          : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChain)}{' '}
        Price:
      </text>
      <text style={{ userSelect: 'none' }} fill="white" fontSize={12} x={baseX + 12} y={baseY + 70}>
        {token.selected === 1
          ? getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChain)
          : getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChain)}{' '}
        Price:
      </text>
      <text style={{ userSelect: 'none' }} fill="white" fontSize={12} x={baseX + 12} y={baseY + 96}>
        {' '}
        {token.selected === 1
          ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChain)
          : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChain)}{' '}
        Liquidity Value:
      </text>
      <text style={{ userSelect: 'none' }} fill="white" fontSize={12} x={baseX + 160} y={baseY + 44}>
        {formatNumberToString(tick2Price(hoveredTick.data.tick, token))}
      </text>
      <text style={{ userSelect: 'none' }} fill="white" fontSize={12} x={baseX + 160} y={baseY + 70}>
        {formatNumberToString(1 / tick2Price(hoveredTick.data.tick, token))}
      </text>
      <text style={{ userSelect: 'none' }} fill="white" fontSize={12} x={baseX + 160} y={baseY + 96}>
        {formatNumberToString(hoveredTick.data.amount)}
      </text>
    </g>
  ) : (
    <></>
  )
}

export default ToolTip
