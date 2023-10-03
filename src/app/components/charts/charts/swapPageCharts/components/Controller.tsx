// noinspection JSUnusedLocalSymbols

import getMouseLocation from '../../../utils/getMouseLocation'
import { IBounds } from '../../lineChart/types'
import React, { useState } from 'react'

interface IController {
  height: number
  width: number
  bounds: IBounds
  setBounds: (value: IBounds) => void
  incrementSize: number
  canDrag?: boolean
  canZoom?: boolean
}

function Controller(props: IController) {
  const { height, width, bounds, setBounds, incrementSize, canDrag = true, canZoom = true } = props

  const [cursor, setCursor] = useState('grab')
  const pixelSize = (bounds.upper - bounds.lower) / width
  const [initalClick, setInitialClick] = useState<undefined | { x: number; y: number; bounds: IBounds }>(undefined)

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { x, y } = getMouseLocation(e)
    setCursor('grabbing')
    setInitialClick({ x: x, y: y, bounds: bounds })
  }

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCursor('grab')
    setInitialClick(undefined)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { x, y } = getMouseLocation(e)
    if (initalClick !== undefined) {
      const deltaX = (initalClick.x - x) * pixelSize
      setBounds({ lower: initalClick.bounds.lower + deltaX, upper: initalClick.bounds.upper + deltaX })
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    const minBars = 6
    const minBarWidth = 3
    if (canZoom) {
      const { x } = getMouseLocation(e)
      const xZoomFactor = 0.95 * (1 - 0.1 * (Math.abs(e.deltaY) / 500))
      const zoomIn = e.deltaY < 0
      const delta = bounds.upper - bounds.lower
      const isTooSmall = delta < incrementSize * minBars
      const isTooLarge = delta > (width / minBarWidth) * incrementSize
      const midpoint = bounds.lower + x * pixelSize
      const upperOffset = zoomIn ? (delta - x * pixelSize) * xZoomFactor : (delta - x * pixelSize) / xZoomFactor
      const lowerOffset = zoomIn ? x * pixelSize * xZoomFactor : (x * pixelSize) / xZoomFactor
      if (zoomIn) {
        if (!isTooSmall) {
          setBounds({
            upper: midpoint + upperOffset,
            lower: midpoint - lowerOffset,
          })
        }
      } else {
        if (!isTooLarge) {
          setBounds({
            upper: midpoint + upperOffset,
            lower: midpoint - lowerOffset,
          })
        }
      }
    }
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCursor('grab')
    setInitialClick(undefined)
  }

  return (
    <div
      className="absolute flex flex-1  "
      style={{ height: height, width: width, cursor: cursor }}
      onWheel={(e) => onWheel(e)}
      onMouseMove={(e) => {
        onMouseMove(e)
      }}
      onMouseDown={(e) => {
        onMouseDown(e)
      }}
      onMouseUp={(e) => {
        onMouseUp(e)
      }}
      onMouseLeave={(e) => {
        onMouseLeave(e)
      }}
    ></div>
  )
}

export default Controller
