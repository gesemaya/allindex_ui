import { useChainLoader } from '../../route/RouteWrapper'
import { T1, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { getTokenSymbol } from '../../util/getTokenName'
import { OrderBannerEnums } from '../banners/OrderBanners'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { IMinToken } from '../forms/OrderForms/LimitOrderForm'
import TransactionLoader from '../forms/OrderForms/Swap/TransactionLoader'
import InvalidLimitOrderPool from '../tooltip/InvalidLimitOrderPool'
import { useState } from 'react'
import { useAccount } from 'wagmi'

interface ILimitOrderButton {
  orderAction: string
  onClick: () => void
  isValidPool?: boolean
  minToken?: IMinToken
  order: { token0: string; token1: string }
  isTransactionPending: boolean
  isApprovalPending: boolean
  isPreferredTokenOrder: boolean
  priceEntered: boolean
  balance0?: number
  balance1?: number
  orderFormState?: OrderBannerEnums
  isEmpty: boolean
}

function LimitOrderButton(props: ILimitOrderButton) {
  const {
    orderAction,
    onClick,
    isValidPool = true,
    minToken = undefined,
    // isTransactionPending = false,
    // isApprovalPending = true,
    order,
    isPreferredTokenOrder,
    priceEntered,
    balance0,
    balance1,
    orderFormState,
    isEmpty,
  } = props

  const { isConnected } = useAccount()
  const { currentChain } = useChainLoader()
  const [hover, setHover] = useState(false)

  const isDefault = order.token0 === '' || order.token1 === ''
  const isMinTokenValid =
    !isDefault &&
    minToken !== undefined &&
    (!isPreferredTokenOrder ? Number(order.token0) >= minToken.amount : Number(order.token1) >= minToken.amount)
  const isSufficientFunds =
    balance0 !== undefined &&
    balance1 !== undefined &&
    isMinTokenValid &&
    (!isPreferredTokenOrder ? Number(order.token0) <= balance0 : Number(order.token1) <= balance1)

  let disabled

  if (isConnected) {
    disabled =
      !isValidPool ||
      orderFormState !== undefined ||
      isDefault ||
      !isMinTokenValid ||
      !(priceEntered && isSufficientFunds)
  } else {
    disabled = true
  }

  const isApproved = orderFormState === OrderBannerEnums.TOKEN_APPROVAL
  const isApprovalPending = orderFormState === OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS
  const isConfirmPending =
    orderFormState === OrderBannerEnums.EXECUTE_TRADE || orderFormState === OrderBannerEnums.TOKEN_APPROVED
  const isTransactionPending = orderFormState === OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        color: disabled ? colors.gray[600] : hover ? getHoverColor(colors.white) : colors.white,
        backgroundColor: disabled ? '#1B1F2D' : hover ? getHoverColor('#0050FF') : '#0050FF',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold"
    >
      {isConnected && !isValidPool && <InvalidLimitOrderPool />}
      <div>
        {isConnected ? (
          isValidPool ? (
            isEmpty ? (
              orderAction === 'Buy' ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
                  {' '}
                  Buy{' '}
                </T1>
              ) : (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
                  {' '}
                  Sell{' '}
                </T1>
              )
            ) : isMinTokenValid ? (
              !isSufficientFunds ? (
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
              ) : orderAction === 'Buy' ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
                  {' '}
                  Buy{' '}
                </T1>
              ) : (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
                  {' '}
                  Sell{' '}
                </T1>
              )
            ) : (
              <div className="flex flex-row gap-1.5">
                <T3 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {' '}
                  Minimum order size is {minToken?.amount}{' '}
                </T3>
                <img src={minToken?.token.logoURI} width={12} height={12} alt={''} />
                <T3 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {getTokenSymbol(minToken?.token.address!, minToken?.token.symbol, currentChain)}{' '}
                </T3>
              </div>
            )
          ) : (
            // isTransactionPending ? (
            //   <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //     {' '}
            //     Transaction Pending{' '}
            //   </T1>
            // ) : isApprovalPending ? (
            //   <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //     {' '}
            //     Approve Token{' '}
            //   </T1>
            // ) : isDefault ? (
            //   <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //     {' '}
            //     {orderAction}{' '}
            //   </T1>
            // ) : isMinTokenValid ? (
            //   isSufficientFunds ? (
            //     <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //       {' '}
            //       {orderAction}{' '}
            //     </T1>
            //   ) : (
            //     <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //       {' '}
            //       Insufficient Funds{' '}
            //     </T1>
            //   )
            // ) : (
            //   <div className="flex flex-row gap-1.5">
            //     <T3 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //       {' '}
            //       Minimum order size is {minToken?.amount}{' '}
            //     </T3>
            //     <img src={minToken?.token.logoURI} width={12} height={12} alt={''} />
            //     <T3 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            //       {minToken?.token.symbol}`{' '}
            //     </T3>
            //   </div>
            // )
            <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
              {' '}
              Limit orders not setup for this market{' '}
            </T1>
          )
        ) : (
          <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            {' '}
            Connect Wallet{' '}
          </T1>
        )}
      </div>
    </button>
  )
}

export default LimitOrderButton
