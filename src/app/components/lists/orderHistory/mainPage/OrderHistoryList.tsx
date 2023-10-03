import { T2, T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { useUserOrderContext } from '../../../../context/UserOrderContext'
import ExpandOrderHistoryButton from '../../../buttons/ExpandOrderHistoryButton'
import OrderHistoryItem from './OrderHistoryItem'
import OrderHistoryListTitles from './OrderHistoryListTitles'
import { useAccount } from 'wagmi'

interface IOrderHistoryList {
  filter: string
}

function OrderHistoryList(props: IOrderHistoryList) {
  const { filter } = props
  const { allUserOrders: orders } = useUserOrderContext()
  const { isConnected } = useAccount()
  const sortedOrders = orders
    ? orders?.sort(function (a, b) {
        return b.time! - a.time!
      })
    : []

  return (
    <div className="relative bg-[#0E0E0E] rounded-lg text-white p-2 flex flex-col items-center flex-1 outline outline-1 outline-gray-800 overflow-hidden">
      <div className="w-full relative flex flex-row justify-between items-center">
        <div></div>
        <div>
          <T3 color={colors.gray[50]}>Order History</T3>
        </div>
        <ExpandOrderHistoryButton />
      </div>
      {isConnected ? (
        <>
          <OrderHistoryListTitles />
          <div className="flex flex-col w-full flex-1 overflow-y-scroll no-scrollbar gap-y-3">
            {sortedOrders && sortedOrders.length > 0 ? (
              sortedOrders
                .filter(
                  (item) =>
                    filter === 'All' || item.type === filter.toUpperCase() || item.status === filter.toUpperCase()
                )
                .map((order, index) => <OrderHistoryItem key={index} order={order} />)
            ) : (
              <T2 color={colors.gray[300]}>No Orders Yet</T2>
            )}
          </div>
        </>
      ) : (
        <div className="flex mt-8">
          <T2 color={colors.gray[300]}>Connect wallet</T2>
        </div>
      )}
    </div>
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

export default OrderHistoryList
