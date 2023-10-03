import { T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { getHoverColor } from '../charts/utils/getHoverColor'
import BaseDropdown from './BaseDropdown'
import { useState } from 'react'
import { useElementSize } from 'usehooks-ts'

const FILTER = ['All', 'Open', 'Filled', 'Market', 'Limit']

interface IOrderHistoryDropdown {
  filter: string
  setFilter: (value: string) => void
}

function OrderHistoryDropDown(props: IOrderHistoryDropdown) {
  const [showModal, setShowModal] = useState(false)
  const { filter, setFilter } = props
  const [containerRef, { width }] = useElementSize()

  return (
    <div className="w-full gap-1 outline outline-1 outline-gray-800 rounded-lg" ref={containerRef}>
      <BaseDropdown
        showModal={showModal}
        setShowModal={setShowModal}
        buttonContent={<div className="w-full flex justify-start">{filter}</div>}
        buttonStyle={{ borderRadius: '8px', height: '32px', padding: '16px' }}
        modalContent={
          <div
            className={`border-[1px] border-[#FFFFFF30] rounded-lg h-fit text-white flex flex-col`}
            style={{ width: width, backgroundColor: colors.gray[900] }}
          >
            {FILTER.map((filter, index) => (
              <FilterButton
                key={index}
                filter={filter}
                setFilter={setFilter}
                onClose={() => {
                  setShowModal(false)
                }}
              />
            ))}
          </div>
        }
        fullWidthModal
        fullWidthButton
      />
    </div>
  )
}

interface IFilterButton {
  filter: string
  setFilter: (value: string) => void
  onClose: () => void
}

const FilterButton = (props: IFilterButton) => {
  const { filter, setFilter, onClose } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="text-white text-left pl-4 py-2 rounded-[12px]"
      style={{ backgroundColor: hover ? getHoverColor(colors.gray.dark) : '' }}
      key={filter}
      onClick={() => {
        setFilter(filter)
        onClose()
      }}
    >
      <T2 weight={FontWeightEnums.REGULAR}>{filter}</T2>
    </button>
  )
}

export default OrderHistoryDropDown
