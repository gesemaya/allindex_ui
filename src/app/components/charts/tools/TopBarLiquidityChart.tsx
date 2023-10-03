import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import useMobile from '../../../hooks/useMobile'
import { getTokenSymbol } from '../../../util/getTokenName'
import { useDataContext } from '../../../context/DataContext'
import TokenSwitch from '../../switch/TokenSwitch'

interface ITopBarLiquidityChart {
  height: number
  width: number
}

const TopBarLiquidityChart = (props: ITopBarLiquidityChart) => {
  const { height } = props
  const { poolSummary, token, setToken } = useDataContext()
  const { isMobile } = useMobile()
  const { currentChain } = useChainLoader()
  const price = poolSummary.t0_price

  return (
    <div
      className="flex h-fit gap-6"
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'start' : 'center',
        height: height,
        width: '100%',
      }}
    >
      <TokenSwitch
        token={token}
        token0Address={poolSummary.t0}
        token0Symbol={poolSummary.t0_symbol}
        token1Address={poolSummary.t1}
        token1Symbol={poolSummary.t1_symbol}
        setTokenSelected={setToken}
      />
      {!isMobile && (
        <div className="flex flex-row gap-2">
          <T3 color={colors.gray[400]}>Current Price: </T3>
          <T3 color={colors.gray[400]}>
            {token.selected === 1 ? (
              <FormatNumber num={price} singleLetterNotation={true} />
            ) : (
              <FormatNumber num={1 / price} singleLetterNotation={true} />
            )}{' '}
            {token.selected === 1
              ? getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChain)
              : getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChain)}{' '}
            per{' '}
            {token.selected === 1
              ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChain)
              : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChain)}
          </T3>
        </div>
      )}
    </div>
  )
}

export default TopBarLiquidityChart
