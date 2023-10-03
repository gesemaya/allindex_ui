import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums } from '../../../types/Enums'
import { useDataContext } from '../../../context/DataContext'
import { Trans } from '@lingui/macro'

interface ITradeHistoryTitles {
  baseSymbol: string
  quoteSymbol: string
}

const TradeHistoryTitles = (props: ITradeHistoryTitles) => {
  const { baseSymbol, quoteSymbol } = props
  // window.log.log(baseSymbol, quoteSymbol)
  const { token } = useDataContext()
  return (
    token && (
      <div className="flex flex-row w-full px-2 text-gray-300 pt-3 pb-2">
        <div className="flex flex-1">
          <T3 className="flex" weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>Price</Trans> ({token.selected === 0 ? baseSymbol : quoteSymbol})
          </T3>
        </div>
        <div className="flex flex-1 justify-end">
          <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>Size</Trans> ({token.selected === 0 ? baseSymbol : quoteSymbol})
          </T3>
        </div>
        <div className="flex flex-1 justify-end">
          <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>Time</Trans>
          </T3>
        </div>
      </div>
    )
  )
}

export default TradeHistoryTitles
