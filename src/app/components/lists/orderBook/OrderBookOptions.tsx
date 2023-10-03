import SmallNumber from '../../numbers/SmallNumber'
import { colors } from '../../../constants/colors'
import { useThemeContext } from '../../../context/naked/ThemeContext'
import { calculateSuggestedGranularities } from '../../../util/calculateSuggestedGranularities'
import BaseDropdown from '../../dropdown/BaseDropdown'
import ColorfulBars from './OrderBookFilterBars'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useMemo, useState } from 'react'

export type OrderBookViewOptions = 'default' | 'asks' | 'bids'

const OrderBookRadio = ({
  option,
  activeOption,
  onOptionSelect,
  topColor,
  bottomColor,
}: {
  option: OrderBookViewOptions
  activeOption: OrderBookViewOptions
  onOptionSelect: (val: OrderBookViewOptions) => void
  topColor?: string
  bottomColor?: string
}) =>
  useMemo(
    () => (
      <label
        className={`rounded-sm cursor-pointer outline-gray-600 outline-2 mx-1 hover:outline ${
          activeOption === option ? ' outline' : ''
        }`}
      >
        <input
          className="opacity-0 absolute w-0 h-0"
          type="radio"
          id={option}
          name="orderbook-option"
          checked={activeOption === option}
          value={option}
          onChange={() => onOptionSelect(option)}
        />
        <ColorfulBars topColor={topColor} bottomColor={bottomColor} />
      </label>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeOption, topColor, bottomColor]
  )

const OrderBookOptions = ({
  onOptionSelect,
  activeOption,
  suggestedGranularities,
  selectedGranularity,
  setSelectedGranularity,
}: {
  onOptionSelect: (val: OrderBookViewOptions) => void
  activeOption: OrderBookViewOptions
  suggestedGranularities: number[]
  selectedGranularity: number
  setSelectedGranularity: (val: number) => void
}) => {
  const [showModal, setShowModal] = useState(false)
  const { colors: themeColors } = useThemeContext()
  const converted = calculateSuggestedGranularities(suggestedGranularities)
  const selectedRich = converted[selectedGranularity]
  return (
    <div className="flex flex-row w-full px-2 text-white mb-2">
      {selectedRich !== undefined ? (
        <div>
          <BaseDropdown
            showModal={showModal}
            setShowModal={setShowModal}
            showCarot={false}
            buttonContent={
              <div className="flex flex-row  gap-2 items-center text-white">
                <span>
                  {selectedRich ? (
                    <SmallNumber number={Number(selectedRich.label)} minimumNumber={1e-6} removeTrailingZeros={true} />
                  ) : (
                    ''
                  )}
                </span>
                <ChevronDownIcon width={16} color={colors.gray[600]} />
              </div>
            }
            modalContent={
              <div
                className={`bg-[${colors.gray[800]}] border-[1px]  min-w-[75px] rounded-[12px] h-fit text-white flex flex-col absolute z-50`}
                style={{ borderColor: colors.gray[700] }}
              >
                {converted.map((granularity) => (
                  <button
                    className="text-start hover:bg-[#293249] px-3 py-2 w-full first:rounded-t-[12px] last:rounded-b-[12px]"
                    key={granularity.index}
                    onClick={() => {
                      setSelectedGranularity(granularity.index)
                    }}
                  >
                    <SmallNumber number={Number(granularity.label)} minimumNumber={1e-6} removeTrailingZeros={true} />
                  </button>
                ))}
              </div>
            }
          />
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-1 justify-end">
        <OrderBookRadio
          option="default"
          activeOption={activeOption}
          onOptionSelect={onOptionSelect}
          topColor={themeColors.neg_color}
          bottomColor={themeColors.pos_color}
        />
        <OrderBookRadio
          option="asks"
          activeOption={activeOption}
          onOptionSelect={onOptionSelect}
          topColor={themeColors.pos_color}
        />
        <OrderBookRadio
          option="bids"
          activeOption={activeOption}
          onOptionSelect={onOptionSelect}
          topColor={themeColors.neg_color}
        />
      </div>
    </div>
  )
}

export default OrderBookOptions
