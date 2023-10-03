import { T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import NumberInput from './NumberInput'
import { useEffect, useState } from 'react'
import { useAccount, useBalance, useNetwork } from 'wagmi'

interface IOrderFormInput {
  placeHolder?: string
  token: IToken
  orderInput: string
  setOrderInput: (value: string, token: IToken) => void
  showMax?: boolean
  loading?: boolean
}

function OrderFormInput(props: IOrderFormInput) {
  const { placeHolder, token, orderInput, setOrderInput, loading = false } = props
  const { chain } = useNetwork()
  const { address } = useAccount()

  const balance = useBalance({
    address: address,
    token: token.address as `0x${string}`,
    chainId: chain?.id,
  })
  const [value, setValue] = useState('')

  useEffect(() => {
    if (value === orderInput) return
    setOrderInput(value, token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    if (value !== orderInput) setValue(orderInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInput])

  return (
    <div className="flex flex-col">
      <div className="flex py-3  flex-row px-3 rounded-[10px] ">
        <div className="flex flex-1 items-center">
          {!loading ? (
            <NumberInput onUserInput={setValue} value={value} placeholder={placeHolder} />
          ) : (
            <div>Loading</div>
          )}
        </div>
        <div>
          <div className=" flex justify-end mb-1"></div>
          <div className="flex flex-row gap-2 items-center">
            <div className="h-[20px] w-[20px] bg-white rounded-full">
              <img src={token.logoURI} alt={token.symbol} className="rounded-full" />
            </div>
            <T2 color={colors.gray[400]}>{token.symbol}</T2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderFormInput
