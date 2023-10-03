import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import ModalOverlay from './ModalOverlay'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ReactNode, useState } from 'react'

export interface IModal {
  showModal: boolean
  onClose: () => void
  children: ReactNode
  offsetLeft?: number | string
  offsetRight?: number | string
  offsetBottom?: number | string
  offsetTop?: number | string
  showOverlay?: boolean
  showCloseButton?: boolean
}

interface IButton {
  onClick: () => void
}

const CloseModalButton = (props: IButton) => {
  const { onClick } = props
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <XMarkIcon fill={hover ? getHoverColor(colors.gray[400]) : colors.gray[400]} width={16}></XMarkIcon>
    </button>
  )
}

function BaseModal(props: IModal) {
  const {
    showModal,
    onClose,
    children,
    offsetLeft = 'auto',
    offsetTop = '40vh',
    offsetRight = 'auto',
    offsetBottom = 'auto',
    showOverlay = true,
    showCloseButton = false,
  } = props

  return (
    <>
      {showModal && (
        <div className="fixed z-10  h-full w-full flex" style={{ left: 0, top: 0 }}>
          <ModalOverlay onClose={onClose} showOverlay={showOverlay} />
          <div
            className="relative w-fit h-fit"
            style={{
              zIndex: 2,
              marginLeft: offsetLeft,
              marginRight: offsetRight,
              marginTop: offsetTop,
              marginBottom: offsetBottom,
            }}
          >
            {showCloseButton && (
              <div className="absolute h-fit w-fit" style={{ right: '16px', top: '10px' }}>
                <CloseModalButton onClick={onClose}></CloseModalButton>
              </div>
            )}
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default BaseModal
