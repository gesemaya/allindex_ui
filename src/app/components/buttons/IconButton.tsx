import React from 'react'

interface IButton {
  onClick: () => void
  IconComponent: React.ElementType
  iconClasses?: string
  containerClasses?: string
}

function IconButton({ onClick, IconComponent, iconClasses, containerClasses }: IButton) {
  return (
    <div onClick={onClick} className={`cursor-pointer hover:opacity-70 ${containerClasses}`}>
      <IconComponent className={` ${iconClasses}`} />
    </div>
  )
}

export default IconButton
