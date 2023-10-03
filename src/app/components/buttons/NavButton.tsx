import { T1, T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums } from '../../types/Enums'
import React from 'react'
import { NavLink, RelativeRoutingType } from 'react-router-dom'

interface IButton {
  to: string
  children: React.ReactNode

  end?: boolean
  relative?: RelativeRoutingType
  reloadDocument?: boolean
}

function NavButton(props: IButton) {
  const { children } = props
  const { isMobile } = useMobile()
  return (
    <NavLink
      relative={props.relative}
      end={props.end}
      to={props.to}
      className={({ isActive }) =>
        `flex items-center p-2 hover:bg-[#24252C] rounded-lg ${isActive ? 'bg-[#24252C]' : ''}`
      }
      reloadDocument={props.reloadDocument}
    >
      {({ isActive }) => {
        const Element = isMobile ? T1 : T2
        return (
          <Element
            weight={isMobile ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
            color={isActive ? colors.gray[50] : colors.gray[300]}
            className="whitespace-nowrap"
          >
            {children}
          </Element>
        )
      }}
    </NavLink>
  )
}

export default NavButton
