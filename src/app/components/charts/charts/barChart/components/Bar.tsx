import React from 'react'

interface IBar {
  x: number
  y: number
  width: number
  height: number
  fill: string
  borderColor: string
}

function Bar(props: IBar) {
  const { x, y, width, height, fill, borderColor } = props
  return (
    <g>
      <rect
        // className={styles.barChartAnimation}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={borderColor}
      />
    </g>
  )
}

export default Bar
