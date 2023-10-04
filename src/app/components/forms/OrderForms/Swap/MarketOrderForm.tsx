import { useChainLoader } from '../../../../route/RouteWrapper'
import { formatNumberToString } from '../../../../util/formatNumbers'
import { useDataContext } from '../../../../context/DataContext'
import { useTrollboxContext } from '../../../../context/TrollboxContext'
import { IMarketOrderForm } from '../../../../contracts/marketOrder'
import OrderBanners, { MinPendingBanner, OrderBannerEnums } from '../../../banners/OrderBanners'
import FlipButton from '../../../buttons/FlipButton/FlipButton'
import OrderButton from '../../../buttons/OrderButton'
import MarketOrderFormInput from '../../../inputs/MarketOrderFormInput'
import BaseModal from '../../../modals/BaseModal'
import PriceInfo from './PriceInfo'
import { parseUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { useBalance, useFeeData, useNetwork } from 'wagmi'
import { useNetworkContext } from '../../../../context/NetworkContext'
import { useSwapRouter } from '../../../../hooks/useSwapRouter'
import { useCountdownRefresh } from '../../../../hooks/useCountdownRefresh'
import { FiRefreshCw } from 'react-icons/fi'

function MarketOrderForm(props: IMarketOrderForm) {
  const { settings } = props
  const [flip, setFlip] = useState(true)
  const { chain } = useNetwork()
  const [loading0, setLoading0] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()
  const [insufficientFunds, setInsufficientFund] = useState<boolean | undefined>(undefined)
  const { currentChainInfo } = useChainLoader()
  const { maximized, trollboxX } = useTrollboxContext()
  const { provider, signer } = useNetworkContext()
  const { data: feeData } = useFeeData()

  const { count, countEnabled, countTriggered, setCountEnabled } = useCountdownRefresh({ initialCountDown: 15 })

  const {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    routeData,
    isFetchingPrice,
    inExecution,
    setCurrentRequest,
    executeTrade,
    currentTransaction: txHash,
    transactionPending: pending,
  } = useSwapRouter({
    signer,
    provider,
    chainInfo: currentChainInfo,
  })

  const { token1: token1Input, token0: token0Input, token, poolAddress } = useDataContext()

  useEffect(() => {
    let from = flip ? token1Input : token0Input
    let to = flip ? token0Input : token1Input
    setFromToken(from)
    setToToken(to)
  }, [token0Input, token1Input, flip])

  useEffect(() => {
    setCurrentRequest(undefined)
  }, [poolAddress])

  const [fromTokenValue, setFromTokenValue] = useState('')
  const [toTokenValue, setToTokenValue] = useState('')
  const [newValueTrigger, setNewValueTrigger] = useState(0)
  const setFromTokenValueFocus = (x: string) => {
    setFromTokenValue(x)
    setNewValueTrigger(newValueTrigger + 1)
  }
  const setToTokenValueFocus = (x: string) => {
    setToTokenValue(x)
    setNewValueTrigger(newValueTrigger + 1)
  }

  const [focus, setFocus] = useState<string>('Sell')
  const fromTokenBalance = useBalance({
    address: signer?.account.address,
    token: fromToken.address as `0x${string}`,
    chainId: chain?.id,
    watch: true,
  })

  const toTokenBalance = useBalance({
    address: signer?.account.address,
    token: toToken.address as `0x${string}`,
    chainId: chain?.id,
    watch: true,
  })

  const clearOrder = () => {
    setFromTokenValue('')
    setToTokenValue('')
    setLoading1(false)
    setLoading0(false)
  }

  useEffect(() => {
    clearOrder()
  }, [flip])

  useEffect(() => {
    setInsufficientFund(
      fromTokenBalance.data && parseFloat(fromTokenValue) > parseFloat(fromTokenBalance.data.formatted)
    )
  }, [flip, fromTokenValue, toTokenValue])

  useEffect(() => {
    const isExactIn = focus === 'Sell'
    const value = isExactIn ? fromTokenValue : toTokenValue
    if (value === '') {
      clearOrder()
      return
    }
    if (value === '0.' || value === '0' || value === '.') {
      return
    }
    const decimalCount = isExactIn ? fromToken.decimals : toToken.decimals
    const tokenAmount = parseUnits(Number(value).toFixed(decimalCount), decimalCount)
    if (tokenAmount.isZero()) {
      return
    }

    const slip = [Math.floor(100 * settings.slippage), 10000]

    setCurrentRequest({
      chain: currentChainInfo.internalName,
      tokenAmount: value,
      isExactIn: isExactIn,
      gasPrice: feeData?.gasPrice ? Number(feeData.gasPrice) : 0,
      slippage: slip[0],
    })
  }, [focus, newValueTrigger, countTriggered])

  useEffect(() => {
    if (!routeData) {
      return
    }
    setFromTokenValue(routeData.inAmount)
    setToTokenValue(routeData.outAmount)
  }, [routeData])

  useEffect(() => {
    const isExactIn = focus === 'Sell'
    if (isFetchingPrice) {
      const currentLoader = isExactIn ? setLoading0 : setLoading1
      currentLoader(true)
    } else {
      setLoading1(false)
      setLoading0(false)
    }
  }, [isFetchingPrice, focus])

  const onOrder = async () => {
    if (!routeData || !signer || !provider) {
      return
    }
    await executeTrade()
  }

  return (
    token && (
      <div className="flex flex-col gap-2">
        {pending && orderFormState === undefined && <MinPendingBanner />}
        <div className="relative grid grid-cols-2">
          <div className="w-fit h-fit absolute flex right-0 left-0 top-0 bottom-0  mx-[auto] my-[auto] text-white">
            <FlipButton onClick={() => setFlip(!flip)} />
          </div>
          {
            <>
              <MarketOrderFormInput
                value={fromTokenValue}
                setValue={setFromTokenValueFocus}
                token={fromToken}
                loading={loading1}
                action={'Sell'}
                setFocus={setFocus}
                disabled={false}
                focus={focus}
                balance={fromTokenBalance.data}
              />
              <MarketOrderFormInput
                value={toTokenValue}
                setValue={setToTokenValueFocus}
                token={toToken}
                loading={loading0}
                action={'Buy'}
                setFocus={setFocus}
                disabled={false}
                focus={focus}
                balance={toTokenBalance.data}
              />
            </>
          }
        </div>
        <PriceInfo
          perspectiveFlip={token.selected === 1}
          loading={isFetchingPrice}
          token0={fromToken}
          token1={toToken}
          price={
            routeData
              ? formatNumberToString(
                  token.selected === 0
                    ? flip
                      ? routeData.humanPrice
                      : 1 / routeData.humanPrice
                    : flip
                    ? 1 / routeData.humanPrice
                    : routeData.humanPrice
                )
              : '...'
          }
          priceImpact={routeData ? routeData.slippage.toFixed(4) : '0'}
          showGas
        />
        <div className="grid grid-cols-4 gap-2 justify-center items-center">
          <div className="col-span-3">
            <OrderButton
              orderAction={focus}
              onClick={onOrder}
              disabled={inExecution || loading0 || loading1 || fromTokenValue === '' || toTokenValue === '' || !signer}
              loadingPrice={loading0 || loading1}
              insufficientFunds={insufficientFunds}
              orderFormState={orderFormState}
              isEmpty={fromTokenValue === '' || toTokenValue === ''}
            />
          </div>
          <div className="flex items-center text-[16px] bg-gray-900 border-[1px] w-full border-gray-600 rounded-[8px] justify-center h-[38px] col-span-1">
            <div title="Auto Refresh" className="">
              <span className="text-white text-[18px]  px-2">{countEnabled ? count + 's' : '...'}</span>
            </div>
            <div
              className="items-center col-span-1"
              onClick={() => {
                setCountEnabled(!countEnabled)
              }}
            >
              <FiRefreshCw
                title="Auto Refresh"
                className={`${countEnabled ? 'text-green-400' : 'text-gray-500'} text-xl`}
              />
            </div>
          </div>
        </div>
        {orderFormState && orderFormState !== OrderBannerEnums.QUOTE_ERROR && (
          <BaseModal
            showModal={true}
            onClose={() => {
              setOrderFormState(undefined)
            }}
            showOverlay={true}
            offsetTop={window.innerHeight - (maximized && trollboxX > -340 ? 550 : 120)}
            offsetRight={10}
          >
            <OrderBanners bannerState={orderFormState} setBannerState={setOrderFormState} transactionHash={txHash} />
          </BaseModal>
        )}
      </div>
    )
  )
}

export default MarketOrderForm
