import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { useState } from 'react'

interface IButton {
  onClick: () => void
  value: number
  focus: boolean
}

function TestAmountButton(props: IButton) {
  const { onClick, value, focus } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      className="w-[30px] h-[28px] border-[1px] rounded-[6px]"
      style={{
        backgroundColor: hover ? colors.hover.hover : undefined,
        borderColor: focus ? colors.blue[400] : hover ? getHoverColor(colors.gray[600]) : colors.gray[600],
      }}
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onClick={onClick}
    >
      <T3 color={focus ? colors.blue[400] : hover ? getHoverColor(colors.white) : colors.white}>{value}d</T3>
    </button>
  )
}

export default TestAmountButton
