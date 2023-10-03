import { useChainLoader } from '../../../route/RouteWrapper'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getTokenSymbol } from '../../../util/getTokenName'
import { useDataContext } from '../../../context/DataContext'
import { modalHeight } from './constants'

// noinspection JSDeprecatedSymbols
interface IOrderBookHover {
  offsetTop: number
  offsetLeft: number
  data: {
    t0Sum: JSX.Element
    t1Sum: JSX.Element
    avgPrice: JSX.Element
  }
}

const OrderBookHover = (props: IOrderBookHover) => {
  const { offsetTop, offsetLeft, data } = props
  const { poolSummary } = useDataContext()
  const { currentChainInfo } = useChainLoader()

  return (
    <div
      className="fixed  border-[1px] flex flex-col gap-2 p-3  rounded-[16px] w-[187px]"
      style={{
        height: modalHeight,
        marginLeft: offsetLeft,
        marginTop: offsetTop,
        borderColor: colors.gray[800],
        backgroundColor: colors.gray.dark,
      }}
    >
      <div className="flex flex-row justify-between">
        <T3>Avg Price:</T3>
        <T3>{data.avgPrice}</T3>
      </div>
      <div className="flex flex-row justify-between">
        <T3>Sum {getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)}:</T3>
        <T3>{data.t1Sum}</T3>
      </div>
      <div className="flex flex-row justify-between">
        <T3>Sum {getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)}:</T3>
        <T3>{data.t0Sum}</T3>
      </div>
    </div>
  )
}

export default OrderBookHover
