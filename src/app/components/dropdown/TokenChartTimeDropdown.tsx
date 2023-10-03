import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { tokenChartTimeIncrementEnums } from '../../types/Enums'
import { getHoverColor } from '../charts/utils/getHoverColor'
import BaseDropdown from './BaseDropdown'
import { useState } from 'react'

interface ITokenChartTimeDropdown {
  timeIncrement: tokenChartTimeIncrementEnums
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
}

const TokenChartTimeDropdown = (props: ITokenChartTimeDropdown) => {
  const { timeIncrement, setTimeIncrement } = props
  const [showModal, setShowModal] = useState(false)

  return (
    <BaseDropdown
      modalContent={<ModalContent setTimeIncrement={setTimeIncrement} setShowModal={setShowModal} />}
      buttonContent={<T2 color={colors.gray[200]}>{timeIncrement}</T2>}
      buttonStyle={{
        backgroundColor: colors.gray[900],
        borderWidth: '1px',
        borderColor: colors.gray[700],
        width: 56,
        paddingLeft: 8,
        height: 27,
        borderRadius: 6,
      }}
      showCarot={true}
      showModal={showModal}
      setShowModal={setShowModal}
    ></BaseDropdown>
  )
}

interface IModalContent {
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
  setShowModal: (value: boolean) => void
}

const ModalContent = (props: IModalContent) => {
  const { setTimeIncrement, setShowModal } = props
  return (
    <div
      className="flex flex-col border-[0.4px] rounded-[6px] w-[56px] mt-1"
      style={{ backgroundColor: colors.gray[900], borderColor: colors.gray[700] }}
    >
      <ItemButton
        onClick={() => {
          setTimeIncrement(tokenChartTimeIncrementEnums.DAY_1)
          setShowModal(false)
        }}
        title={tokenChartTimeIncrementEnums.DAY_1}
      />
      <ItemButton
        onClick={() => {
          setTimeIncrement(tokenChartTimeIncrementEnums.DAY_7)
          setShowModal(false)
        }}
        title={tokenChartTimeIncrementEnums.DAY_7}
      />
      <ItemButton
        onClick={() => {
          setTimeIncrement(tokenChartTimeIncrementEnums.DAY_14)
          setShowModal(false)
        }}
        title={tokenChartTimeIncrementEnums.DAY_14}
      />
      <ItemButton
        onClick={() => {
          setTimeIncrement(tokenChartTimeIncrementEnums.DAY_30)
          setShowModal(false)
        }}
        title={tokenChartTimeIncrementEnums.DAY_30}
      />
      <ItemButton
        onClick={() => {
          setTimeIncrement(tokenChartTimeIncrementEnums.YEAR_1)
          setShowModal(false)
        }}
        title={tokenChartTimeIncrementEnums.YEAR_1}
      />
    </div>
  )
}

interface IItemButton {
  onClick: () => void
  title: tokenChartTimeIncrementEnums
}

const ItemButton = (props: IItemButton) => {
  const { onClick, title } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex justify-start w-full h-full px-3 py-[6px] rounded-[6px]"
      style={{ backgroundColor: hover ? getHoverColor(colors.gray[900]) : colors.gray[900] }}
    >
      <T3>{title}</T3>
    </button>
  )
}

export default TokenChartTimeDropdown
