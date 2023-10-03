import { T3 } from '../../components/typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { AddLiquidityState } from '../modals/CreatePool'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import React from 'react'

const Range = [12.5, 25, 50, 75, 100]

interface IRangeButton {
  range: number
  setAddLiquidityState: React.Dispatch<React.SetStateAction<AddLiquidityState>>
}

function CreatePoolRange({
  setAddLiquidityState,
  addLiquidityState,
}: {
  setAddLiquidityState: React.Dispatch<React.SetStateAction<AddLiquidityState>>
  addLiquidityState: AddLiquidityState
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger
        classes="border border-[#293249] h-[40px] w-[49%]"
        trigger={<DropdownButton range={addLiquidityState.range} />}
        hasCarot
      />
      <DropdownItemsContainer sideOffset={2}>
        <DropdownModal setAddLiquidityState={setAddLiquidityState} />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

export default CreatePoolRange

const RangeButton = (props: IRangeButton) => {
  const { range, setAddLiquidityState } = props
  return (
    <DropdownItem
      classes="text-white flex px-2 py-1 w-[var(--radix-dropdown-menu-trigger-width)] "
      key={range}
      onClick={() =>
        setAddLiquidityState((prevState) => ({
          ...prevState,
          range: range,
        }))
      }
    >
      <T3 weight={FontWeightEnums.MEDIUM}>{range.toString().concat('%')}</T3>
    </DropdownItem>
  )
}

const DropdownButton = ({ range }: { range: number | undefined }) => (
  <T3 className={`w-[80px] `} color={range ? colors.gray[50] : colors.gray[400]}>
    {range ? range.toString().concat('%') : 'Select'}
  </T3>
)

const DropdownModal = ({
  setAddLiquidityState,
}: {
  setAddLiquidityState: React.Dispatch<React.SetStateAction<AddLiquidityState>>
}) => {
  return (
    <>
      {Range.map((range, index) => (
        <RangeButton key={index} range={range} setAddLiquidityState={setAddLiquidityState} />
      ))}
    </>
  )
}
