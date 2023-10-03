import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { Trans } from '@lingui/macro'
import { useState } from 'react'

interface IButton {
  onClick: () => void
}

function ClearAllButton(props: IButton) {
  const { onClick } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      onClick={onClick}
    >
      <T3 color={hover ? colors.blue[500] : colors.blue[400]}>
        <Trans>Clear all</Trans>
      </T3>
    </button>
  )
}

export default ClearAllButton
