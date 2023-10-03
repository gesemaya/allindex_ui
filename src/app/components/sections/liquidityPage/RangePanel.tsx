import { T2, T3, T4 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getNearestTick, price2Tick, tick2Price } from '../../../lib/liquidity'
import { FontWeightEnums } from '../../../types/Enums'
import { prettyNumber } from '../../../util/formatNumbers'
import { useDataContext } from '../../../context/DataContext'
import { usePositionMakerContext } from '../../../context/PositionMakerContext'
import MinusButton from '../../buttons/MinusButton'
import PlusButton from '../../buttons/PlusButton'
import { useChartDataContext } from '../../charts/context/ChartDataContext'
import RangeDropdown from '../../dropdown/RangeDropdown'
import Input from '../../inputs/NumberInput'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useMemo, useState } from 'react'

interface IPriceChanger {
  title: string
  price: string | undefined
  onInput: (value: string) => void
  onPlus: () => void
  onMinus: () => void
  onBlur: () => void
}

const PriceChanger = (props: IPriceChanger) => {
  const { title, price, onInput, onMinus, onPlus, onBlur } = props
  const { editPosition } = usePositionMakerContext()
  const [formatted, setFormatted] = useState<string>('0')

  useEffect(() => {
    if (price) {
      const removed = price?.replace(/,/g, '')
      setFormatted(removed)
    } else {
      setFormatted('0')
    }
  }, [price])

  return (
    <div className="w-full h-fit  flex flex-col gap-[6px]]">
      <T4 color={colors.gray[400]}>{title}</T4>
      <div
        className="w-full h-[39px] px-[10px] pt-[10px] pb-[12px] flex flex-row justify-between border-[1px] rounded-[10px]"
        style={{ borderColor: colors.gray[700] }}
      >
        <MinusButton disabled={editPosition} onClick={onMinus} />
        <Input
          disabled={editPosition}
          // onKeyDown={handleKeyDown}
          value={price !== undefined ? formatted : '0'} //{price!=undefined?priceData[price]: ''}
          onUserInput={onInput}
          placeholder={'0'}
          onBlur={onBlur}
          style={{
            color: 'white',
            textAlign: 'center',
            marginRight: 8,
            marginLeft: 8,
          }}
        />
        <PlusButton disabled={editPosition} onClick={onPlus} />
      </div>
    </div>
  )
}

const RangeWarningBanner = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-row gap-3 rounded-[6px]  px-2 py-1  " style={{ backgroundColor: colors.yellow[800] }}>
      <div className="flex flex-row items-center gap-3">
        <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 7.99993V11.7499M1.25884 15.1259C0.212425 16.6259 1.52105 18.4999 3.61268 18.4999H21.3873C23.4777 18.4999 24.7863 16.6259 23.7411 15.1259L14.855 2.37793C13.8086 0.87793 11.1913 0.87793 10.1449 2.37793L1.25884 15.1259ZM12.5 14.7499H12.5084V14.7579H12.5V14.7499Z"
            stroke={colors.yellow[300]}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <T3 weight={FontWeightEnums.REGULAR} color={colors.yellow[300]}>
          You won't earn fees until the market price is in range
        </T3>
      </div>
      <button className="h-fit" onClick={onClose}>
        <XMarkIcon width={12} fill={colors.yellow[300]} />
      </button>
    </div>
  )
}

function RangePanel() {
  const maxTick = 887272
  const minTick = -887272
  const { token } = useDataContext()
  const { editPosition } = usePositionMakerContext()
  const { highlightBounds, setHighlightBounds } = useChartDataContext()

  const { liquidityChart: liquidityData } = useDataContext()
  const [inputStop, setInputStop] = useState<undefined | string>('')
  const [inputStart, setInputStart] = useState<undefined | string>('')
  const [inRange, setInRange] = useState<undefined | boolean>(undefined)
  const [currentPriceTick, setCurrentPriceTick] = useState<number | undefined>(() => {
    if (liquidityData) {
      return liquidityData.current_pool_tick
    }
    return 0
  })
  const [tickSpacing, setTickSpacing] = useState<undefined | number>(liquidityData?.tick_spacing)

  useEffect(() => {
    if (liquidityData) {
      setTickSpacing(liquidityData.tick_spacing)
      setCurrentPriceTick(liquidityData.current_pool_tick)
    }
  }, [liquidityData])

  const addStartByTick = (delta: number, set?: number) => {
    if (highlightBounds) {
      let newTick = highlightBounds.lower + delta * (token.selected === 1 ? -1 : 1)
      if (newTick < minTick) {
        newTick = minTick
      }
      setHighlightBounds({
        lower: newTick,
        upper: set ? set : highlightBounds.upper,
      })
    }
  }

  const addStopByTick = (delta: number, set?: number) => {
    if (highlightBounds) {
      let newTick = highlightBounds.upper + delta * (token.selected === 1 ? 1 : -1)
      if (newTick > maxTick) {
        newTick = maxTick
      }
      setHighlightBounds({
        lower: set ? set : highlightBounds.lower,
        upper: newTick,
      })
    }
  }

  const onMinusStart = () => {
    if (currentPriceTick && tickSpacing) {
      if (highlightBounds === undefined) {
        token.selected === 0
          ? setHighlightBounds({ lower: currentPriceTick - tickSpacing, upper: currentPriceTick })
          : setHighlightBounds({ lower: currentPriceTick + tickSpacing, upper: currentPriceTick })
      } else {
        addStartByTick(tickSpacing)
      }
    }
  }

  const onPlusStart = () => {
    if (currentPriceTick && tickSpacing) {
      if (highlightBounds === undefined) {
        token.selected === 0
          ? setHighlightBounds({ lower: currentPriceTick - tickSpacing, upper: currentPriceTick })
          : setHighlightBounds({ lower: currentPriceTick + tickSpacing, upper: currentPriceTick })
      } else {
        addStartByTick(-tickSpacing)
      }
    }
  }
  const onInputStart = (x: string) => {
    if (x !== '') {
      setInputStart(x)
    } else {
      setInputStart('0')
    }
  }
  const onBlurStart = () => {
    if (highlightBounds && tickSpacing && inputStart) {
      const newLower = getNearestTick(price2Tick(Number(inputStart.replace(/,/g, '')), token), tickSpacing, token)
      setHighlightBounds({
        lower: newLower,
        upper: highlightBounds.upper ? highlightBounds.upper : newLower,
      })
    }
  }

  const onMinusStop = () => {
    if (currentPriceTick && tickSpacing) {
      if (highlightBounds === undefined) {
        token.selected === 0
          ? setHighlightBounds({ lower: currentPriceTick, upper: currentPriceTick + tickSpacing })
          : setHighlightBounds({ lower: currentPriceTick, upper: currentPriceTick - tickSpacing })
      } else {
        addStopByTick(-tickSpacing)
      }
    }
  }

  const onPlusStop = () => {
    if (currentPriceTick && tickSpacing) {
      if (highlightBounds === undefined) {
        token.selected === 0
          ? setHighlightBounds({ lower: currentPriceTick, upper: currentPriceTick + tickSpacing })
          : setHighlightBounds({ lower: currentPriceTick, upper: currentPriceTick - tickSpacing })
      } else {
        addStopByTick(tickSpacing)
      }
    }
  }

  const onInputStop = (x: string) => {
    if (x !== '') {
      setInputStop(x)
    } else {
      setInputStop(undefined)
    }
  }

  const onBlurStop = () => {
    if (highlightBounds && tickSpacing && inputStop) {
      const newUpper = getNearestTick(price2Tick(Number(inputStop.replace(/,/g, '')), token), tickSpacing, token)
      setHighlightBounds({
        upper: newUpper,
        lower: highlightBounds.lower ? highlightBounds.lower : newUpper,
      })
    }
  }

  const onClose = () => {
    setInRange(true)
  }

  useEffect(() => {
    if (highlightBounds !== undefined) {
      setInputStart(prettyNumber(tick2Price(highlightBounds.lower, token)))
      setInputStop(prettyNumber(tick2Price(highlightBounds.upper, token)))
      if (currentPriceTick) {
        if (highlightBounds.lower < currentPriceTick && highlightBounds.upper > currentPriceTick) {
          setInRange(true)
        } else {
          setInRange(false)
        }
      } else {
        setInRange(undefined)
      }
    } else {
      setInputStart(undefined)
      setInputStop(undefined)
      setInRange(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightBounds, token])

  return (
    <div className="h-fit bg-[#0E0E0E] rounded-[16px] p-3 pt-[10px]  border-[1px] border-[#141B2B] flex flex-col gap-1 relative">
      <div className="flex flex-row justify-between items-center">
        <T2>Range</T2>
        <RangeDropdown />
      </div>
      <div className={`flex flex-col${token.selected === 1 ? '' : '-reverse'} gap-2`}>
        <PriceChanger
          title={token.selected === 0 ? 'Max Price' : 'Min Price'}
          key={'Start Price'}
          price={inputStart}
          onInput={onInputStart}
          onPlus={onPlusStart}
          onMinus={onMinusStart}
          onBlur={onBlurStart}
        />
        <PriceChanger
          key={'Stop Price'}
          title={token.selected === 0 ? 'Min Price' : 'Max Price'}
          price={inputStop}
          onInput={onInputStop}
          onPlus={onPlusStop}
          onMinus={onMinusStop}
          onBlur={onBlurStop}
        />
      </div>
      {inRange === false && <RangeWarningBanner onClose={onClose} />}
      {editPosition && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#0E0E0E] opacity-50" style={{ zIndex: 1 }}></div>
      )}
    </div>
  )
}

export default RangePanel
