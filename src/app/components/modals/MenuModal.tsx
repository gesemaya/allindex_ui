import { useChainLoader } from '../../route/RouteWrapper'
import { useConfigContext } from '../../context/naked/ConfigContext'
import { useModalContext } from '../../context/naked/ModalContext'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { useDataContext } from '../../context/DataContext'
import NavButton from '../buttons/NavButton'
import BaseModal from './BaseModal'
import { Trans } from '@lingui/macro'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function MenuModal() {
  const { showMobileMenu, setShowMobileMenu } = useModalContext()
  const { height } = useWindowDimensions()
  const { currentChainInfo } = useChainLoader()
  const { poolSummary } = useDataContext()
  const { features } = useConfigContext()

  const { poolAddress, token0, token1 } = useParams()
  const [newPoolAddress, setNewPoolAddress] = useState(currentChainInfo.defaultPool)
  const [newToken0, setNewToken0] = useState(poolSummary ? poolSummary.t0 : undefined)
  const [newToken1, setNewToken1] = useState(poolSummary ? poolSummary.t1 : undefined)

  useEffect(() => {
    if (poolAddress) {
      setNewPoolAddress(poolAddress)
    }
  }, [poolAddress])

  useEffect(() => {
    if (token0 && token1) {
      setNewToken0(token0)
      setNewToken1(token1)
    } else if (poolSummary) {
      setNewToken0(poolSummary.t0)
      setNewToken1(poolSummary.t1)
    }
  }, [poolSummary, token0, token1])

  const TradeButton = () => (
    <NavButton to={`pool/${newPoolAddress}`} relative="route">
      <Trans>Trade</Trans>
    </NavButton>
  )

  const PositionMakerButton = () => (
    <NavButton to={`liquidity/${newPoolAddress}`} relative="route">
      <Trans>Position Maker</Trans>
    </NavButton>
  )

  const OrdersButton = () => (
    <NavButton to="order" relative="route">
      <Trans>Orders</Trans>
    </NavButton>
  )
  const SwapButton = () => (
    <NavButton to={`swap/${newToken0}/${newToken1}`} relative="route">
      <Trans>Swap</Trans>
    </NavButton>
  )

  return (
    <BaseModal
      showModal={showMobileMenu}
      onClose={() => setShowMobileMenu(false)}
      showOverlay={false}
      offsetTop={0}
      offsetRight={0}
    >
      <div
        className="min-w-[210px] right-10 flex flex-col items-start px-4 gap-1 pt-4 "
        style={{ height: height, backgroundColor: '#080808' }}
      >
        <TradeButton />
        <PositionMakerButton />
        <OrdersButton />
        {features.Swap.enabled === 'true' ? <SwapButton /> : <></>}
        {features.Analytics.enabled === 'true' && features.Analytics.url ? (
          <NavButton to={features.Analytics.url} reloadDocument>
            <Trans>Analytics</Trans>
          </NavButton>
        ) : (
          <></>
        )}
      </div>
    </BaseModal>
  )
}

export default MenuModal
