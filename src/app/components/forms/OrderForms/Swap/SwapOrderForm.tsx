import { useChainLoader } from '../../../../route/RouteWrapper'
import { shouldPrioritizeToken0 } from '../../../../lib/shouldPrioritizeToken0'
import { formatNumberToString } from '../../../../util/formatNumbers'
import { useSwapPageContext } from '../../../../context/SwapPageContext'
import OrderBanners, { MinPendingBanner, OrderBannerEnums } from '../../../banners/OrderBanners'
import FlipButton from '../../../buttons/FlipButton/FlipButton'
import OrderButton from '../../../buttons/OrderButton'
import { IOrderSettings } from '../../../dropdown/OrderFormDropdown'
import SwapMarketOrderFormInput from '../../../inputs/SwapMarketOrderFormInput'
import BaseModal from '../../../modals/BaseModal'
import PriceInfo from './PriceInfo'
import { parseUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useBalance, useFeeData } from 'wagmi'
import { useNetworkContext } from '../../../../context/NetworkContext'
import { useSwapRouter } from '../../../../hooks/useSwapRouter'
import { ZERO_ADDRESS } from '../../../../constants/addresses'

export interface ISwapOrderForm {
  settings: IOrderSettings
  isSwap: boolean
}

function SwapOrderForm(props: ISwapOrderForm) {
  const { settings, isSwap } = props
  const { token0: token0Input, token1: token1Input, flip, setFlip } = useSwapPageContext()
  const { signer, provider } = useNetworkContext()
  const { currentChainInfo, currentChain } = useChainLoader()

  const {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    routeData,
    isFetchingPrice,
    setCurrentRequest,
    executeTrade,
    transactionPending: pending,
  } = useSwapRouter({ signer, chainInfo: currentChainInfo, provider })

  const { address } = useAccount()

  const fromTokenBalance = useBalance(
    fromToken.address === ZERO_ADDRESS
      ? {
          address: address,
          chainId: currentChain,
        }
      : {
          address: address,
          token: fromToken.address as `0x${string}`,
          chainId: currentChain,
        }
  )

  const toTokenBalance = useBalance(
    toToken.address === ZERO_ADDRESS
      ? {
          address: address,
          chainId: currentChain,
        }
      : {
          address: address,
          token: toToken.address as `0x${string}`,
          chainId: currentChain,
        }
  )

  const [loading0, setLoading0] = useState(false)
  const [loading1, setLoading1] = useState(false)

  const [txHash, setTxHash] = useState('')
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()

  const [focus, setFocus] = useState<string>('Sell')

  const { data: feeData } = useFeeData()

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
  const clearOrder = () => {
    setFromTokenValue('')
    setToTokenValue('')
    setLoading1(false)
    setLoading0(false)
  }

  useEffect(() => {
    let from = flip ? token1Input : token0Input
    let to = flip ? token0Input : token1Input
    setFromToken(from)
    setToToken(to)
  }, [token0Input, token1Input, flip])

  useEffect(() => {
    clearOrder()
  }, [flip])

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
      chain: currentChainInfo.network,
      tokenAmount: value,
      isExactIn: isExactIn,
      gasPrice: feeData?.gasPrice ? Number(feeData.gasPrice) : 0,
      slippage: slip[0],
    })
  }, [signer, focus, newValueTrigger])

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
    if (!routeData || !signer || !address) {
      return
    }
    await executeTrade()
  }

  return (
    <div className="flex flex-col">
      {pending && orderFormState === undefined && <MinPendingBanner />}
      <div className="flex flex-col relative">
        {fromToken && toToken && (
          <div className={`flex flex-1 relative ${isSwap ? 'flex-col' : 'flex-row'} gap-y-2 gap-x-2`}>
            <SwapMarketOrderFormInput
              value={fromTokenValue}
              setValue={setFromTokenValueFocus}
              token={fromToken}
              setToken={setFromToken}
              loading={loading1}
              action={'Sell'}
              setFocus={setFocus}
              focus={focus}
              flip={!flip}
              balance={fromTokenBalance.data}
            />
            <SwapMarketOrderFormInput
              value={toTokenValue}
              setValue={setToTokenValueFocus}
              token={toToken}
              setToken={setToToken}
              loading={loading0}
              action={'Buy'}
              setFocus={setFocus}
              disabled={false}
              focus={focus}
              flip={flip}
              balance={toTokenBalance.data}
            />
          </div>
        )}
        <div className="w-fit h-fit absolute right-0 left-1 top-0 bottom-0 mx-[auto] my-[auto]">
          <FlipButton onClick={() => setFlip((flip) => !flip)} isSwap={isSwap} />
        </div>
      </div>

      <PriceInfo
        perspectiveFlip={routeData ? !shouldPrioritizeToken0(fromToken.address, fromToken.address, currentChain) : true}
        loading={loading0 || loading1}
        token0={fromToken}
        token1={toToken}
        price={
          routeData
            ? formatNumberToString(
                routeData.outToken.address === toToken.address ? routeData.humanPrice : 1 / routeData.humanPrice
              )
            : '...'
        }
        priceImpact={routeData ? routeData.slippage.toFixed(4) : '0'}
        showGas
        isSwapPage={isSwap}
      />
      <div className="h-3"></div>
      <OrderButton
        orderAction={focus}
        onClick={onOrder}
        disabled={loading0 || loading1 || toTokenValue === '' || fromTokenValue === '' || !signer}
        loadingPrice={loading0 || loading1}
        insufficientFunds={
          flip
            ? toTokenBalance.data && parseFloat(toTokenValue) > parseFloat(toTokenBalance.data.formatted)
            : fromTokenBalance.data && parseFloat(fromTokenValue) > parseFloat(fromTokenBalance.data.formatted)
        }
        orderFormState={orderFormState}
        isEmpty={fromTokenValue === '' || toTokenValue === ''}
      />
      {orderFormState && orderFormState !== OrderBannerEnums.QUOTE_ERROR && (
        <BaseModal
          showModal={true}
          onClose={() => {
            setOrderFormState(undefined)
          }}
          showOverlay={true}
          offsetTop={window.innerHeight - 100}
          offsetRight={10}
        >
          <OrderBanners bannerState={orderFormState} setBannerState={setOrderFormState} transactionHash={txHash} />
        </BaseModal>
      )}
    </div>
  )
}

export default SwapOrderForm
