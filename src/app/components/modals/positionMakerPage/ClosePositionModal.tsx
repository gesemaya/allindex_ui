import { useChainLoader } from '../../../route/RouteWrapper'
import { useConfigContext } from '../../../context/naked/ConfigContext'
import { useModalContext } from '../../../context/naked/ModalContext'
import { useTelemetryContext } from '../../../context/naked/TelemetryContext'
import { getURLInfo } from '../../../util/pathHelper'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../../../constants/addresses'
import { useUserOrderContext } from '../../../context/UserOrderContext'
import { claimAndRemoveLiquidityMulticall } from '../../../contracts/removeLiquidity'
import { recordTelemetry } from '../../../data/telemetry_record'
import { MinPendingBanner, OrderBannerEnums } from '../../banners/OrderBanners'
import BaseModal from '../BaseModal'
import { ClosePosition } from './ActionStateModals'
import { UserPositions } from '@gfxlabs/oku'
import { track } from '@multibase/js'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNetworkContext } from '../../../context/NetworkContext'

interface IModal {
  showModal: boolean
  setShowModal: (value: boolean) => void
  position: UserPositions
}

function ClosePositionModal(props: IModal) {
  const { showModal, setShowModal, position } = props
  const [pending, setPending] = useState(false)
  const [orderFormState] = useState<undefined | OrderBannerEnums>()
  const { currentChain } = useChainLoader()
  const { currentChainInfo } = useChainLoader()
  const { setShowTransactionsModal, setTransactionContent } = useModalContext()
  const location = useLocation()
  const { pageParam } = getURLInfo(location)
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const { getAndSetCurrentPositions } = useUserOrderContext()
  const { signer, provider } = useNetworkContext()

  const onClosePosition = async () => {
    setShowModal(false)
    setShowTransactionsModal(true)
    if (!(provider && signer)) {
      return
    }
    try {
      // multicall to close and claim
      const claimAndRemoveTxn = await claimAndRemoveLiquidityMulticall({
        positionId: position.tokenId!,
        user_address: position.user as `0x${string}`,
        contract: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
        provider,
        signer,
      })

      setTransactionContent({
        transaction: claimAndRemoveTxn,
        state: 'PENDING',
        message: 'Closing your position',
      })
      setPending(true)
      const removeLiquidityReceipt = await provider.waitForTransactionReceipt({ hash: claimAndRemoveTxn })
      setPending(false)

      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentChain,
          pageParam,
          'close_position',
          position.user,
          removeLiquidityReceipt.transactionHash,
          {}
        )
      }
      track('close_position', {
        chain: currentChainInfo.name,
        position: position.tokenId,
        transaction: removeLiquidityReceipt.transactionHash,
      })

      setPending(false)

      setTransactionContent({
        state: 'SUCCESSFUL',
        message: 'Your position has been closed',
        transaction: removeLiquidityReceipt.transactionHash,
      })

      setTimeout(() => {
        getAndSetCurrentPositions(position.user as `0x${string}`)
      }, 5000)
    } catch (err) {
      setPending(false)
      setTransactionContent({
        state: 'ERROR',
        message: 'Your position could not be closed',
      })
    }
  }

  return (
    <div>
      {pending && orderFormState === undefined && <MinPendingBanner />}
      <BaseModal showModal={showModal} onClose={() => setShowModal(false)} showOverlay={true} showCloseButton={true}>
        <ClosePosition onClick={onClosePosition} position={position} />
      </BaseModal>
    </div>
  )
}

export default ClosePositionModal
