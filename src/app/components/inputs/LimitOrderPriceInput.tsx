import { useChainLoader } from '../../route/RouteWrapper'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useDebounce } from '../../hooks/useDebounce'
import { FontWeightEnums } from '../../types/Enums'
import { getNearestTick, getPriceFromTick, getTickFromPrice, getTickSpacing } from '../../util/calculateTick'
import { convertFromSciNot } from '../../util/formatNumbers'
import { getTokenSymbol } from '../../util/getTokenName'
import { useDataContext } from '../../context/DataContext'
import MinusButton from '../buttons/MinusButton'
import PlusButton from '../buttons/PlusButton'
import LimitOrderPriceInputToolTip from '../tooltip/LimitOrderPriceInputToolTip'
import NumberInput from './NumberInput'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface ILimitOrderPriceInput {
  disabled?: boolean
  tick: null | number
  setTick: (value: null | number) => void
  onPriceEntered: (value: string) => void
  isPreferredTokenOrder: boolean
}

function LimitOrderPriceInput(props: ILimitOrderPriceInput) {
  const { disabled = false, isPreferredTokenOrder, setTick, onPriceEntered } = props

  const { token0, token1, poolSummary, token: selectedToken, liquidityChart } = useDataContext()
  const [tickIncrement, setTickIncrement] = useState(poolSummary && getTickSpacing(poolSummary.fee))
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [placeholder, setPlaceholder] = useState<string>('')
  const [showPriceToolTip, setShowPriceToolTip] = useState(false)
  const [disableMinus, setDisableMinus] = useState(false)
  const [disablePlus, setDisablePlus] = useState(false)
  const [currentPoolTick, setCurrentPoolTick] = useState<undefined | number>(undefined)
  const [lowerTickBound, setLowerTickBound] = useState<undefined | number>(undefined)
  const [upperTickBound, setUpperTickBound] = useState<undefined | number>(undefined)
  const { currentChainInfo } = useChainLoader()

  const token1Selected = selectedToken.selected !== 0
  const TICK_BOUNDARY_SIZE = 2

  useEffect(() => {
    setInitialTick()
  }, [liquidityChart?.pool])

  useEffect(() => {
    setTickIncrement(getTickSpacing(poolSummary.fee))
    setValue('')
    if ((isPreferredTokenOrder && token1Selected) || (!isPreferredTokenOrder && !token1Selected)) {
      setDisablePlus(true)
      setDisableMinus(false)
    } else {
      setDisableMinus(true)
      setDisablePlus(false)
    }
    setInitialTick()
  }, [token1Selected, isPreferredTokenOrder])

  const setInitialTick = () => {
    if (liquidityChart) {
      setCurrentPoolTick(liquidityChart.current_pool_tick)
      const currentPrice = getPrice(liquidityChart.current_pool_tick)
      setPlaceholder(currentPrice ? convertFromSciNot(currentPrice) : '')
      setUpperTickBound(
        token1Selected
          ? liquidityChart.current_pool_tick + tickIncrement * TICK_BOUNDARY_SIZE
          : liquidityChart.current_pool_tick - tickIncrement * TICK_BOUNDARY_SIZE
      )
      setLowerTickBound(
        token1Selected
          ? liquidityChart.current_pool_tick - tickIncrement * TICK_BOUNDARY_SIZE
          : liquidityChart.current_pool_tick + tickIncrement * TICK_BOUNDARY_SIZE
      )
    }
  }

  const onMinus = () => {
    const currentTick = getTick(Number(value)) ? getTick(Number(value)) : currentPoolTick
    let newTick: number
    if (currentTick) {
      setFocus(false)
      // If ' value ==="" ', it is the first time we hit '-' button
      if (value === '') {
        newTick = token1Selected
          ? currentTick - tickIncrement * (TICK_BOUNDARY_SIZE + 1)
          : currentTick + tickIncrement * (TICK_BOUNDARY_SIZE + 1)
      } else {
        newTick = token1Selected ? currentTick - tickIncrement : currentTick + tickIncrement
      }
      let price: number | undefined

      const isPTOAndToken1SelectedAndLess =
        !isPreferredTokenOrder &&
        currentPoolTick &&
        currentPoolTick + tickIncrement * (TICK_BOUNDARY_SIZE + 1) <= newTick

      const isNOTPTOAndToken1SelectedAndOver =
        isPreferredTokenOrder &&
        currentPoolTick &&
        currentPoolTick - tickIncrement * (TICK_BOUNDARY_SIZE + 1) >= newTick

      if (isPTOAndToken1SelectedAndLess || isNOTPTOAndToken1SelectedAndOver) {
        price = getPrice(newTick)
        setTick(newTick)
        setDisableMinus(false)
        setDisablePlus(false)
        price && setValue(convertFromSciNot(price))
        price && onPriceEntered(convertFromSciNot(price))
      }
    }
  }

  const onPlus = () => {
    const currentTick = getTick(Number(value)) ? getTick(Number(value)) : currentPoolTick
    let newTick: number
    if (currentTick) {
      setFocus(false)
      // If ' value ==="" ', it is the first time we hit '+' button
      if (value === '') {
        newTick = token1Selected
          ? currentTick + tickIncrement * (TICK_BOUNDARY_SIZE + 1)
          : currentTick - tickIncrement * (TICK_BOUNDARY_SIZE + 1)
      } else {
        newTick = token1Selected ? currentTick + tickIncrement : currentTick - tickIncrement
      }
      let price: number | undefined

      const isPTOAndToken1SelectedAndLess =
        !isPreferredTokenOrder &&
        currentPoolTick &&
        currentPoolTick + tickIncrement * (TICK_BOUNDARY_SIZE + 1) <= newTick

      const isNOTPTOAndToken1SelectedAndOver =
        isPreferredTokenOrder &&
        currentPoolTick &&
        currentPoolTick - tickIncrement * (TICK_BOUNDARY_SIZE + 1) >= newTick

      if (isPTOAndToken1SelectedAndLess || isNOTPTOAndToken1SelectedAndOver) {
        price = getPrice(newTick)
        setTick(newTick)
        setDisableMinus(false)
        setDisablePlus(false)
        price && setValue(convertFromSciNot(price))
        price && onPriceEntered(convertFromSciNot(price))
      }
    }
  }

  const onInput = (value: string) => {
    setFocus(true)
    setValue(value)
  }

  const getTick = (price: number) => {
    if (token0 && token1) {
      const tick = getTickFromPrice(price, token0?.decimals, token1?.decimals, token1Selected)
      const newTick = getNearestTick(tick, tickIncrement)
      return newTick
    }
  }

  const getPrice = (newTick: number) => {
    if (token0 && token1) {
      const price = getPriceFromTick(newTick, token0?.decimals, token1?.decimals, token1Selected)
      return price
    }
  }

  const debouncedValue = useDebounce({ value, delay: 700 })
  useEffect(() => {
    if (debouncedValue !== '' && lowerTickBound && upperTickBound && focus) {
      const priceBoundary =
        !isPreferredTokenOrder || token1Selected ? getPrice(lowerTickBound) : getPrice(upperTickBound)
      if (
        ((isPreferredTokenOrder && token1Selected) || (!isPreferredTokenOrder && !token1Selected)) &&
        currentPoolTick &&
        priceBoundary &&
        Number(value) > priceBoundary
      ) {
        const newTick = token1Selected
          ? currentPoolTick - tickIncrement * (TICK_BOUNDARY_SIZE + 2)
          : currentPoolTick + tickIncrement * (TICK_BOUNDARY_SIZE + 2)
        if (newTick) {
          const tickPrice = getPrice(newTick)
          if (tickPrice) {
            setValue(convertFromSciNot(tickPrice))
          }
          setTick(newTick)
          onPriceEntered(convertFromSciNot(priceBoundary))
          setDisablePlus(true)
          setDisableMinus(false)
        }
      } else if (
        ((!isPreferredTokenOrder && token1Selected) || (isPreferredTokenOrder && !token1Selected)) &&
        currentPoolTick &&
        priceBoundary &&
        Number(value) < priceBoundary
      ) {
        const newTick = token1Selected
          ? currentPoolTick + tickIncrement * (TICK_BOUNDARY_SIZE + 2)
          : currentPoolTick - tickIncrement * (TICK_BOUNDARY_SIZE + 2)
        if (newTick) {
          const tickPrice = getPrice(newTick)
          if (tickPrice) {
            setValue(convertFromSciNot(tickPrice))
          }
          setTick(newTick)
          onPriceEntered(convertFromSciNot(priceBoundary))
          setDisablePlus(false)
          setDisableMinus(true)
        }
      } else {
        const newTick = getTick(parseFloat(value))
        if (newTick) {
          const tickPrice = getPrice(newTick)
          tickPrice && setValue(convertFromSciNot(tickPrice))
          setTick(newTick)
          onPriceEntered(value)
          setDisableMinus(false)
          setDisablePlus(false)
        }
      }
      setFocus(false)
    } else {
      setInitialTick()
    }
  }, [debouncedValue])

  return (
    <div className="flex flex-col relative gap-[6px]">
      <div className="flex flex-row gap-2">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[400]}>
          Quote in{' '}
          {selectedToken.selected === 0
            ? getTokenSymbol(token0.address, token0.symbol, currentChainInfo.id)!
            : getTokenSymbol(token1.address, token1.symbol, currentChainInfo.id)!}
        </T3>
        <InformationCircleIcon
          className={`text-[${colors.gray[400]}]`}
          width={15}
          onMouseEnter={() => setShowPriceToolTip(true)}
          onMouseLeave={() => setShowPriceToolTip(false)}
        />
        {showPriceToolTip && <LimitOrderPriceInputToolTip />}
      </div>
      <div
        className="flex py-3 flex-row px-3 rounded-[10px] bg-[#0E111A] border-[1px] items-center"
        style={{ borderColor: focus && !disabled ? '#4C82FB' : colors.gray[700] }}
      >
        <MinusButton
          onClick={() => {
            onMinus()
          }}
          disabled={disableMinus}
        />
        <div className="flex flex-1 ">
          <NumberInput
            onBlur={() => setFocus(false)}
            style={{ textAlign: 'center' }}
            disabled={false}
            onUserInput={onInput}
            value={value}
            placeholder={placeholder ? placeholder : ''}
          />
        </div>
        <PlusButton
          onClick={() => {
            onPlus()
          }}
          disabled={disablePlus}
        />
      </div>
    </div>
  )
}

export default LimitOrderPriceInput
