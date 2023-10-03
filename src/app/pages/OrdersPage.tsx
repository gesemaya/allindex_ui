import { T1 } from '../components/typography/Typography'
import { useModalContext } from '../context/naked/ModalContext'
import OrderHistoryPanelSection from '../components/sections/orderHistory/userPage/OrderHistoryPanelSection'
import OrdersSection from '../components/sections/orderHistory/userPage/OrdersSection'
import { useUserOrderContext } from '../context/UserOrderContext'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { DescriptionFunc, TitleFunc } from '../route/RouteWrapper'

export const OrdersPage = () => {
  const { isConnected } = useAccount()

  const { currentPositions, allUserOrders } = useUserOrderContext()
  const { setIsLoading } = useModalContext()
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const newTotalValue = allUserOrders
      ? allUserOrders.reduce((acc, order) => {
          return acc + Number(order.price) * Number(order.amount_total)
        }, 0)
      : 0
    setTotalValue(newTotalValue)
  }, [allUserOrders])

  if (!isConnected || (currentPositions !== undefined && allUserOrders !== undefined)) {
    setIsLoading(false)
  }

  const pageTitle = `DeFi Position Analytics | Oku Trade`
  const pageDescription = `Check out your position analytics on the world’s most advanced DeFi trading platform. Order type, status, entry price, and more on Oku Trade.`
  return (
    <div className="flex flex-1 justify-center overflow:auto">
      <div className="text-white flex flex-1 flex-col px-8 pb-4 bg-black  gap-2 overflow:auto rounded-[16px]">
        <TitleFunc pageTitle={pageTitle} />
        <DescriptionFunc pageDescription={pageDescription} />
        <OrderHistoryPanelSection
          totalOrders={allUserOrders ? allUserOrders.length : 0}
          totalPositions={currentPositions ? currentPositions.length : 0}
          totalValue={totalValue}
        />
        {isConnected ? (
          allUserOrders && (
            <OrdersSection
              orderHistoryData={allUserOrders}
              positionData={currentPositions?.length ? currentPositions : []}
            />
          )
        ) : (
          <div className="flex flex-1 w-full justify-center mt-10">
            <T1>Please Connect Wallet</T1>
          </div>
        )}
      </div>
    </div>
  )
}
