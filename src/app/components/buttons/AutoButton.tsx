import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { useState } from 'react'

interface IButton {
  onClick: () => void
}

function AutoButton(props: IButton) {
  const [hover, setHover] = useState(false)
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-[4px]"
      style={{ backgroundColor: hover ? getHoverColor(colors.blue[400]) : colors.blue[400] }}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
    >
      <T3>Auto</T3>
    </button>
  )
}

export default AutoButton
