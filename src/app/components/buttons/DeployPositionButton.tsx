import { T1 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import { FontWeightEnums } from '../../types/Enums'
import { getTokenSymbol } from '../../util/getTokenName'
import { shortenTokenSymbol } from '../../util/shortenTokenSymbol'
import { usePositionMakerContext } from '../../context/PositionMakerContext'
import { getHoverColor } from '../charts/utils/getHoverColor'
import TransactionLoader from '../forms/OrderForms/Swap/TransactionLoader'
import { useState } from 'react'
import { useAccount } from 'wagmi'

interface IButton {
  onClick: () => void
  disabled: boolean
  isInsufficientT0: boolean
  isInsufficientT1: boolean
  isTransactionPending: boolean
  token0: IToken
  token1: IToken
}

function DeployPositionButton(props: IButton) {
  const { onClick, disabled, isInsufficientT0, isInsufficientT1, isTransactionPending, token0, token1 } = props
  const { editPosition, updatePosition } = usePositionMakerContext()
  const { isConnected } = useAccount()
  const [hover, setHover] = useState(false)

  const shouldDisable = () => {
    return disabled
  }

  const shouldDeactivate = () => {
    return !isConnected || disabled || isInsufficientT0 || isInsufficientT1 || isTransactionPending
  }

  return (
    <button
      disabled={shouldDisable() || shouldDeactivate()}
      onClick={onClick}
      style={{
        color: shouldDeactivate() ? colors.gray[500] : hover ? getHoverColor(colors.white) : colors.white,
        backgroundColor: shouldDeactivate() ? '#1B1F2D' : hover ? getHoverColor('#0050FF') : colors.blue[400],
      }}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
      className="w-full h-[38px] flex items-center justify-center rounded-[8px]"
    >
      {!isConnected ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Connect wallet
        </T1>
      ) : isInsufficientT0 ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Insufficient {shortenTokenSymbol(getTokenSymbol(token0.address, token0.symbol, token0.chainId)!)} Balance
        </T1>
      ) : isInsufficientT1 ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Insufficient {shortenTokenSymbol(getTokenSymbol(token1.address, token1.symbol, token1.chainId)!)} Balance
        </T1>
      ) : isTransactionPending ? (
        <div className="flex flex-row items-center gap-1">
          <TransactionLoader />
          <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            Transaction in progress
          </T1>
        </div>
      ) : !editPosition ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={`${disabled ? colors.blue[400] : 'inherit'}`}>
          Deploy Position
        </T1>
      ) : !updatePosition ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Increase Position
        </T1>
      ) : (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Decrease Position
        </T1>
      )}
    </button>
  )
}

export default DeployPositionButton
