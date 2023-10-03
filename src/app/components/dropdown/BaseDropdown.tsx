import useMobile from '../../hooks/useMobile'
import DropdownModal from '../modals/DropdownModal'
import { ReactElement } from 'react'

const BaseDropdown = ({
  modalContent,
  buttonContent,
  fullWidthButton,
  showCarot,
  buttonStyle,
  showModal,
  setShowModal,
}: {
  modalContent: ReactElement
  buttonContent: ReactElement
  fullWidthModal?: boolean
  fullWidthButton?: boolean
  showCarot?: boolean
  buttonStyle?: object
  setShowModal: (value: boolean) => void
  showModal: boolean
}) => {
  return (
    <div className={`${fullWidthButton ? 'w-full' : ''}`}>
      <BaseDropDownButton
        onClick={() => setShowModal(true)}
        buttonContent={buttonContent}
        showCarot={showCarot}
        buttonStyle={buttonStyle}
      />
      <BaseDropdownModal showModal={showModal} setShowModal={setShowModal} width={'fit-content'}>
        {modalContent}
      </BaseDropdownModal>
    </div>
  )
}

const BaseDropdownModal = ({
  children,
  showModal,
  setShowModal,
  width,
}: {
  children: ReactElement
  showModal: boolean
  setShowModal: (bool: boolean) => void
  width: string | number
}) => {
  return (
    <DropdownModal showModal={showModal} setShowModal={setShowModal} showOverlay={false}>
      <div style={{ width }}>{children}</div>
    </DropdownModal>
  )
}
const BaseDropDownButton = ({
  buttonContent,
  onClick,
  showCarot = true,
  buttonStyle = {},
}: {
  buttonContent: ReactElement
  onClick: () => void
  showCarot: boolean | undefined
  buttonStyle?: object
}) => {
  const { isMobile } = useMobile()
  return (
    <button
      className="bg-[#0E0E0E] text-white w-full flex flex-row items-center text-[12px] font-medium justify-between"
      style={buttonStyle}
      onClick={onClick}
    >
      {buttonContent}
      {showCarot && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          style={{ width: isMobile ? '12px' : '16px', height: isMobile ? '9px' : '12px' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      )}
    </button>
  )
}

export default BaseDropdown
