import { useChainLoader } from '../../../route/RouteWrapper'
import GasInfoTag from '../../tags/GasInfoTag'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useConfigContext } from '../../../context/naked/ConfigContext'
import { useTelemetryContext } from '../../../context/naked/TelemetryContext'
import { IToken } from '../../../lib/getToken'
import { FontWeightEnums } from '../../../types/Enums'
import { getPriceFromTick } from '../../../util/calculateTick'
import { formatNumberToString } from '../../../util/formatNumbers'
import { getTokenSymbol } from '../../../util/getTokenName'
import { CHAINLINK_LIMIT_ORDER_CONTRACT } from '../../../constants/addresses'
import { useDataContext } from '../../../context/DataContext'
import { useTrollboxContext } from '../../../context/TrollboxContext'
import { useUserOrderContext } from '../../../context/UserOrderContext'
import { createLimitOrderContract, minimumAssets, newOrder, poolToData } from '../../../contracts/limitOrder'
import { fetchV3Pool } from '../../../data/cush_getV3Pool'
import { recordTelemetry } from '../../../data/telemetry_record'
import OrderBanners, { MinPendingBanner, OrderBannerEnums } from '../../banners/OrderBanners'
import FlipButton from '../../buttons/FlipButton/FlipButton'
import LimitOrderButton from '../../buttons/LimitOrderButton'
import LimitOrderPriceInput from '../../inputs/LimitOrderPriceInput'
import { SkeletonLine } from '../../loadingStates/SkeletonLines'
import BaseModal from '../../modals/BaseModal'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { track } from '@multibase/js'
import { useEffect, useState } from 'react'
import { erc20ABI, useBalance } from 'wagmi'
import { useNetworkContext } from '../../../context/NetworkContext'
import LimitOrderFormInput from '../../inputs/LimitOrderFormInput'
import { Address, getContract, maxInt256, parseUnits } from 'viem'
import { getErc20 } from '../../../../generated'

export interface IMinToken {
  amount: number
  token: IToken
}

function LimitOrderForm() {
  const [order, updateOrder] = useState({
    token0: '',
    token1: '',
    tokenUpdated: '',
  })

  const [percent, setPercent] = useState('0')
  const { currentChain } = useChainLoader()
  const { currentChainInfo } = useChainLoader()
  const [focus, setFocus] = useState<string>('Sell')
  const { poolAddress, token0, token1, blockNumber, token } = useDataContext()
  const { getAndSetAllUserOrders } = useUserOrderContext()
  const [loading0, setLoading0] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { cushRpc } = useChainLoader()
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()
  const [txHash, setTxHash] = useState('')
  const { signer, provider } = useNetworkContext()
  const [isPreferredTokenOrder, setIsPreferredTokenOrder] = useState(false)
  const [tick, setTick] = useState<null | number>(null)
  const [minToken, setMinToken] = useState<undefined | IMinToken>(undefined)
  const [isValidPool, setIsValidPool] = useState<boolean | undefined>()
  const [priceEntered, setPriceEntered] = useState(false)
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const [pending, setPending] = useState(false)
  const { maximized, trollboxX } = useTrollboxContext()

  const balanceToken0 = useBalance({
    address: signer?.account.address,
    token: token0.address as `0x${string}`,
    chainId: currentChain,
  })

  const balanceToken1 = useBalance({
    address: signer?.account.address,
    token: token1.address as `0x${string}`,
    chainId: currentChain,
  })

  const LimitOrder = async (tokenA: IToken, tokenA_Amount: string, isPreferredTokenOrder: boolean) => {
    const direction = !isPreferredTokenOrder
    if (!(provider && signer && tick)) {
      return
    }
    const spender = CHAINLINK_LIMIT_ORDER_CONTRACT(currentChain) as `0x${string}`
    const tokenAddress = tokenA.address
    const contractA = getContract({
      address: tokenA.address as Address,
      abi: erc20ABI,
      publicClient: provider,
      walletClient: signer,
    })
    //Get Allowance get
    const erc20Contract = getErc20({
      walletClient: signer,
      address: tokenAddress,
      chainId: signer.chain?.id,
    })
    const allowance = await erc20Contract.read.allowance([signer.account.address, spender])
    const amount = parseUnits(tokenA_Amount, tokenA.decimals)
    let allowanceIsEnough = allowance >= amount //Done
    while (!allowanceIsEnough) {
      setOrderFormState(OrderBannerEnums.TOKEN_APPROVAL)
      const approveHash = await contractA.write.approve([CHAINLINK_LIMIT_ORDER_CONTRACT(currentChain), maxInt256], {
        chain: signer.chain,
      })
      setTxHash(approveHash)
      setOrderFormState(OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS)
      setPending(true)
      await provider.waitForTransactionReceipt({ hash: approveHash })
      setPending(false)
      setOrderFormState(OrderBannerEnums.TOKEN_APPROVED)
      const allowance = await erc20Contract.read.allowance([signer.account.address, spender])
      allowanceIsEnough = allowance >= amount
    }

    const { tick_spacing: tickSpacing } = await fetchV3Pool(cushRpc, {
      pool_address: poolAddress!,
      block_number: blockNumber,
    })

    const targetTick = tick
    try {
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE)
      const newOrderTx = await newOrder({
        pool: poolAddress!,
        amount,
        targetTick: targetTick,
        direction: direction,
        signer,
        provider,
        chain: currentChain,
        tickSpacing,
      })

      setTxHash(newOrderTx)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS)
      setPending(true)
      const newOrderRecipt = await provider.waitForTransactionReceipt({ hash: newOrderTx })
      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentChain,
          'trade',
          'create_limit_order',
          signer.account.address,
          newOrderRecipt.transactionHash,
          {}
        )
      }
      track('create_limit_order', { chain: currentChainInfo.name, pool: poolAddress })
      setPending(false)
      setTxHash(newOrderRecipt.transactionHash)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE_SUCCESS)
      setTimeout(() => {
        getAndSetAllUserOrders(signer.account.address)
      }, 5000)
      updateOrder({ token0: '', token1: '', tokenUpdated: '' })
      setTick(null)
    } catch (e) {
      const error = e
      setPending(false)
      window.log.error(error)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE_ERROR)
      //TODO: figure out if we actually want this. there is no txn. why would they care about the fake hash?
      //setTxHash(error.transactionHash)
    }
  }

  const onOrderChange = (value: string, tokenChanged: IToken) => {
    if (tick && token0 && token1) {
      const floatValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value)
      let floatPrice = getPriceFromTick(tick, token0?.decimals, token1?.decimals, token.selected !== 0)
      if (token0 && tokenChanged.address === token0.address) {
        const newCalculatedValue = token.selected === 0 ? floatValue / floatPrice : floatValue * floatPrice
        updateOrder({
          token0: newCalculatedValue === 0 ? '' : value,
          token1: isNaN(newCalculatedValue) || newCalculatedValue === 0 ? '' : formatNumberToString(newCalculatedValue),
          tokenUpdated: tokenChanged.address,
        })
      } else {
        const newCalculatedValue = token.selected === 0 ? floatValue * floatPrice : floatValue / floatPrice
        updateOrder({
          token0: isNaN(newCalculatedValue) || newCalculatedValue === 0 ? '' : formatNumberToString(newCalculatedValue),
          token1: newCalculatedValue === 0 ? '' : value,
          tokenUpdated: tokenChanged.address,
        })
      }
    } else {
      tokenChanged.address === token0.address
        ? updateOrder({
            token0: value,
            token1: '',
            tokenUpdated: tokenChanged.address,
          })
        : updateOrder({
            token1: value,
            token0: '',
            tokenUpdated: tokenChanged.address,
          })
    }
  }

  const onPriceChange = (value: number) => {
    if (token0 && token1) {
      const floatPrice = getPriceFromTick(value, token0?.decimals, token1?.decimals, token.selected !== 0)
      // need to know if pool is toggled here so i can flip pricing to be in terms of other token
      let newBuyAmount: number
      if (floatPrice > 0) {
        if (token1.address === order.tokenUpdated) {
          if (token.selected === 0) {
            window.log.log(1)
            newBuyAmount = parseFloat(order.token1) * floatPrice
            updateOrder({
              token0: isNaN(newBuyAmount) ? '' : newBuyAmount.toString(),
              token1: order.token1,
              tokenUpdated: order.tokenUpdated,
            })
          } else {
            window.log.log(2)
            newBuyAmount = parseFloat(order.token1) / floatPrice
            updateOrder({
              token0: isNaN(newBuyAmount) ? '' : newBuyAmount.toString(),
              token1: order.token1,
              tokenUpdated: order.tokenUpdated,
            })
          }
        } else {
          if (token.selected === 0) {
            window.log.log(3)
            newBuyAmount = parseFloat(order.token0) / floatPrice
            updateOrder({
              token1: isNaN(newBuyAmount) ? '' : newBuyAmount.toString(),
              token0: order.token0,
              tokenUpdated: order.tokenUpdated,
            })
          } else {
            window.log.log(4)
            newBuyAmount = parseFloat(order.token0) * floatPrice
            updateOrder({
              token1: isNaN(newBuyAmount) ? '' : newBuyAmount.toString(),
              token0: order.token0,
              tokenUpdated: order.tokenUpdated,
            })
          }
        }
      }
    }
  }

  const onPriceEntered = (value: string) => {
    if (value !== '') {
      setPriceEntered(true)
    } else {
      setPriceEntered(false)
    }
  }

  useEffect(() => {
    if (!(balanceToken0.data && balanceToken1.data)) {
      return
    }
    if (token.selected === 0) {
      if (isPreferredTokenOrder) {
        setPercent(
          (
            (100 * parseFloat(order.token1 === '' ? '0' : order.token1)) /
            parseFloat(balanceToken1.data?.formatted)
          ).toString()
        )
      } else {
        setPercent(
          (
            (100 * parseFloat(order.token0 === '' ? '0' : order.token0)) /
            parseFloat(balanceToken0.data?.formatted)
          ).toString()
        )
      }
    } else {
      if (isPreferredTokenOrder) {
        setPercent(
          (
            (100 * parseFloat(order.token1 === '' ? '0' : order.token1)) /
            parseFloat(balanceToken1.data?.formatted)
          ).toString()
        )
      } else {
        setPercent(
          (
            (100 * parseFloat(order.token0 === '' ? '0' : order.token0)) /
            parseFloat(balanceToken0.data?.formatted)
          ).toString()
        )
      }
    }
  }, [order])

  useEffect(() => {
    if (tick) {
      onPriceChange(tick)
    }
  }, [tick])

  useEffect(() => {
    setIsPreferredTokenOrder(true)
    updateOrder({ token0: '', token1: '', tokenUpdated: '' })
    setPercent('0')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token.selected])

  useEffect(() => {
    updateOrder({ token0: '', token1: '', tokenUpdated: '' })
    setPercent('0')
    setTick(null)
  }, [poolAddress])

  useEffect(() => {
    if (poolAddress && provider && currentChain)
      poolToData({ pool: poolAddress, provider, chain: currentChain }).then((res) => {
        if (res[4] === 0) {
          setIsValidPool(false)
        } else {
          setIsValidPool(true)
        }
      })
  }, [poolAddress, signer, currentChain])

  useEffect(() => {
    if (!(token0 && token1 && provider && currentChain)) {
      return
    }
    const chosenToken = isPreferredTokenOrder ? token1 : token0
    minimumAssets({ tokenAddress: chosenToken.address, provider, chain: currentChain })
      .then((amount) => {
        setMinToken({ token: chosenToken, amount: Number(amount.toString()) / 10 ** chosenToken.decimals })
      })
      .catch((err) => {
        window.log.log(err)
        setMinToken(undefined)
      })
  }, [poolAddress, provider, signer, currentChain, isPreferredTokenOrder, token0, token1])

  return (
    <div className="flex flex-col justify-between flex-1">
      {pending && orderFormState === undefined && <MinPendingBanner />}
      <div className="flex flex-col gap-2">
        <div className="relative">
          {isValidPool && minToken && minToken.token ? (
            <div className="flex flex-row gap-1.5 absolute right-2 -top-8">
              <T3 weight={FontWeightEnums.SEMIBOLD} color={colors.white}>
                {' '}
                Minimum order size is {minToken?.amount}{' '}
              </T3>
              <img
                src={minToken?.token.logoURI}
                width={14}
                height={14}
                alt={getTokenSymbol(minToken.token.address, minToken.token.symbol, currentChainInfo.id)!}
              />
              <T3 weight={FontWeightEnums.SEMIBOLD} color={colors.white}>
                {getTokenSymbol(minToken.token.address, minToken.token.symbol, currentChainInfo.id)!}{' '}
              </T3>
            </div>
          ) : (
            <InformationCircleIcon width={20} stroke={colors.red[500]} className="absolute right-2 -top-8" />
          )}
        </div>
        <div className="relative grid grid-cols-2">
          <div className="w-fit  h-fit absolute flex right-0 left-0 top-0 bottom-0  mx-[auto] my-[auto] text-white">
            <FlipButton
              onClick={() => {
                updateOrder({ token0: '', token1: '', tokenUpdated: '' })
                setIsPreferredTokenOrder(!isPreferredTokenOrder)
              }}
            />
          </div>
          {token0 && token1 ? (
            <>
              <LimitOrderFormInput
                token={isPreferredTokenOrder ? token1 : token0}
                loading={isPreferredTokenOrder ? loading0 : loading1}
                orderInput={isPreferredTokenOrder ? order.token1 : order.token0}
                setOrderInput={onOrderChange}
                action={'Sell'}
                setFocus={setFocus}
                disabled={false}
                focus={focus}
                balance={isPreferredTokenOrder ? balanceToken1.data : balanceToken0.data}
              />
              <LimitOrderFormInput
                token={isPreferredTokenOrder ? token0 : token1}
                loading={isPreferredTokenOrder ? loading1 : loading0}
                orderInput={isPreferredTokenOrder ? order.token0 : order.token1}
                setOrderInput={onOrderChange}
                action={'Buy'}
                setFocus={setFocus}
                disabled={false}
                focus={focus}
                balance={isPreferredTokenOrder ? balanceToken0.data : balanceToken1.data}
              />
            </>
          ) : (
            <>
              <SkeletonLine />
              <SkeletonLine />
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 pt-2 text-white">
          {token0 && token1 ? (
            <LimitOrderPriceInput
              tick={tick}
              setTick={setTick}
              onPriceEntered={onPriceEntered}
              isPreferredTokenOrder={isPreferredTokenOrder}
              disabled={!isValidPool}
            />
          ) : (
            <SkeletonLine />
          )}
        </div>
      </div>

      <div className="flex flex-col ">
        <div
          className="w-full border-[1px] rounded-[10px] p-3 mb-2 flex flex-col gap-y-1 justify-between "
          style={{ borderColor: colors.gray[700] }}
        >
          <div className="flex justify-between">
            <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
              Gas:
            </T3>

            <GasInfoTag fontSize={12} fontColor={colors.gray[50]} />
          </div>
        </div>

        <LimitOrderButton
          orderAction={focus}
          isValidPool={isValidPool}
          priceEntered={priceEntered}
          onClick={() => {
            token0 &&
              token1 &&
              LimitOrder(
                isPreferredTokenOrder ? token1 : token0,
                isPreferredTokenOrder ? order.token1 : order.token0,
                isPreferredTokenOrder
              )
          }}
          minToken={minToken}
          order={order}
          isTransactionPending={orderFormState === OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS}
          isApprovalPending={orderFormState === OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS}
          isPreferredTokenOrder={isPreferredTokenOrder}
          balance0={Number(balanceToken0.data?.value) / 10 ** (token0 ? token0.decimals : 18)}
          balance1={Number(balanceToken1.data?.value) / 10 ** (token1 ? token1.decimals : 18)}
          isEmpty={order.token0 === '' || order.token1 === ''}
          orderFormState={orderFormState}
        />
      </div>

      {orderFormState && (
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
}

export default LimitOrderForm
