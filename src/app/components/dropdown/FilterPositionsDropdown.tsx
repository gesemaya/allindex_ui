import { T2, T3, T4 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums } from '../../types/Enums'
import { DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Dispatch, SetStateAction } from 'react'

function FilterPositionsDropdown({
  setFilter,
  filter,
}: {
  setFilter: Dispatch<SetStateAction<string[]>>
  filter: string[]
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger trigger={<DropdownButton />} classes="p-[0px]" />

      <DropdownItemsContainer align="end" sideOffset={4}>
        <DropdownModal setFilter={setFilter} filter={filter} />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

export default FilterPositionsDropdown

const DropdownButton = () => {
  const { isMobile } = useMobile()
  return (
    <button
      className="flex flex-row items-center gap-2 justify-center border-[1px] rounded-[8px]"
      style={{ width: '91px', height: '25px', borderColor: '#293249' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="White"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
        />
      </svg>
      {!isMobile && <T2>Filter</T2>}
    </button>
  )
}

const DropdownModal = ({ setFilter, filter }: { filter: string[]; setFilter: Dispatch<SetStateAction<string[]>> }) => {
  const toggleFilter = (filter: string) => {
    setFilter((filters: string[]) => {
      const newFilters = filters.includes(filter) ? filters.filter((f) => f !== filter) : [...filters, filter]
      return newFilters
    })
  }

  return (
    <div
      className="bg-[#0E0E0E] rounded-[6px] h-fit py-2 text-white flex flex-col w-fit p-3 gap-4"
      style={{ borderWidth: '1px', borderColor: colors.gray[700] }}
    >
      <div style={{ width: '147px' }} className="flex flex-row justify-between">
        <T3 weight={FontWeightEnums.MEDIUM}>Filters</T3>
        <button onClick={() => setFilter([])}>
          <T4 color={colors.blue[400]}>Clear all</T4>
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <Checkbox label="Closed" value="closed" isChecked={filter.includes('closed')} onChange={toggleFilter} />
        <Checkbox label="In Range" value="in range" isChecked={filter.includes('in range')} onChange={toggleFilter} />
        <Checkbox
          label="Out of Range"
          value="out of range"
          isChecked={filter.includes('out of range')}
          onChange={toggleFilter}
        />
      </div>
    </div>
  )
}

interface CheckboxProps {
  label: string
  value: string
  isChecked: boolean
  onChange: (value: string, isChecked: boolean) => void
}

const Checkbox: React.FC<CheckboxProps> = ({ label, value, isChecked, onChange }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    onChange(value, isChecked)
  }

  return (
    <label className="flex gap-3 ">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="rounded-[4px] border-[1px] w-3 h-3 cursor-pointer"
        style={{ borderColor: colors.gray[600] }}
      />
      <T3 weight={FontWeightEnums.REGULAR}>{label}</T3>
    </label>
  )
}
