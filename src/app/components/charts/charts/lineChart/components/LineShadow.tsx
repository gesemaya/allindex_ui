import React from 'react'

interface ILineShadow {
  data: string
  showColor: string[]
  shadowOffset: number
}

function LineShadow(props: ILineShadow) {
  const { data } = props

  return (
    <g>
      <defs>
        <linearGradient id="showGradient" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#3E43BB36" />
          <stop offset="100%" stopColor="#5CFE9D00" />
        </linearGradient>
      </defs>
      <polygon points={`${data}`} fill="url(#showGradient)" stroke="" />
    </g>
  )
}

export default LineShadow
