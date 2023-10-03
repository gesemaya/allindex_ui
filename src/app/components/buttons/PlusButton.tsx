import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface IButton {
  onClick: () => void
  disabled: boolean
}

function PlusButton(props: IButton) {
  const { onClick, disabled } = props
  const [hover, setHover] = useState(false)

  return (
    <button
      onMouseDown={onClick}
      disabled={disabled}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      className={`h-4 w-4 rounded-[4px] flex items-center justify-center ${disabled ? 'hidden' : ''}`}
      style={{ backgroundColor: hover ? getHoverColor('#181C2C') : '#181C2C' }}
    >
      <PlusIcon width={10} color={hover ? getHoverColor(colors.white) : colors.white}></PlusIcon>
    </button>
  )
}

export default PlusButton
