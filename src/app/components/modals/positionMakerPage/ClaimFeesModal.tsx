import { useChainLoader } from '../../../route/RouteWrapper'
import { useConfigContext } from '../../../context/naked/ConfigContext'
import { useModalContext } from '../../../context/naked/ModalContext'
import { useTelemetryContext } from '../../../context/naked/TelemetryContext'
import { useDataContext } from '../../../context/DataContext'
import { useUserOrderContext } from '../../../context/UserOrderContext'
import { claimLiquidityFees } from '../../../contracts/claimLiquidityFees'
import { recordTelemetry } from '../../../data/telemetry_record'
import { MinPendingBanner, OrderBannerEnums } from '../../banners/OrderBanners'
import BaseModal from '../BaseModal'
import { ClaimFees } from './ActionStateModals'
import { UserPositions } from '@gfxlabs/oku'
import { track } from '@multibase/js'
import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { MaxUint256 } from '@/app/v3-sdk/v3/index'
import { useNetworkContext } from '../../../context/NetworkContext'

interface IModal {
  showModal: boolean
  setShowModal: (value: boolean) => void
  position: UserPositions
}

function ClaimFeesModal(props: IModal) {
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const { currentChain } = useChainLoader()
  const { currentChainInfo } = useChainLoader()
  const { showModal, setShowModal, position } = props
  const { signer, provider } = useNetworkContext()
  const { address } = useAccount()
  const { token0, token1 } = useDataContext()
  const { setShowTransactionsModal, setTransactionContent } = useModalContext()
  const { getAndSetCurrentPositions } = useUserOrderContext()
  const [orderFormState] = useState<undefined | OrderBannerEnums>()
  const [pending, setPending] = useState(false)

  const onClaimFees = async () => {
    setShowModal(false)

    try {
      if (!provider || !position || !position.tokenId || !position.total_collect_amounts || !address || !signer) return

      setShowTransactionsModal(true)
      const txn = await claimLiquidityFees({
        provider,
        positionId: position.tokenId,
        signer,
        token0,
        token1,
        token0ExpectedOwed: MaxUint256,
        token1ExpectedOwed: MaxUint256,
        user_address: address,
        currentChain: currentChainInfo.id,
      })

      setTransactionContent({
        state: 'PENDING',
        message: 'Claiming fees',
        transaction: txn,
      })
      setPending(true)
      const txnResult = await provider.waitForTransactionReceipt({ hash: txn })
      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentChain,
          'order',
          'claim_fees',
          address!,
          txnResult.transactionHash,
          {}
        )
      }
      track('claim_fees', {
        chain: currentChainInfo.name,
        position: position.tokenId,
        transaction: txnResult.transactionHash,
      })
      setPending(false)
      setTransactionContent({
        state: 'SUCCESSFUL',
        message: 'Fees claimed',
        transaction: txnResult.transactionHash,
      })

      setTimeout(() => {
        getAndSetCurrentPositions(address)
      }, 5000)
    } catch (err) {
      setPending(false)
      const error = err
      window.log.log(error)
      setTransactionContent({
        state: 'ERROR',
        message: 'Error claiming fees',
      })
    }
  }

  return (
    <div>
      {pending && orderFormState === undefined && <MinPendingBanner />}
      <BaseModal showModal={showModal} onClose={() => setShowModal(false)} showOverlay={true} showCloseButton={true}>
        <ClaimFees onClaim={onClaimFees} position={position} />
      </BaseModal>
    </div>
  )
}

export default ClaimFeesModal
