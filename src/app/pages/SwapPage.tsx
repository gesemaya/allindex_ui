import { useChainLoader } from '../route/RouteWrapper'
import { getTokenByAddress } from '../lib/getToken'
import DefaultSwapPageLayout from '../components/layouts/swapPage/DefaultSwapPageLayout'
import FooterPanel from '../components/layouts/swapPage/panels/FooterPanel'
import { useSwapPageContext } from '../context/SwapPageContext'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function SwapPage() {
  const param = useParams()
  const { currentChainInfo } = useChainLoader()
  const { setToken0, setToken1, token0, token1 } = useSwapPageContext()

  useEffect(() => {
    if (param.token0) {
      setToken0(getTokenByAddress(param.token0, currentChainInfo.id))
    }
  }, [param.token0, currentChainInfo])

  useEffect(() => {
    if (param.token1) {
      setToken1(getTokenByAddress(param.token1, currentChainInfo.id))
    }
  }, [param.token1, currentChainInfo])

  return (
    <div className={`flex flex-col justify-between  `}>
      {token0 && token1 && <DefaultSwapPageLayout token0={token0} token1={token1} />}
      {window.innerWidth > 1280 && <FooterPanel />}
    </div>
  )
}

export default SwapPage
