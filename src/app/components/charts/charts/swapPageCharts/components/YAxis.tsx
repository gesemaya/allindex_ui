import { FormatNumber } from '../../../../numbers/FormatNumber'
import { colors } from '../../../../../constants/colors'
import { IYAxis } from '../types'
import React from 'react'

function YAxis(props: IYAxis) {
  const { height, width, data, canZoom = false, setYRatio, yRatio } = props
  const onWheel = (e: React.WheelEvent) => {
    const yZoomFactor = 0.8
    window.log.log(yRatio)
    const zoomIn = e.deltaY > 0
    const newRatio = zoomIn ? yZoomFactor * yRatio : (2 - yZoomFactor) * yRatio
    setYRatio(newRatio > 0.5 ? 0.5 : newRatio < 0.1 ? 0.1 : newRatio)
  }
  return (
    <div style={{ height: height, width: width }}>
      <svg width={'100%'} height={'100%'} onWheel={(e) => canZoom && onWheel(e)}>
        {data &&
          data.length > 0 &&
          data.map((item, index) => {
            return (
              <text
                key={index}
                style={{ userSelect: 'none' }}
                fontSize={10}
                x={2}
                y={item.location}
                fill={colors.gray[400]}
              >
                <FormatNumber num={item.value} singleLetterNotation={true} />
              </text>
            )
          })}
        {/* {hover &&yAxisData && hover.location === 'Candle' && (
            <YAxisHover hoverHeight={tickHeight} clientHeight={clientHeight} y={hover?.y} bounds={yAxisData.bounds}></YAxisHover>
          )} */}
      </svg>
    </div>
  )
}

export default YAxis
