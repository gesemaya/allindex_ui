interface ICandle {
  candleData: { x: number; y: number; width: number; height: number }
  wickData: { x1: number; y1: number; x2: number; y2: number }
  fill: string
  borderColor: string
  borderWidth: number
}

function Candle(props: ICandle) {
  const { candleData, wickData, fill, borderColor, borderWidth } = props
  return (
    <g>
      <rect
        x={candleData.x}
        y={candleData.y}
        width={candleData.width}
        height={candleData.height <= 1 ? 1 : candleData.height}
        fill={fill}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
      <line x1={wickData.x1} y1={wickData.y1} x2={wickData.x2} y2={wickData.y2} strokeWidth={1} stroke={fill} />
    </g>
  )
}

export default Candle
