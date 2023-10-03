import { IToken } from '../../../lib/getToken'
import { OrderFormActionEnums } from '../../../types/Enums'
import { useDataContext } from '../../../context/DataContext'
import OrderButton from '../../buttons/OrderButton'
import { IOrderSettings } from '../../dropdown/OrderFormDropdown'
import OrderFormInput from '../../inputs/OrderFormInput'

interface IStopOrderForm {
  orderAction: OrderFormActionEnums
  order: { token0: string; token1: string }
  updateOrder: (order: { token0: string; token1: string }) => void
  settings: IOrderSettings
}

function StopOrderForm({ order, orderAction, updateOrder }: IStopOrderForm) {
  const { token1, token0 } = useDataContext()
  const StopOrder = () => {
    window.log.log('stopOrder')
  }

  const onOrderChange = (value: string, token: IToken) => {
    // if token0 is changed, update order.token0
    if (token.address === token0.address) {
      updateOrder({ ...order, token0: value })
    } else {
      updateOrder({ ...order, token1: value })
    }
  }

  return (
    <div className="text-white flex w-[474px] flex-col justify-between mt-[10px] ">
      <div>
        <div className="flex flex-col gap-2 w-full ">
          <div className="flex flex-row gap-[5px] flex-1">
            <OrderFormInput
              placeHolder={'Stop'}
              token={token0}
              orderInput={order.token0}
              setOrderInput={onOrderChange}
            />
            <OrderFormInput
              placeHolder={'Limit'}
              token={token1}
              orderInput={order.token0}
              setOrderInput={onOrderChange}
            />
          </div>
          <div className="flex flex-row gap-[5px]">
            <OrderFormInput
              placeHolder={'Amount'}
              token={token0}
              orderInput={order.token0}
              setOrderInput={onOrderChange}
            />
            <OrderFormInput
              placeHolder={'Total'}
              token={token1}
              orderInput={order.token0}
              setOrderInput={onOrderChange}
            />
          </div>
        </div>
        {/* <OrderFormSlider percent={percent} setPercent={setPercent} containerWidth={width} /> */}
      </div>
      <OrderButton orderAction={orderAction} onClick={StopOrder} orderFormState={undefined}></OrderButton>
    </div>
  )
}

export default StopOrderForm
