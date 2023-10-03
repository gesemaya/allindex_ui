import { T3 } from '../typography/Typography'
import { getNearestTick, price2Tick } from '../../lib/liquidity'
import { FontWeightEnums } from '../../types/Enums'
import { useDataContext } from '../../context/DataContext'
import { useChartDataContext } from '../charts/context/ChartDataContext'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useEffect, useState } from 'react'

const Range = [12.5, 25, 50, 75, 100]

interface IRangeButton {
  range: number
  setRange: (range: number) => void
}

function RangeDropdown() {
  const [range, setRange] = useState<number | undefined>(undefined)
  const { highlightBounds, setHighlightBounds } = useChartDataContext()
  const { poolSummary, token } = useDataContext()

  const { liquidityChart: liquidityData } = useDataContext()

  // if highlightbounds are cleared, clear the range of this input
  useEffect(() => {
    if (highlightBounds === undefined) {
      setRange(undefined)
    }
  }, [highlightBounds])

  useEffect(() => {
    if (!(poolSummary.t1_price !== undefined && liquidityData && range)) {
      return
    }
    const price = token.selected === 1 ? poolSummary.t0_price : poolSummary.t1_price
    const rangeHalf = range / 2
    const tickSpacing = liquidityData?.tick_spacing

    const tickMin = price * (1 - rangeHalf / 100)
    const tickMax = price * (1 + rangeHalf / 100)

    setHighlightBounds({
      lower: getNearestTick(price2Tick(tickMin, token), tickSpacing, token),
      upper: getNearestTick(price2Tick(tickMax, token), tickSpacing, token),
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, poolSummary, liquidityData, token])

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger classes="border border-[#293249]" trigger={<DropdownButton range={range} />} hasCarot />
      <DropdownItemsContainer sideOffset={2}>
        <DropdownModal setRange={setRange} />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

export default RangeDropdown

const RangeButton = (props: IRangeButton) => {
  const { range, setRange } = props
  return (
    <DropdownItem classes="text-white flex px-2 py-1 w-[115px] " key={range} onClick={() => setRange(range)}>
      <T3 weight={FontWeightEnums.MEDIUM}>{range.toString().concat('%')}</T3>
    </DropdownItem>
  )
}

const DropdownButton = ({ range }: { range: number | undefined }) => {
  return <T3 className="w-[80px]">{range ? range.toString().concat('%') : 'Select'}</T3>
}

const DropdownModal = ({ setRange }: { setRange: (range: number) => void }) => {
  return (
    <>
      {Range.map((range, index) => (
        <RangeButton key={index} range={range} setRange={setRange} />
      ))}
    </>
  )
}
