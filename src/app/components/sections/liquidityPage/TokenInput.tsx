import TokenTag from '../../tags/TokenTag'
import { colors } from '../../../constants/colors'
import { IToken } from '../../../lib/getToken'
import { formatNumberToString } from '../../../util/formatNumbers'
import { usePositionMakerContext } from '../../../context/PositionMakerContext'
import Input from '../../inputs/NumberInput'
import { formatUnits } from 'ethers/lib/utils.js'
import { useEffect, useState } from 'react'

interface ITokenInput {
  value: string
  tokenSymbol: string | undefined
  token: IToken
  setLastInput: (value: string, isToken0: boolean) => void
  isToken0?: boolean
}

export const TokenInput = (props: ITokenInput) => {
  const [placeholder, setPlaceholder] = useState('')
  const { editPosition, position } = usePositionMakerContext()
  const { value = '', tokenSymbol = undefined, setLastInput, token, isToken0 = false } = props
  const onInput = (amount: string) => {
    setLastInput(amount, isToken0)
  }

  useEffect(() => {
    if (editPosition && position) {
      const token0Balance = formatUnits(
        position.current_position_values.amount0_current,
        position.position_pool_data.token0_decimals
      )
      const token1Balance = formatUnits(
        position.current_position_values.amount1_current,
        position.position_pool_data.token1_decimals
      )
      isToken0
        ? setPlaceholder(formatNumberToString(token0Balance))
        : setPlaceholder(formatNumberToString(token1Balance))
    }
  }, [editPosition, position])

  return (
    <div
      className="h-[46px] rounded-[12px] px-2 flex justify-between items-center border-[1px]"
      style={{ borderColor: colors.gray[700] }}
    >
      {tokenSymbol && <TokenTag tokenSymbol={tokenSymbol} tokenAddress={token.address} />}
      <Input
        value={value}
        onUserInput={onInput}
        placeholder={editPosition ? placeholder : '0'}
        style={{ color: 'white', textAlign: 'end' }}
        decimals={token.decimals}
      />
    </div>
  )
}
