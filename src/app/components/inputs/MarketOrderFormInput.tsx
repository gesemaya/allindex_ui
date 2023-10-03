import { useChainLoader } from '../../route/RouteWrapper'
import { T2, T3, T4 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import { getTokenSymbol } from '../../util/getTokenName'
import { Divider } from '../misc/Divider'
import NumberInput from './NumberInput'
import { FetchBalanceResult } from '@wagmi/core'
import React from 'react'

interface IMarketOrderFormInput {
  placeHolder?: string
  token: IToken
  loading?: boolean
  action: string
  setFocus: (value: string) => void
  focus: string
  disabled?: boolean

  isSellToken?: boolean
  balance: FetchBalanceResult | undefined

  ///

  value: string
  setValue: (value: string) => void
}

function MarketOrderFormInput(props: IMarketOrderFormInput) {
  const { currentChainInfo } = useChainLoader()
  const {
    placeHolder,
    token,
    value,
    setValue,
    loading = false,
    action,
    setFocus,
    focus,
    disabled = false,
    balance,
  } = props

  const isSellToken = action === 'Sell'

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
        className="p-3 rounded-[10px] bg-gray-900 border-[1px] "
        style={{ borderColor: !disabled && focus === action ? '#4C82FB' : colors.gray[700] }}
      >
        <div className="flex flex-col">
          <div className="flex flex-row justify-between gap-x-1">
            {loading ? (
              <div className="h-5">
                <div className="w-20 mt-0.5 h-4 rounded-sm bg-gradient-to-r from-gray-700 to-gray-900 animte-shimmer overflow-hidden">
                  <div className="animate-shimmer w-20 h-4 bg-gradient-to-r from-gray-900 to-transparent"></div>
                </div>
              </div>
            ) : (
              <NumberInput
                onUserInput={onValueChange}
                value={loading ? 'Loading' : value}
                placeholder={placeHolder}
                decimals={token.decimals}
                disabled={disabled || loading}
                classes="text-sm font-semibold text-gray-50"
              />
            )}
            <div className="flex justify-end mb-1">
              {focus && <T4 color={focus === action ? colors.blue[400] : colors.gray[400]}>{action}</T4>}
            </div>
          </div>

          <Divider containerClasses="my-2" />

          <div className="flex flex-row justify-between items-center gap-x-1 w-full">
            {balance ? (
              <div className="flex flex-row items-center gap-x-1">
                <T3
                  className="overflow-hidden max-w-[70px] whitespace-nowrap overflow-ellipsis"
                  color={colors.gray[500]}
                >
                  {balance.formatted}
                </T3>
                {isSellToken && balance.formatted > value && (
                  <button
                    className="text-blue-400 text-sm leading-none transform transition duration-75 ease-in active:scale-90 hover:text-blue-500"
                    onClick={setMax}
                  >
                    Max
                  </button>
                )}
              </div>
            ) : (
              <T3 color={colors.gray[500]}>0</T3>
            )}

            <div className="flex flex-row gap-1 items-center">
              <div className="h-[18px] w-[18px] bg-white rounded-full">
                <img
                  src={token.logoURI}
                  alt={getTokenSymbol(token.address, token.symbol, currentChainInfo.id)!}
                  className="rounded-full"
                />
              </div>
              <T2 color={colors.gray[100]}>{getTokenSymbol(token.address, token.symbol, currentChainInfo.id)!}</T2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketOrderFormInput
