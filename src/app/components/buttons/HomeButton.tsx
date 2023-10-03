import logo from '../../assets/logo.svg'
import { colors } from '../../constants/colors'
import useMobile from '../../hooks/useMobile'
import { useState } from 'react'

interface IButton {
  onClick: () => void
  inExpandedMenu?: boolean
}

function HomeButton(props: IButton) {
  const { onClick, inExpandedMenu } = props
  const [hover, sethover] = useState(false)
  const { isMobile } = useMobile()
  const logoSize = isMobile ? 20 : 32
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        sethover(true)
      }}
      onMouseLeave={() => {
        sethover(false)
      }}
      className="relative flex"
      style={{ width: logoSize, height: logoSize, borderRadius: logoSize }}
    >
      <img
        className={`${inExpandedMenu ? '' : 'absolute'}`}
        alt="Home Icon"
        style={{ width: logoSize, height: logoSize, borderRadius: logoSize }}
        src={logo}
      />
      {hover && (
        <div
          className={`${
            inExpandedMenu ? '' : 'absolute'
          } h-[32px] w-[32px] rounded-[32px] top-[-6px] left-[-6px] md:top-[-5px] md:left-[-5px]`}
          style={{ backgroundColor: colors.hover.color, opacity: colors.hover.opacity }}
        ></div>
      )}
    </button>
  )
}

export default HomeButton
