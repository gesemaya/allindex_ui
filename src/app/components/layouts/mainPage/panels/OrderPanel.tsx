import OrderFormContainer from '../../../forms/OrderForms/OrderFormContainer'
import OrderHistory from '../../../lists/orderHistory/mainPage/OrderHistory'

interface IOrderPanel {
  chartIsNotFullScreen: boolean
  breakpoint: number
}

function OrderPanel(props: IOrderPanel) {
  const { chartIsNotFullScreen, breakpoint } = props
  return (
    <div
      className={`
      flex flex-col lg:flex-row lg:col-start-2 lg:col-end-4 gap-1.5 w-full row-start-3 md:row-start-2
     ${breakpoint < 2 ? '' : `h-[310px]`}
     ${chartIsNotFullScreen ? '' : 'opacity-0'}`}
    >
      <div className={`flex-1 md:max-w-[500px] lg:max-w-[420px] xl:max-w-[500px] h-full`}>
        <OrderFormContainer />
      </div>
      <div className={`grow flex flex-1 h-full `}>
        <OrderHistory />
      </div>
    </div>
  )
}

export default OrderPanel
