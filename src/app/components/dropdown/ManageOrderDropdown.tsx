import { Order } from '@gfxlabs/oku'
import OrderBanners, { OrderBannerEnums } from '../banners/OrderBanners'
import ManageButton from '../buttons/ManageButton'
import BaseModal from '../modals/BaseModal'
import { DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import ManageDropdown from './ManageDropdown'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'

interface IManageOrderDropdown {
  order: Order
  isOrderPage: boolean
}

function ManageOrderDropdown(props: IManageOrderDropdown) {
  const { order, isOrderPage } = props
  const [orderBannerState, setBannerOrderState] = useState<OrderBannerEnums | undefined>()
  const [txHash, setTxHash] = useState('')

  const manageShowBanner = (orderBannerState: OrderBannerEnums, txHash?: string) => {
    setBannerOrderState(orderBannerState)
    txHash && setTxHash(txHash)
  }
  return (
    <>
      <DropdownMenu.Root modal={!isOrderPage}>
        <DropdownTrigger
          trigger={isOrderPage ? <ManageButton /> : <EllipsisVerticalIcon width={16} />}
          hasCarot={isOrderPage}
          classes={`${
            isOrderPage
              ? 'flex justify-between gap-x-6 h-[30px]  rounded-[5px] items-center p-2 bg-blue-500 hover:opacity-90 cursor-pointer'
              : ''
          } `}
        />

        <DropdownItemsContainer align="end" sideOffset={6}>
          <ManageDropdown order={order} manageShowBanner={manageShowBanner} />
        </DropdownItemsContainer>
      </DropdownMenu.Root>
      {orderBannerState && (
        <BaseModal
          showModal={true}
          onClose={() => {
            setBannerOrderState(undefined)
          }}
          showOverlay={true}
          offsetTop={window.innerHeight - 100}
          offsetRight={10}
        >
          <OrderBanners bannerState={orderBannerState} setBannerState={setBannerOrderState} transactionHash={txHash} />
        </BaseModal>
      )}
    </>
  )
}

export default ManageOrderDropdown
