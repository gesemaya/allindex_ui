import { T1 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { ErrorIcon, OrderBannerEnums } from '../banners/OrderBanners'
import { getHoverColor } from '../charts/utils/getHoverColor'
import TransactionLoader from '../forms/OrderForms/Swap/TransactionLoader'
import InvalidLimitOrderPool from '../tooltip/InvalidLimitOrderPool'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import ImpossibleQuoteToolTip from '../tooltip/ImpossibleQuote'

interface IOrderButton {
  orderAction: string
  onClick: () => void
  disabled?: boolean
  insufficientFunds?: boolean
  isTransactionPending?: boolean
  isApprovalPending?: boolean
  needsSignature?: boolean
  isValidPool?: boolean
  loadingPrice?: boolean
  isEmpty?: boolean
  orderFormState: OrderBannerEnums | undefined
}

function OrderButton(props: IOrderButton) {
  const {
    orderAction,
    onClick,
    disabled = false,
    insufficientFunds = false,
    isValidPool = true,
    loadingPrice = false,
    // isTransactionPending = false,
    // isApprovalPending = false,
    // needsSignature = false,
    isEmpty,
    orderFormState,
  } = props
  const { isConnected } = useAccount()
  const [hover, setHover] = useState(false)

  const needsSignature =
    orderFormState === OrderBannerEnums.SIGNATURE ||
    orderFormState === OrderBannerEnums.SIGNATURE_IN_PROGRESS ||
    orderFormState === OrderBannerEnums.SIGNED
  const isApproved = orderFormState === OrderBannerEnums.TOKEN_APPROVAL
  const isApprovalPending = orderFormState === OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS
  const isConfirmPending =
    orderFormState === OrderBannerEnums.EXECUTE_TRADE || orderFormState === OrderBannerEnums.TOKEN_APPROVED
  const isTransactionPending = orderFormState === OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS
  const isQuoteError = orderFormState === OrderBannerEnums.QUOTE_ERROR
  const shouldDisable = () => {
    return disabled || orderFormState !== undefined
  } //isTransactionPending || isApprovalPending }
  const shouldDeactivate = () => {
    return !isConnected || insufficientFunds || disabled || orderFormState !== undefined //isTransactionPending || isApprovalPending || needsSignature
  }
  return (
    <button
      disabled={shouldDisable() || shouldDeactivate()}
      onClick={() => {
        if (!(shouldDisable() || shouldDeactivate())) {
          onClick()
        }
      }}
      style={{
        color: shouldDeactivate() ? colors.gray[600] : hover ? getHoverColor(colors.white) : colors.white,
        backgroundColor: shouldDeactivate() ? '#1B1F2D' : hover ? getHoverColor('#0050FF') : colors.blue[400],
      }}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
      className="flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold "
    >
      {loadingPrice ? (
        <>
          <TransactionLoader />
        </>
      ) : isQuoteError ? (
        <ImpossibleQuote />
      ) : (
        <>
          {!isValidPool && <InvalidLimitOrderPool />}
          <div>
            {isConnected ? (
              isEmpty ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
                  {orderAction}
                </T1>
              ) : insufficientFunds ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {' '}
                  Insufficient balance{' '}
                </T1>
              ) : isTransactionPending ? (
                <div className="flex flex-row items-center gap-1">
                  <TransactionLoader />
                  <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                    {' '}
                    Transaction in progress{' '}
                  </T1>
                </div>
              ) : needsSignature ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {' '}
                  Sign order{' '}
                </T1>
              ) : isApproved ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {' '}
                  Approve token in wallet{' '}
                </T1>
              ) : isConfirmPending ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {' '}
                  Confirm trade in wallet{' '}
                </T1>
              ) : isApprovalPending ? (
                <div className="flex flex-row items-center gap-1">
                  <TransactionLoader />
                  <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                    {' '}
                    Approval In Progress{' '}
                  </T1>
                </div>
              ) : (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
                  {orderAction}
                </T1>
              )
            ) : (
              <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                {' '}
                Connect Wallet{' '}
              </T1>
            )}
          </div>
        </>
      )}
    </button>
  )
}

export default OrderButton

const ImpossibleQuote = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div
      className="flex gap-x-2 items-center relative"
      style={{
        color: colors.gray[600],
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <ErrorIcon color={colors.gray[600]} />
      <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
        Impossible to Quote
      </T1>
      {showTooltip && <ImpossibleQuoteToolTip />}
    </div>
  )
}
