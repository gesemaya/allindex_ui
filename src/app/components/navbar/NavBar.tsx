import { useChainLoader } from '../../route/RouteWrapper'
import { BlockNumberTag } from '../tags/BlockNumberTag'
import { useConfigContext } from '../../context/naked/ConfigContext'
import useMobile from '../../hooks/useMobile'
import { useDataContext } from '../../context/DataContext'
import HomeButton from '../buttons/HomeButton'
import NavButton from '../buttons/NavButton'
import { Trans } from '@lingui/macro'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ZERO_ADDRESS } from '../../constants/addresses'
import useWindowDimensions from '../../hooks/useWindowDimensions'

function NavBar() {
  const { currentChainInfo } = useChainLoader()
  const { features } = useConfigContext()
  const { poolSummary } = useDataContext()
  const { isMobile } = useMobile()
  const { poolAddress, token0, token1 } = useParams()
  const { width } = useWindowDimensions()

  const isDesktop = width > 1070
  const [newPoolAddress, setNewPoolAddress] = useState(currentChainInfo.defaultPool)
  const [newToken0, setNewToken0] = useState(poolSummary?.t0 ? poolSummary.t0 : currentChainInfo.defaultToken0)
  const [newToken1, setNewToken1] = useState(poolSummary?.t1 ? poolSummary.t1 : currentChainInfo.defaultToken1)

  useEffect(() => {
    if (poolAddress) {
      setNewPoolAddress(poolAddress)
    }
  }, [poolAddress])

  useEffect(() => {
    if (token0 && token1) {
      setNewToken0(token0)
      setNewToken1(token1)
    } else if (poolSummary && poolSummary.t0 !== ZERO_ADDRESS && poolSummary.t1 !== ZERO_ADDRESS) {
      setNewToken0(poolSummary.t0)
      setNewToken1(poolSummary.t1)
    } else if (!token0 && !token1) {
      setNewToken0(currentChainInfo.defaultToken0)
      setNewToken1(currentChainInfo.defaultToken1)
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
    <div className="flex flex-row gap-[12px] justify-center items-center">
      <HomeButton
        onClick={() => {
          document.cookie = 'landingPage=unvisited; expires=Fri, 31 Dec 9999 23:59:59 GMT'
          window.location.href = 'http://localhost'
        }}
      ></HomeButton>
      {!isMobile && <BlockNumberTag />}
      {isDesktop && (
        <div className="flex flex-row gap-[12px] justify-center ml-2">
          <TradeButton />
          <PositionMakerButton />
          <OrdersButton />
          {features.Swap.enabled === 'true' ? <SwapButton /> : <></>}
          {features.Analytics.enabled === 'true' && features.Analytics.url ? (
            <NavButton
              //isCurrentPage={location.pathname.includes('/analytics')}
              to={features.Analytics.url}
              reloadDocument
            >
              <Trans>Analytics</Trans>
            </NavButton>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
}

export default NavBar
