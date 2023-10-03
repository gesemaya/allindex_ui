import { useChainLoader } from '../../../../../../route/RouteWrapper'
import { T1, T2, T3 } from '../../../../../typography/Typography'
import { colors } from '../../../../../../constants/colors'
import { FontWeightEnums, SwapChartEnums } from '../../../../../../types/Enums'
import { getTokenLogoUrl } from '../../../../../../util/getTokenLogo'
import TokenChartTimeDropdown from '../../../../../dropdown/TokenChartTimeDropdown'
import { ISwitchbutton, ITokenChartHeader, ITokenChartSwitch, ITokenChartTopBar } from '../../types'

export const TokenChartTopBar = (props: ITokenChartTopBar) => {
  const { chart, setChart, token, tokenPriceUSD, timeIncrement, setTimeIncrement } = props

  return (
    <div className=" w-full h-fit flex flex-row justify-between">
      <TokenChartHeader token={token} tokenPriceUSD={tokenPriceUSD} chart={chart} />
      <div className="flex flex-row  gap-3">
        {/* <SelectTokenDropdown/> */}
        <TokenChartTimeDropdown timeIncrement={timeIncrement} setTimeIncrement={setTimeIncrement} />
        <TokenChartSwitch chart={chart} setChart={setChart} />
      </div>
    </div>
  )
}

export const TokenChartSwitch = (props: ITokenChartSwitch) => {
  const { chart, setChart } = props
  return (
    <div
      className={` h-fit  flex  flex-row px-3 py-[3px] justify-center items-center border-[1px]  border-[${colors.gray[700]}] bg-[${colors.gray[800]}]   rounded-full`}
    >
      <SwitchButton
        title="Volume"
        onClick={() => {
          setChart(SwapChartEnums.VOLUME)
        }}
        focus={chart === SwapChartEnums.VOLUME}
      />
      <SwitchButton
        title="TVL"
        onClick={() => {
          setChart(SwapChartEnums.TVL)
        }}
        focus={chart === SwapChartEnums.TVL}
      />
      <SwitchButton
        title="Price"
        onClick={() => {
          setChart(SwapChartEnums.PRICE)
        }}
        focus={chart === SwapChartEnums.PRICE}
      />
    </div>
  )
}

export const SwitchButton = (props: ISwitchbutton) => {
  const { title, onClick, focus } = props
  return (
    <button
      onClick={onClick}
      className={`  rounded-full px-3 py-[2px]`}
      style={{ backgroundColor: focus ? colors.gray[600] : '' }}
    >
      <T3 color={focus ? colors.gray[100] : colors.gray[300]} weight={FontWeightEnums.MEDIUM}>
        {title}
      </T3>
    </button>
  )
}

export const TokenChartHeader = (props: ITokenChartHeader) => {
  const { token, tokenPriceUSD, chart } = props
  const { currentChainInfo } = useChainLoader()
  // window.log.log(token)
  const tokenLogo = token && token.symbol ? getTokenLogoUrl(token.address, currentChainInfo.id) : ''
  const switchHeader = (chart: SwapChartEnums) => {
    switch (chart) {
      case SwapChartEnums.PRICE:
        return (
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-row items-center gap-[6px]">
              <div className="h-[14px] w-[14px] rounded-full] mr-1">
                <img className="rounded-full" src={tokenLogo} alt={token.symbol} />
              </div>
              <T1>Price</T1>
            </div>
            {tokenPriceUSD && <T2 color={colors.gray[300]}>${tokenPriceUSD.toFixed(2)}</T2>}
          </div>
        )
      case SwapChartEnums.TVL:
        return (
          <div className="flex  flex-row gap-[6px] items-center">
            <div className="h-[14px] w-[14px] rounded-full] mr-1">
              <img className="rounded-full" src={tokenLogo} alt={token.symbol} />
            </div>
            <T1>TVL</T1>
          </div>
        )
      case SwapChartEnums.VOLUME:
        return (
          <div className="flex  flex-row gap-[6px] items-center">
            <div className="h-[14px] w-[14px] rounded-full] mr-1">
              <img className="rounded-full" src={tokenLogo} alt={token.symbol} />
            </div>
            <T1>Volume</T1>
          </div>
        )
      default:
        return (
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-row items-center ">
              <div className="w-[14px] h-[14px] rounded-full bg-red-200"></div>
              <T1>Price</T1>
            </div>
            <T2 color={colors.gray[300]}>${tokenPriceUSD}</T2>
          </div>
        )
    }
  }

  return <div className="flex flex-col h-[48px]">{switchHeader(chart)}</div>
}
