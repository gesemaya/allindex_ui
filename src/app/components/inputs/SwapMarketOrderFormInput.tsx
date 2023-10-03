import { BalanceTag } from '../tags/BalanceTag'
import { T4 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import SelectTokenDropdown from '../dropdown/setTokenDropdown/SelectTokenDropdown'
import NumberInput from './NumberInput'
import { FetchBalanceResult } from '@wagmi/core'
import React from 'react'
import { useAccount } from 'wagmi'

interface ISwapMarketOrderFormInput {
  placeHolder?: string
  token: IToken
  setToken: (value: IToken) => void
  loading?: boolean
  action: string
  setFocus: (value: string) => void
  focus: string
  disabled?: boolean
  flip?: boolean
  balance: FetchBalanceResult | undefined

  value: string
  setValue: (value: string) => void
}

function SwapMarketOrderFormInput(props: ISwapMarketOrderFormInput) {
  const {
    placeHolder,
    token,
    setToken,
    value,
    setValue,
    loading = false,
    action,
    setFocus,
    focus,
    disabled = false,
    flip = false,
    balance,
  } = props
  const { isConnected } = useAccount()
  const onValueChange = (value: string) => {
    if (value === '') {
      setValue('')
    }
    setFocus(action)
    setValue(value)
  }

  const setMax = () => {
    if (balance) {
      setValue(balance.formatted)
    }
  }

  return (
    <div className="flex flex-col mx-1">
      <div
        onFocus={() => setFocus(action)}
        className="flex py-3 flex-row justify-between px-3 rounded-[10px] bg-[#0E111A] border-[1px]  "
        style={{ borderColor: !disabled && focus === action ? '#4C82FB' : colors.gray[700] }}
      >
        <div className="flex flex-col justify-between items-start">
          <NumberInput
            onUserInput={onValueChange}
            value={loading ? 'Loading' : value}
            placeholder={placeHolder}
            disabled={disabled || loading}
            decimals={token.decimals}
            classes="text-sm font-semibold text-gray-50"
          />
          <div className="flex gap-x-2">
            {isConnected && <BalanceTag balance={balance} fontSize={12} tokenAddress={token.address} />}

            {action === 'Sell' && isConnected && (
              <button
                className="text-blue-400 text-sm transform transition duration-75 ease-in active:scale-90 hover:text-blue-500"
                onClick={setMax}
              >
                Max
              </button>
            )}
          </div>
        </div>
        <div>
          <div className=" flex justify-end mb-1">
            {focus && <T4 color={focus === action ? colors.blue[400] : colors.gray[400]}>{action}</T4>}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <SelectTokenDropdown token={token} setToken={setToken} isToken0={flip} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapMarketOrderFormInput
