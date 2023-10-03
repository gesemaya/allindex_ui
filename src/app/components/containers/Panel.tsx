import { colors } from '../../constants/colors'
import React from 'react'

interface IPanel {
  children: React.ReactNode
}

function Panel(props: IPanel) {
  const { children } = props
  return (
    <div
      className={`rounded-lg border-[1px]  border-[${colors.gray[800]}] p-3 w-full h-full `}
      style={{ backgroundColor: colors.gray.dark }}
    >
      {children}
    </div>
  )
}

export default Panel
