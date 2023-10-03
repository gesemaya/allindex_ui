function OrderHistoryListTitles() {
  return (
    <div className="grid grid-cols-5 min-[1200px]:grid-cols-12 min-[1600px]:grid-cols-8 min-[1600px]:gap-x-4 min-[1880px]:grid-cols-12 w-full h-fit text-[12px] mb-[12px] mt-[14px] text-gray-500 font-normal pr-6">
      <p className="">Type</p>
      <p className="col-start-2 min-[1200px]:col-start-3 min-[1600px]:col-start-2">Status</p>
      <p className="col-start-3 min-[1200px]:col-start-5 min-[1600px]:col-start-3">Pool</p>
      <p className="max-[1200px]:hidden min-[1200px]:col-start-8  min-[1600px]:col-start-5 ">Fee</p>
      <p className="min-[1880px]:col-start-6 min-[1880px]:flex max-[1880px]:hidden whitespace-nowrap">Buy Amount</p>
      <p className="min-[1880px]:col-start-8 min-[1880px]:flex max-[1880px]:hidden whitespace-nowrap">Sell Amount</p>
      <p className="min-[1600px]:col-start-6 min-[1880px]:col-start-10 max-[1600px]:hidden">Date</p>
      <p className="col-start-5 min-[1200px]:col-start-12 min-[1600px]:col-start-8 min-[1880px]:col-start-12 justify-self-end">
        Price
      </p>
    </div>
  )
}

export default OrderHistoryListTitles
