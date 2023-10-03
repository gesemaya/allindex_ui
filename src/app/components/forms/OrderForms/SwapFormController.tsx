import { T2 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums, OrderFormTypeEnums } from '../../../types/Enums'
import OrderFormDropdown, { IOrderSettings } from '../../dropdown/OrderFormDropdown'
import SwapOrderForm from './Swap/SwapOrderForm'
import { useState } from 'react'

function SwapFormContainer() {
  const [orderForm, setOrderForm] = useState(OrderFormTypeEnums.MARKET)
  const [settings, setSettings] = useState<IOrderSettings>({ slippage: 0.5, transactionDeadline: 30 })
  return (
    <div
      className={`rounded-lg h-full flex flex-col p-3 outline outline-1 outline-gray-800  w-full bg-[${colors.gray.dark}]  `}
    >
      <div className=" flex flex-1 flex-col">
        <div className="flex justify-between items-center">
          <ChooseForm orderForm={orderForm} setOrderForm={setOrderForm} />
          {orderForm === OrderFormTypeEnums.MARKET && (
            <OrderFormDropdown settings={settings} setSettings={setSettings} />
          )}
        </div>
        <div className="text-white flex flex-1 flex-col justify-between py-2 ">
          <div className="flex flex-col gap-2 mb-0">
            <SwapOrderForm isSwap={true} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapFormContainer

interface IOrderFormButton {
  onClick: () => void
  orderFormChosen: OrderFormTypeEnums
  children: string
  disabled?: boolean
  orderForm: OrderFormTypeEnums
}

const ChooseFormButton = (props: IOrderFormButton) => {
  const { onClick, orderFormChosen, children, disabled = false, orderForm } = props
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-2 hover:bg-[#293249] rounded-lg ${orderForm === orderFormChosen ? '' : ''}`}
      disabled={disabled}
    >
      <T2 weight={FontWeightEnums.MEDIUM} color={disabled ? colors.gray[400] : 'white'}>
        {children}
      </T2>
      <div className="h-[1px] w-full"></div>
    </button>
  )
}

const ChooseForm = ({
  orderForm,
  setOrderForm,
}: {
  orderForm: OrderFormTypeEnums
  setOrderForm: (type: OrderFormTypeEnums) => void
}) => {
  return (
    <div className="flex flex-row gap-4 text-white text-[14px] font-normal">
      <ChooseFormButton
        onClick={() => {
          setOrderForm(OrderFormTypeEnums.MARKET)
        }}
        orderFormChosen={OrderFormTypeEnums.MARKET}
        orderForm={orderForm}
      >
        Swap
      </ChooseFormButton>
      {/* <ChooseFormButton
        onClick={() => {
          setOrderForm(OrderFormTypeEnums.LIMIT)
        }}
        orderFormChosen={OrderFormTypeEnums.LIMIT}
        orderForm={orderForm}
      >
        Limit
      </ChooseFormButton> */}
    </div>
  )
}
