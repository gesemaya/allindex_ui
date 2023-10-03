import { useChainLoader } from '../../../route/RouteWrapper'
import { colors } from '../../../constants/colors'
import { IToken } from '../../../lib/getToken'
import { isStableCoin } from '../../../lib/isStableCoin'
import { SwapChartEnums, tokenChartTimeIncrementEnums } from '../../../types/Enums'
import { IBounds } from '../charts/lineChart/types'
import TokenChartContainer from '../charts/swapPageCharts/components/TokenChartContainer'
import { TokenChartTopBar } from '../charts/swapPageCharts/components/topBar/TokenChartTopBar'
import { useEffect, useRef, useState } from 'react'

interface ITokenChartPanel {
  height: number
  width: number
  timeIncrement: tokenChartTimeIncrementEnums
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
  token: IToken
  xBounds: IBounds | undefined
  setXBounds: (value: IBounds | undefined) => void
  price: number | undefined
}

function TokenChartPanel(props: ITokenChartPanel) {
  const { height, width, timeIncrement, setTimeIncrement, token, xBounds, setXBounds, price } = props
  const [loading, setLoading] = useState(true)
  const [chart, setChart] = useState<SwapChartEnums>(
    isStableCoin(token.chainId, token.address) ? SwapChartEnums.TVL : SwapChartEnums.PRICE
  )
  const padding = 20
  // window.log.log(token)
  const { cushRpc } = useChainLoader()
  useEffect(() => {
    setLoading(true)
    setChart(isStableCoin(token.chainId, token.address) ? SwapChartEnums.TVL : SwapChartEnums.PRICE)
  }, [token, cushRpc])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (ref.current && ref.current.contains(e.target)) {
        e.preventDefault()
      }
    }
    document.addEventListener('wheel', handleScroll, { passive: false })
    return () => {
      document.removeEventListener('wheel', handleScroll)
    }
  }, [ref])

  // window.log.log(isStableCoin(token.chainId, token.address) , token.address)
  const chartPanelWidth = width - 2 * padding
  const chartPanelHeight = height - 2 * padding - 100
  return (
    <div
      ref={ref}
      className={`p-5 rounded-xl bg-[${colors.gray[900]}] border-[1px] flex flex-col border-[${colors.gray[800]}]`}
      style={{ height: height, width: width }}
    >
      <TokenChartTopBar
        chart={chart}
        setChart={setChart}
        token={token}
        tokenPriceUSD={price}
        timeIncrement={timeIncrement}
        setTimeIncrement={setTimeIncrement}
      />
      <TokenChartContainer
        chart={chart}
        setChart={setChart}
        timeIncrement={timeIncrement}
        height={chartPanelHeight}
        width={chartPanelWidth}
        token={token}
        bounds={xBounds}
        setBounds={setXBounds}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  )
}

export default TokenChartPanel
