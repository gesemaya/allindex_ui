interface IOrderHistoryPanelSection {
  totalPositions: number
  totalOrders: number
  totalValue: number
}

function OrderHistoryPanelSection(props: IOrderHistoryPanelSection) {
  const { totalPositions = 0, totalOrders = 0 } = props

  return (
    <>
      <p className="text-white mb-4 mt-6 text-[16px] font-regular">Orders</p>
      <div className="flex">
        <div className="w-44 rounded-[16px] justify-between border-[1px] border-[#293249] p-4 ml-3 mb-4 bg-[#141B2B] w-[186px]">
          <p className="text-[#7C85A2] text-[16px] font-normal mb-2">Total Orders</p>
          <p className="text-white text-[18px] font-regular">{totalOrders}</p>
        </div>
        <div className="w-44 rounded-[16px] justify-between border-[1px] border-[#293249] p-4 ml-3 mb-4 bg-[#141B2B] w-[186px]">
          <p className="text-[#7C85A2] text-[16px] font-normal mb-2">Total Positions</p>
          <p className="text-white text-[18px] font-regular">{totalPositions}</p>
        </div>
      </div>
    </>
  )
}

export default OrderHistoryPanelSection
