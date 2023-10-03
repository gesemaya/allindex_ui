import React from 'react'

interface ILine {
  data: string
  width: number
  height: number
  lineColor: string
  shadowColor: string[]
  shadowOffset: number
}

function Line(props: ILine) {
  const { lineColor, data } = props

  return (
    <g>
      <polyline points={`${data}`} fill="none" stroke={lineColor} />
    </g>
  )
}

export default Line
