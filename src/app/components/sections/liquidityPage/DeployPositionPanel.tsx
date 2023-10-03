import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T3, T4 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useConfigContext } from '../../../context/naked/ConfigContext'
import { useTelemetryContext } from '../../../context/naked/TelemetryContext'
import { useDebounce } from '../../../hooks/useDebounce'
import { FontWeightEnums } from '../../../types/Enums'
import { getTokenSymbol } from '../../../util/getTokenName'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../../../constants/addresses'
import { useDataContext } from '../../../context/DataContext'
import { usePositionMakerContext } from '../../../context/PositionMakerContext'
import { useUserOrderContext } from '../../../context/UserOrderContext'
import { addLiquidity } from '../../../contracts/addLiquidity'
import { deployPosition } from '../../../contracts/deployPosition'
import { removeLiquidity } from '../../../contracts/removeLiquidity'
import { recordTelemetry } from '../../../data/telemetry_record'
import OrderBanners, { MinPendingBanner, OrderBannerEnums } from '../../banners/OrderBanners'
import ClearAllButton from '../../buttons/ClearAllButton'
import DeployPositionButton from '../../buttons/DeployPositionButton'
import { maxTick as MAX_TICK, minTick as MIN_TICK } from '../../charts/charts/liquidityChart/constants'
import { useChartDataContext } from '../../charts/context/ChartDataContext'
import { SkeletonLine, SkeletonLines } from '../../loadingStates/SkeletonLines'
import BaseModal from '../../modals/BaseModal'
import OrderFormSlider from '../../sliders/OrderFormSlider'
import { BackTest } from './BackTest'
import { TokenInput } from './TokenInput'
import { Trans } from '@lingui/macro'
import { track } from '@multibase/js'
import { useEffect, useState } from 'react'
import { useAccount, useBalance, usePublicClient } from 'wagmi'
import { useNetworkContext } from '../../../context/NetworkContext'
import { Hex, formatUnits, parseUnits } from 'viem'
import { calculateRequiredTokenAmount } from '../../../util/constructPosition'

function DeployPositionPanel() {
  const [disabled, setDisabled] = useState(false)
  const [lastInputIs0, setLastInputIs0] = useState<boolean>(false)
  const [isInsufficientT0, setIsInsufficientT0] = useState<boolean>(false)
  const [isInsufficientT1, setIsInsufficientT1] = useState<boolean>(false)
  const [isTransactionPending, setIsTransactionPending] = useState<boolean>(false)

  const { token0, token1, poolSummary, liquidityChart } = useDataContext()
  const { address } = useAccount()
  const { currentChain, currentChainInfo } = useChainLoader()
  const provider = usePublicClient({ chainId: currentChainInfo.id })

  const { signer } = useNetworkContext()
  const { highlightBounds, setHighlightBounds, setClear } = useChartDataContext()

  const { getAndSetCurrentPositions } = useUserOrderContext()
  const [pending, setPending] = useState(false)
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()
  const [txHash, setTxHash] = useState('')
  const {
    editPosition,
    setEditPosition,
    updatePosition,
    setUpdatePosition,
    setSlidePercent,
    slidePercent,
    position,
    inputToken0,
    inputToken1,
    setInputToken0,
    setInputToken1,
    setLastInput,
    lastInput,
  } = usePositionMakerContext()
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const debouncedInputToken0 = useDebounce({ value: inputToken0, delay: 1000 })

  const balanceToken0 = useBalance({
    address: address,
    token: token0.address as `0x${string}`,
    chainId: currentChain,
  })

  const balanceToken1 = useBalance({
    address: address,
    token: token1.address as `0x${string}`,
    chainId: currentChain,
  })

  const [currentTick, setCurrentTick] = useState<number | null>(null)

  useEffect(() => {
    const tick = liquidityChart ? liquidityChart.current_pool_tick : null
    setCurrentTick(tick)
  }, [liquidityChart])

  useEffect(() => {
    if (!position || !token0 || !token1) return
    const token0Amount = formatUnits(BigInt(position.current_position_values.amount0_current), token0.decimals)
    const token1Amount = formatUnits(BigInt(position.current_position_values.amount1_current), token1.decimals)
    setInputToken0(((Number(token0Amount) * parseFloat(slidePercent)) / 100).toString())
    setInputToken1(((Number(token1Amount) * parseFloat(slidePercent)) / 100).toString())
  }, [slidePercent, updatePosition, position, token0, token1])

  useEffect(() => {
    if (!position || !token0) return
    const token0PositionAmount = formatUnits(
      BigInt(position.current_position_values.amount0_current),
      position.position_pool_data.token0_decimals
    )
    const token0Amount = ((Number(token0PositionAmount) * Number(slidePercent)) / 100).toFixed(token0.decimals)
    setNewPositionAmounts(token0Amount, true)
  }, [slidePercent])

  useEffect(() => {
    if (!position || !editPosition) return
    if (updatePosition) {
      const token0PositionAmount = formatUnits(
        BigInt(position.current_position_values.amount0_current),
        position.position_pool_data.token0_decimals
      )
      const percent = (Number(inputToken0) * 100) / Number(token0PositionAmount)
      if (Number(inputToken0) > Number(token0PositionAmount)) {
        setUpdatePosition(false)
      }
      setSlidePercent(percent.toString())
    }
  }, [debouncedInputToken0])

  useEffect(() => {
    setLastInput('')
    setInputToken0('')
    setInputToken1('')
    setSlidePercent('0')
  }, [updatePosition])

  useEffect(() => {
    let doesNotHaveBothAmountsIfNeeded = false
    if (highlightBounds && currentTick) {
      const maxTick = Math.max(highlightBounds.upper, highlightBounds.lower)
      const minTick = Math.min(highlightBounds.upper, highlightBounds.lower)

      if (minTick < currentTick && maxTick > currentTick) {
        doesNotHaveBothAmountsIfNeeded = inputToken0 === '' || inputToken1 === ''
      }
    }
    setNewPositionAmounts(lastInput, lastInputIs0)
    setDisabled(
      currentTick === null ||
        !address ||
        !token0 ||
        !token1 ||
        !poolSummary ||
        !highlightBounds ||
        (inputToken0 === '' && inputToken1 === '') ||
        doesNotHaveBothAmountsIfNeeded
    )
  }, [address, token0, token1, inputToken0, inputToken1, poolSummary, highlightBounds, currentTick])

  const setNewPositionAmounts = function (tokenAmount: string, isToken0: boolean) {
    if (!currentTick || !token0 || !token1) return
    let maxTick = MAX_TICK
    let minTick = MIN_TICK
    if (highlightBounds) {
      maxTick = Math.max(highlightBounds.lower, highlightBounds.upper)
      minTick = Math.min(highlightBounds.lower, highlightBounds.upper)
    }

    let token0Amount = inputToken0
    let token1Amount = inputToken1
    if (tokenAmount === '') {
      token0Amount = ''
      token1Amount = ''
    } else if (minTick < currentTick && maxTick > currentTick) {
      const delta = calculateRequiredTokenAmount(
        minTick,
        maxTick,
        currentTick,
        isToken0,
        tokenAmount,
        isToken0 ? token0 : token1
      )
      isToken0 ? (token0Amount = tokenAmount) : (token1Amount = tokenAmount)
      isToken0
        ? (token1Amount = formatUnits(BigInt(delta), token1.decimals))
        : (token0Amount = formatUnits(BigInt(delta), token0.decimals))
    }
    if (maxTick < currentTick) {
      token0Amount = ''
      if (!isToken0) token1Amount = tokenAmount
    }
    if (minTick > currentTick) {
      token1Amount = ''
      if (isToken0) token0Amount = tokenAmount
    }
    if (isToken0) {
      const balance = parseFloat(
        formatUnits(BigInt(balanceToken0.data ? balanceToken0.data.value : 0), token0.decimals)
      )
      if (Number(token0Amount) > balance) {
        setIsInsufficientT0(true)
      } else {
        setIsInsufficientT0(false)
      }
    } else {
      const balance = parseFloat(
        formatUnits(BigInt(balanceToken1.data ? balanceToken1.data.value : 0), token1.decimals)
      )
      if (Number(token1Amount) > balance) {
        setIsInsufficientT1(true)
      } else {
        setIsInsufficientT1(false)
      }
    }
    setInputToken0(token0Amount)
    setInputToken1(token1Amount)
    setLastInput(tokenAmount)
    setLastInputIs0(isToken0)
  }

  const clearAll = () => {
    setEditPosition(false)
    setHighlightBounds(undefined)
    setClear(true)
    setLastInput('')
    setInputToken0('')
    setInputToken1('')
    setSlidePercent('0')
  }

  const onClickHandler = async () => {
    if (!signer || !highlightBounds || !token0 || !token1) return

    try {
      let transaction: Hex
      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION)
      setIsTransactionPending(true)
      if (!editPosition) {
        transaction = await deployPosition({
          user_address: address!,
          token0: token0,
          token1: token1,
          token0Amount: inputToken0 === '' ? BigInt('0') : parseUnits(inputToken0, token0.decimals),
          token1Amount: inputToken1 === '' ? BigInt('0') : parseUnits(inputToken1, token1.decimals),
          pool_address: poolSummary.address as `0x${string}`,
          provider,
          signer,
          tick: highlightBounds,
          currentChain: currentChain,
        })
      } else if (editPosition && !updatePosition && position) {
        transaction = await addLiquidity({
          positionId: position.tokenId!,
          user_address: address!,
          token0: token0,
          token1: token1,
          token0Amount: inputToken0 === '' ? BigInt('0') : parseUnits(inputToken0, token0.decimals),
          token1Amount: inputToken1 === '' ? BigInt('0') : parseUnits(inputToken1, token1.decimals),
          pool_address: poolSummary.address as `0x${string}`,
          provider,
          signer,
          tick: highlightBounds,
          currentChain: currentChain,
        })
      } else if (editPosition && updatePosition && position) {
        transaction = await removeLiquidity({
          contract: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChain),
          positionId: position.tokenId!,
          user_address: address!,
          provider,
          signer,
          removePercent: parseFloat(slidePercent), // TODO CHECK percent value
        })
      } else {
        setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_ERROR)
        return
      }

      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_IN_PROGRESS)
      setPending(true)
      const deployReceipt = await provider.waitForTransactionReceipt({ hash: transaction })
      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentChain,
          'liqudiity',
          'deploy_position',
          address!,
          deployReceipt.transactionHash,
          {}
        )
      }
      track('deploy_position', {
        chain: currentChainInfo.name,
        pool: poolSummary.address,
        transaction: deployReceipt.transactionHash,
      })
      // TODO: check the deployReceipt

      setPending(false)
      setTxHash(deployReceipt.transactionHash)
      if (deployReceipt.status !== 'reverted') {
        setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_SUCCESS)
      } else {
        setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_ERROR)
      }
      setTimeout(() => {
        getAndSetCurrentPositions(address!)
      }, 5000)

      await balanceToken0.refetch()
      await balanceToken1.refetch()
    } catch (err) {
      const error = err
      setPending(false)
      //TODO: again, determine if this is even real... a reverted txn wont reject the promise, so.
      ///     setTxHash(transactionHash)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_ERROR)
    } finally {
      setIsTransactionPending(false)
    }
  }

  return (
    <div className="h-full px-3 pt-3 pb-1 bg-[#0E0E0E] rounded-[16px] border-[1px] border-[#141B2B] flex flex-col gap-3">
      {pending && orderFormState === undefined && <MinPendingBanner />}
      <div className="flex flex-row justify-between">
        {!editPosition ? (
          <T3>Deploy Position</T3>
        ) : !updatePosition ? (
          <T3>Increase Position</T3>
        ) : (
          <T3>Decrease Position</T3>
        )}
        <ClearAllButton onClick={clearAll} />
      </div>
      <div className="flex flex-col gap-2">
        <T4 weight={FontWeightEnums.REGULAR} color={colors.gray[400]}>
          <Trans>Enter amount</Trans>
        </T4>
        {token0 && token1 ? (
          <div className="flex flex-col gap-2">
            <TokenInput
              value={inputToken0}
              setLastInput={setNewPositionAmounts}
              tokenSymbol={getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)}
              token={token0}
              isToken0={true}
            />
            <TokenInput
              value={inputToken1}
              setLastInput={setNewPositionAmounts}
              tokenSymbol={getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)}
              token={token1}
            />
          </div>
        ) : (
          <SkeletonLines lines={2} />
        )}

        <div className="flex flex-col gap-[13px]">
          {
            <div
              className="py-3 pr-3 pl-2 rounded-[12px] border-[1px] flex flex-col gap-1"
              style={{ borderColor: colors.gray[700] }}
            >
              <div className="flex flex-row justify-between">
                <T4 weight={FontWeightEnums.REGULAR} color={colors.gray[400]}>
                  {getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)} balance:
                </T4>
                {token0 ? (
                  <T4>
                    <FormatNumber
                      num={parseFloat(
                        formatUnits(BigInt(balanceToken0.data ? balanceToken0.data.value : 0), token0.decimals)
                      )}
                    />
                  </T4>
                ) : (
                  <SkeletonLine />
                )}
              </div>
              <div className="flex flex-row justify-between">
                <T4 weight={FontWeightEnums.REGULAR} color={colors.gray[400]}>
                  {getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)} balance:
                </T4>
                {token1 ? (
                  <T4>
                    <FormatNumber
                      num={parseFloat(
                        formatUnits(BigInt(balanceToken1.data ? balanceToken1.data.value : 0), token1.decimals)
                      )}
                    />
                  </T4>
                ) : (
                  <SkeletonLine />
                )}
              </div>
            </div>
          }
          {editPosition && updatePosition && (
            <div className="flex flex-col gap-[13px] w-full">
              <OrderFormSlider percent={slidePercent} setPercent={setSlidePercent} />
            </div>
          )}

          <BackTest
            inputToken0={inputToken0}
            inputToken1={inputToken1}
            poolSummary={poolSummary}
            tick={highlightBounds}
            token0={token0!}
            token1={token1!}
          />
          <DeployPositionButton
            onClick={onClickHandler}
            disabled={disabled}
            isInsufficientT0={isInsufficientT0}
            isInsufficientT1={isInsufficientT1}
            isTransactionPending={isTransactionPending}
            token0={token0!}
            token1={token1!}
          />
        </div>
      </div>
      {orderFormState && (
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

export default DeployPositionPanel
