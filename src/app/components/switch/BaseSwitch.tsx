import { T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { useState } from 'react'

interface IBaseSwitch {
  item: boolean
  setItem: (value: boolean) => void
  item1: string
  item2: string
  classes?: string
}

interface IButton {
  onClick: () => void
  children: string
}

const SwitchButton = (props: IButton) => {
  const { onClick, children } = props
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
      className="flex flex-1 justify-center items-center rounded-full"
    >
      <T2 color={hover ? getHoverColor(colors.white) : colors.white}>{children}</T2>
    </button>
  )
}

const Highlight = ({ isFirstValue }: { isFirstValue: boolean }) => {
  return (
    <div className={`h-full absolute py-1 w-full  px-2 flex `}>
      <div
        style={{ backgroundColor: colors.gray[700] }}
        className={`
        h-full w-[50%] rounded-full
        transform transition-all duration-300 ${isFirstValue ? 'transform translate-x-[100%] ' : ''}

        `}
      ></div>
    </div>
  )
}

function BaseSwitch(props: IBaseSwitch) {
  const { item, setItem, item1, item2, classes } = props

  return (
    <>
      <div
        className={`w-full h-[32px] rounded-lg border-[1px] border-[#141B2B] text-[14px] font-normal bg-[#0E0E0E] items-center relative ${classes}`}
      >
        <Highlight isFirstValue={item} />
        <div className="flex flex-row text-white flex-1 rounded-full w-full h-full absolute ">
          <SwitchButton
            onClick={() => {
              setItem(false)
            }}
          >
            {item1}
          </SwitchButton>
          <SwitchButton
            onClick={() => {
              setItem(true)
            }}
          >
            {item2}
          </SwitchButton>
        </div>
      </div>
    </>
  )
}

export default BaseSwitch
