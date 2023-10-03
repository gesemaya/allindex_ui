import { useChainLoader } from '../../../route/RouteWrapper'
import { T2 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums, OrderFormActionEnums, OrderFormTypeEnums } from '../../../types/Enums'
import OrderFormDropdown, { IOrderSettings } from '../../dropdown/OrderFormDropdown'
import LimitOrderForm from './LimitOrderForm'
import StopOrderForm from './StopOrderForm'
import MarketOrderForm from './Swap/MarketOrderForm'
import { track } from '@multibase/js'
import { useState } from 'react'
import { useDataContext } from '../../../context/DataContext'

function OrderFormContainer() {
  const [orderForm, setOrderForm] = useState(OrderFormTypeEnums.MARKET)

  const [settings, setSettings] = useState<IOrderSettings>({ slippage: 1, transactionDeadline: 30, refreshSeconds: 15 })
  return (
    <div className="bg-[#0E0E0E] rounded-xl h-full flex flex-1 flex-col p-2 outline outline-1 outline-gray-800 ">
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-center">
          <ChooseForm orderForm={orderForm} setOrderForm={setOrderForm} />
          {orderForm === OrderFormTypeEnums.MARKET && (
            <OrderFormDropdown settings={settings} setSettings={setSettings} />
          )}
        </div>
        {OrderFormSwitch(orderForm, settings)}
      </div>
    </div>
  )
}

export default OrderFormContainer

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
      className={`flex items-center p-2 hover:bg-[#293249] rounded-lg ${
        orderForm === orderFormChosen ? 'bg-[#293249]' : ''
      }`}
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
  const { currentChainInfo } = useChainLoader()
  const { poolAddress } = useDataContext()
  return (
    <div className="flex flex-row gap-3 text-white text-[14px] font-normal">
      <ChooseFormButton
        onClick={() => {
          track('market_click', { chain: currentChainInfo.name, pool: poolAddress })
          setOrderForm(OrderFormTypeEnums.MARKET)
        }}
        orderFormChosen={OrderFormTypeEnums.MARKET}
        orderForm={orderForm}
      >
        Market
      </ChooseFormButton>
      <ChooseFormButton
        onClick={() => {
          track('limit_click', { chain: currentChainInfo.name, pool: poolAddress })
          setOrderForm(OrderFormTypeEnums.LIMIT)
        }}
        orderFormChosen={OrderFormTypeEnums.LIMIT}
        orderForm={orderForm}
      >
        Limit
      </ChooseFormButton>
    </div>
  )
}

const OrderFormSwitch = (orderForm: OrderFormTypeEnums, settings: IOrderSettings) => {
  const [limitOrderState, setLimitOrderState] = useState({
    token0: '',
    token1: '',
    tokenUpdated: '',
  })

  const [stopOrderState, setStopOrderState] = useState({
    token0: '',
    token1: '',
  })

  const [orderAction, setOrderAction] = useState<OrderFormActionEnums>(OrderFormActionEnums.BUY)

  switch (orderForm) {
    case OrderFormTypeEnums.LIMIT:
      return <LimitOrderForm />
    case OrderFormTypeEnums.MARKET:
      return (
        <MarketOrderForm settings={settings} />
        //<SwapOrderForm isSwap={false} order={marketOrderState} updateOrder={setMarketOrderState} settings={settings} />
      )
    case OrderFormTypeEnums.STOP:
      return (
        <StopOrderForm
          orderAction={orderAction}
          order={stopOrderState}
          updateOrder={setStopOrderState}
          settings={settings}
        />
      )
    default:
      return <MarketOrderForm settings={settings} />
  }
}
