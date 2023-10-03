import { colors } from '../../../constants/colors'
import { getHoverColor } from '../../charts/utils/getHoverColor'
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface IButton {
  onClick: () => void
  disabled?: boolean
  isSwap?: boolean
}

function FlipButton(props: IButton) {
  const { onClick, disabled = false, isSwap = false } = props
  const [hover, setHover] = useState(false)

  const bgColor = isSwap ? colors.black : colors.gray[900]
  return (
    <button
      className={`w-[20px] h-[20px]  rounded-[7px] flex items-center justify-center`}
      disabled={disabled}
      style={{
        borderWidth: 1,
        borderColor: colors.gray[500],
        backgroundColor: hover ? getHoverColor(bgColor) : bgColor,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isSwap ? <ArrowDownIcon width={12} /> : <ArrowRightIcon color={colors.gray[400]} width={12} />}
    </button>
  )
}

export default FlipButton
