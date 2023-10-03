import { useChainLoader } from '../../../../route/RouteWrapper'
import GasInfoTag from '../../../tags/GasInfoTag'
import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { IToken } from '../../../../lib/getToken'
import { FontWeightEnums } from '../../../../types/Enums'
import { getTokenSymbol } from '../../../../util/getTokenName'
import PriceLoader from './PriceLoader'
import { FormatNumber } from '../../../numbers/FormatNumber'
import { useSwapPageContext } from '../../../../context/SwapPageContext'

interface IPriceInfo {
  perspectiveFlip: boolean
  token0: IToken | undefined
  token1: IToken | undefined
  price: string
  priceImpact: string
  loading?: boolean
  showGas?: boolean
  isSwapPage?: boolean
}

export const PriceInfo = (props: IPriceInfo) => {
  const { currentChainInfo } = useChainLoader()
  const {
    perspectiveFlip,
    token0,
    token1,
    price,
    priceImpact,
    loading = false,
    showGas = false,
    isSwapPage = false,
  } = props
  const perspectiveFlipOnSwap = isSwapPage ? true : perspectiveFlip
  return (
    <div
      className="w-full border-[1px] rounded-[10px] p-3 mt-2 flex flex-col gap-y-1 justify-between"
      style={{ borderColor: colors.gray[700] }}
    >
      <div className="flex justify-between flex-row pb-2">
        <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
          Engine:
        </T3>
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          Oku.Trade Swap Router
        </T3>
      </div>
      <div className="flex justify-between flex-row ">
        <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
          Price:
        </T3>
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          {loading ? (
            <>
              <PriceLoader />{' '}
            </>
          ) : (
            <div className="flex flex-row">
              {loading ? '  ' : price}{' '}
              {token0 &&
                token1 &&
                (perspectiveFlipOnSwap
                  ? getTokenSymbol(token1.address, token1.symbol, currentChainInfo.id)!
                  : getTokenSymbol(token0.address, token0.symbol, currentChainInfo.id)!)}{' '}
              per{' '}
              {token0 &&
                token1 &&
                (perspectiveFlipOnSwap
                  ? getTokenSymbol(token0.address, token0.symbol, currentChainInfo.id)!
                  : getTokenSymbol(token1.address, token1.symbol, currentChainInfo.id)!)}
            </div>
          )}
        </T3>
      </div>
      <div className="flex justify-between">
        <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
          Price Impact:
        </T3>
        {loading ? (
          <PriceLoader />
        ) : (
          <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            {priceImpact === '' ? 'Loading' : priceImpact}%
          </T3>
        )}
      </div>
      {showGas ? (
        <div className="flex justify-between">
          <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
            Gas:
          </T3>
          <GasInfoTag fontSize={12} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default PriceInfo
