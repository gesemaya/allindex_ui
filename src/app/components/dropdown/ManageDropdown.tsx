import { useChainLoader } from '../../route/RouteWrapper'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useConfigContext } from '../../context/naked/ConfigContext'
import { useTelemetryContext } from '../../context/naked/TelemetryContext'
import { getURLInfo } from '../../util/pathHelper'
import { useUserOrderContext } from '../../context/UserOrderContext'
import { cancelOrder, claimOrder } from '../../contracts/limitOrder'
import { Order } from '@gfxlabs/oku'
import { recordTelemetry } from '../../data/telemetry_record'
import { MinPendingBanner, OrderBannerEnums } from '../banners/OrderBanners'
import { Divider } from '../misc/Divider'
import { DropdownItem } from './Dropdown/Dropdown'
import { track } from '@multibase/js'
import { ContractReceipt } from 'ethers'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useNetworkContext } from '../../context/NetworkContext'

interface IMangeDropdown {
  manageShowBanner: (orderBannerState: OrderBannerEnums, txHash?: string) => void
  order: Order
}

function ManageDropdown(props: IMangeDropdown) {
  const { manageShowBanner, order } = props
  const { address } = useAccount()
  const { currentChain } = useChainLoader()
  const { signer, provider } = useNetworkContext()
  const { currentChainInfo } = useChainLoader()
  const location = useLocation()
  const { pageParam } = getURLInfo(location)
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const scanUrl = currentChainInfo.scanUrl
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()
  const [pending, setPending] = useState(false)

  const onEtherscan = (order: Order) => {
    window.open(`${scanUrl}tx/${order.transaction}`)
  }

  const { getAndSetAllUserOrders } = useUserOrderContext()
  const onClaim = async (order: Order) => {
    const batchId = order.limit_order_full?.batch_id
    if (!(signer && batchId && address && provider)) {
      return
    }
    try {
      manageShowBanner(OrderBannerEnums.EXECUTE_CLAIM)
      const claimOrderTx = await claimOrder({
        userDataId: batchId,
        userAddress: address,
        signer,
        provider,
        chain: currentChain,
      })
      manageShowBanner(OrderBannerEnums.EXECUTE_CLAIM_IN_PROGRESS, claimOrderTx)
      setPending(true)
      const claimOrderReceipt = await provider.waitForTransactionReceipt({ hash: claimOrderTx })
      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentChain,
          pageParam,
          'claim_limit_order',
          address!,
          claimOrderReceipt.transactionHash,
          {}
        )
      }
      track('claim_limit_order', {
        chain: currentChainInfo.name,
        pool: order.pool,
        order: order.transaction,
        transaction: claimOrderReceipt.transactionHash,
      })
      setPending(false)
      manageShowBanner(OrderBannerEnums.EXECUTE_CLAIM_SUCCESS, claimOrderReceipt.transactionHash)
      setTimeout(() => {
        getAndSetAllUserOrders(address)
      }, 5000)
    } catch (e) {
      setPending(false)
      const error = e as ContractReceipt
      window.log.error(error)
      manageShowBanner(OrderBannerEnums.EXECUTE_CLAIM_ERROR, error.transactionHash)
    }
  }

  const onCancel = async (order: Order) => {
    const direction = order.limit_order_full?.direction
    const targetTick = !direction ? order.limit_order_full?.tick_lower : order.limit_order_full?.tick_upper
    const poolAddress = order.pool
    window.log.log(poolAddress, targetTick, direction, currentChain, poolAddress, order.side)
    if (!(provider && signer && poolAddress && direction !== undefined && targetTick && address)) {
      return
    }
    try {
      manageShowBanner(OrderBannerEnums.EXECUTE_CANCEL)
      const cancelOrderTx = await cancelOrder({
        pool: poolAddress,
        chain: currentChain,
        provider,
        targetTick,
        direction,
        signer,
      })
      setPending(true)
      manageShowBanner(OrderBannerEnums.EXECUTE_CANCEL_IN_PROGRESS, cancelOrderTx)
      const cancelOrderReceipt = await provider.waitForTransactionReceipt({ hash: cancelOrderTx })
      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentChain,
          pageParam,
          'cancel_limit_order',
          address!,
          cancelOrderReceipt.transactionHash,
          {}
        )
      }
      track('cancel_limit_order', {
        chain: currentChainInfo.name,
        pool: order.pool,
        order: order.transaction,
        transaction: cancelOrderReceipt.transactionHash,
      })
      setPending(false)
      manageShowBanner(OrderBannerEnums.EXECUTE_CANCEL_SUCCESS, cancelOrderReceipt.transactionHash)
      setTimeout(() => {
        getAndSetAllUserOrders(address)
      }, 5000)
    } catch (e) {
      setPending(false)
      const error = e as ContractReceipt
      window.log.error(error)
      manageShowBanner(OrderBannerEnums.EXECUTE_CANCEL_ERROR, error.transactionHash)
    }
  }

  return (
    <>
      {pending && orderFormState === undefined && <MinPendingBanner />}
      <ActionButton onClick={() => onEtherscan(order)} color={colors.blue[400]}>
        {currentChainInfo.scanSite}
      </ActionButton>
      {order && order.type === 'LIMIT' && (
        <>
          {order.status === 'OPEN' && (
            <div>
              <Divider containerClasses="mx-2" />
              <ActionButton onClick={() => onCancel(order)} color={colors.red[500]}>
                Cancel Order
              </ActionButton>
            </div>
          )}
          {order.status === 'FILLED' && (
            <div>
              <Divider containerClasses="mx-2" />
              <ActionButton onClick={() => onClaim(order)} color={colors.white}>
                Claim Order
              </ActionButton>
            </div>
          )}
        </>
      )}
    </>
  )
}

interface IActionButton {
  onClick: () => void
  color: string
  children: React.ReactNode
}

export const ActionButton = (props: IActionButton) => {
  const { onClick, color, children } = props
  return (
    <DropdownItem classes="p-3" onClick={onClick}>
      <T3 color={color}>{children}</T3>
    </DropdownItem>
  )
}

export default ManageDropdown
