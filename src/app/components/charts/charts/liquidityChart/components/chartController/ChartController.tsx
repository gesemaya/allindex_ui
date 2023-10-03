import { getNearestTick, price2Tick } from '../../../../../../lib/liquidity'
import { useDataContext } from '../../../../../../context/DataContext'
import { usePositionMakerContext } from '../../../../../../context/PositionMakerContext'
import { useChartDataContext } from '../../../../context/ChartDataContext'
import getMouseLocation from '../../../../utils/getMouseLocation'
import { maxTick, minTick } from '../../constants'
import { ChartRenderer } from '../../draw'
import { IBounds, ITick } from '../../type'
import React, { useCallback, useState } from 'react'

interface IChartController {
  chart: ChartRenderer<ITick>
  height: number
  width: number
  setHoveredTick: (value: ITick | undefined) => void
  bounds: IBounds
  currentTick: number
  setBounds: (value?: IBounds) => void
  tickSpacing: number
}

const isBetween = (a: number, b: number, c: number) => {
  if (a >= c && c >= b) {
    return true
  } else if (a <= c && c <= b) {
    return true
  }
  return false
}

function ChartController(props: IChartController) {
  const { currentTick, chart, height, width, setHoveredTick, bounds, tickSpacing, setBounds } = props
  const { token } = useDataContext()
  const [cursor, setCursor] = useState('pointer')

  const { highlightBounds, setHighlightBounds } = useChartDataContext()
  const [initClick, setInitClick] = useState<undefined | number>(undefined)
  const [initDrag, setInitDrag] = useState<IBounds | undefined>(undefined)
  const [initTickLower, setInitTickLower] = useState<{ x: number; upper: number; lower: number } | undefined>(undefined)
  const [initTickUpper, setInitTickUpper] = useState<{ x: number; upper: number; lower: number } | undefined>(undefined)

  const [highlightSelected, setHighlightSelected] = useState<undefined | number>(undefined)
  const [chartSelected, setChartSelected] = useState<{ x: number; upper: number; lower: number } | undefined>(undefined)

  const { editPosition } = usePositionMakerContext()

  const convertMouseLocation = (loc: { x: number; y: number }) => {
    const tick = price2Tick(chart.inv_x(loc.x), token)
    return {
      tick: getNearestTick(tick, tickSpacing, token),
      y: chart.inv_y(loc.y),
    }
  }
  const convertExactMouseLocation = (loc: { x: number; y: number }) => {
    const tick = price2Tick(chart.inv_x(loc.x), token)
    return {
      tick: tick,
      y: chart.inv_y(loc.y),
    }
  }
  const xToTick = (x: number) => {
    const px = chart.inv_x(x)
    const tk = price2Tick(px, token)
    return getNearestTick(tk, tickSpacing, token)
  }

  const onCursorDrag = (x: number) => {
    // otherwise, there is something being dragged, so here we go!
    if (tickSpacing === undefined || initClick === undefined) {
      return
    }

    setHoveredTick(undefined)

    // we are dragging the lower bounds
    if (initTickLower && highlightBounds !== undefined) {
      let clow = chart.transform_x({ tick: bounds.lower, amount: 0 })
      let chigh = chart.transform_x({ tick: bounds.upper, amount: 0 })
      setCursor('grabbing')
      const offset = x - initTickLower.x
      const tickPerPixel = (chigh - clow) / width
      const deltaTick = -offset * tickPerPixel
      let blow = chart.transform_x({ tick: initTickLower.lower, amount: 0 })
      const lowerTick = price2Tick(blow + deltaTick * token.sign, token)
      setHighlightBounds({ ...highlightBounds, lower: lowerTick })
      return
    }
    // dragging the upper bounds
    if (initTickUpper && highlightBounds !== undefined) {
      let clow = chart.transform_x({ tick: bounds.lower, amount: 0 })
      let chigh = chart.transform_x({ tick: bounds.upper, amount: 0 })
      setCursor('grabbing')
      const offset = x - initTickUpper.x
      const tickPerPixel = (chigh - clow) / width
      const deltaTick = -offset * tickPerPixel
      let bhigh = chart.transform_x({ tick: initTickUpper.upper, amount: 0 })
      const upperTick = price2Tick(bhigh + deltaTick * token.sign, token)
      setHighlightBounds({ ...highlightBounds, upper: upperTick })
      return
    }
    // dragging the highlight
    if (highlightSelected && initDrag && highlightBounds !== undefined) {
      //Highlight exists dragging hightlight
      let clow = chart.transform_x({ tick: bounds.lower, amount: 0 })
      let chigh = chart.transform_x({ tick: bounds.upper, amount: 0 })
      setCursor('grabbing')
      const offset = x - highlightSelected
      const tickPerPixel = (chigh - clow) / width
      const deltaTick = -offset * tickPerPixel
      let blow = chart.transform_x({ tick: initDrag.lower, amount: 0 })
      let bhigh = chart.transform_x({ tick: initDrag.upper, amount: 0 })
      const lowerTick = price2Tick(blow + deltaTick * token.sign, token)
      const upperTick = price2Tick(bhigh + deltaTick * token.sign, token)

      setHighlightBounds({ lower: lowerTick, upper: upperTick })
      return
    }
    // its a chart display area movement
    if (chartSelected !== undefined) {
      // moving left and right
      let clow = chart.transform_x({ tick: chartSelected.lower, amount: 0 })
      let chigh = chart.transform_x({ tick: chartSelected.upper, amount: 0 })
      setCursor('grabbing')
      const offset = x - chartSelected.x
      const tickPerPixel = (chigh - clow) / width
      const deltaTick = offset * tickPerPixel
      let lower = price2Tick(clow + deltaTick * token.sign, token)
      let upper = price2Tick(chigh + deltaTick * token.sign, token)
      if (lower > minTick && upper < maxTick) {
        setBounds({ lower, upper })
      }
      return
    }
    //Highlight does not exist, building highlight
    setCursor('pointer')
    if (initClick === x) {
      //Move the highlight
    } else {
      const bounds = { lower: 0, upper: 0 }
      bounds.lower = Math.min(xToTick(initClick), xToTick(x))
      bounds.upper = Math.max(xToTick(initClick), xToTick(x))
      setHighlightBounds(bounds)
    }
  }
  const onMouseDrag = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (editPosition) {
        return
      }
      const { x, y } = getMouseLocation(e)
      const pos = convertMouseLocation(getMouseLocation(e))
      const exactPos = convertExactMouseLocation(getMouseLocation(e))
      e.preventDefault()
      // if there are nothing clicked, then its a release i guess? so do this
      if (e.buttons <= 0) {
        if (y < height / 2) {
          setCursor('grab')
        } else {
          setCursor('pointer')
        }
        //hover state and highlight to get bar info
        let amount = 0
        let last = 0
        for (let i = 0; i < chart.data.length; i++) {
          const item = chart.data[i]
          if (item.tick >= pos.tick) {
            amount = last
            if (chart.data[i + 1]) {
              if (chart.data[i + 1].tick === pos.tick) {
                amount = amount + chart.data[i + 1].amount
              }
            }
            break
          }
          last = item.amount
        }
        const tk = { tick: exactPos.tick, amount: amount }
        setHoveredTick(tk)
        return
      }
      onCursorDrag(x)
      return
    },
    [token, bounds, chart, highlightBounds, initClick, initDrag, initTickUpper, initTickLower]
  )

  const onCursorDown = (x: number, y: number) => {
    const pos = convertMouseLocation({ x, y })
    const upperHalf = y < height / 2

    // now, regardless of where the click is, we set that we have began a click event
    setInitClick(x)
    // if its in the upper half, we only permit two actions
    if (upperHalf) {
      setCursor('grabbing')
      // move the highlight if selected
      if (highlightBounds && isBetween(highlightBounds.lower, highlightBounds.upper, pos.tick)) {
        //Click Highlight
        setHighlightSelected(x)
        setInitDrag(highlightBounds)
        return
      }
      // otherwise, start moving the chart
      setChartSelected({ x: x, upper: bounds.upper, lower: bounds.lower })
      return
    }
    // if highlight bounds exist, and we are in the bottom half, we need to check if its a drag
    if (highlightBounds) {
      setCursor('grabbing')
      let isBottomLine = isBetween(height * 0.9, height * 1.1, y)
      let lowerClicked = isBetween(
        highlightBounds.lower - tickSpacing * 2,
        highlightBounds.lower + tickSpacing * 2,
        pos.tick
      )
      let upperClicked = isBetween(
        highlightBounds.upper - tickSpacing * 2,
        highlightBounds.upper + tickSpacing * 2,
        pos.tick
      )
      let startTick = { x: x, lower: highlightBounds.lower, upper: highlightBounds.upper }
      if (isBottomLine && lowerClicked) {
        //Click Lower Tick Dragger
        setInitTickLower(startTick)
      } else if (isBottomLine && upperClicked) {
        //Click Upper Tick Dragger
        setInitTickUpper(startTick)
      } else if (isBetween(highlightBounds.lower, highlightBounds.upper, pos.tick)) {
        //Click Highlight
        setHighlightSelected(x)
        setInitDrag(highlightBounds)
      } else {
        //get rid of highlight
        setCursor('pointer')
        setHighlightBounds(undefined)
      }
      return
    }
    // it isnt in the highlight bounds, so we are creating a new one. we create highlight bounds. get the nearing valid tick
    const tickClicked = getNearestTick(pos.tick, tickSpacing, token)
    setHighlightBounds({ lower: tickClicked, upper: tickClicked + tickSpacing })
  }

  const onMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (editPosition) {
        return
      }
      const { x, y } = getMouseLocation(e)
      e.preventDefault()
      // resetting logic
      if (e.button === 1) {
        if (highlightBounds) {
          setBounds({ lower: highlightBounds.lower - 1, upper: highlightBounds.upper - 1 })
          setHighlightBounds(undefined)
        } else {
          setBounds(undefined)
        }
      }
      if (e.button === 0) {
        if (e.detail === 2) {
          setBounds(undefined)
        }
      }
      onCursorDown(x, y)
    },
    [highlightBounds, bounds, chart, token]
  )

  const onMouseUp = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault()
    const { x, y } = getMouseLocation(e)
    onCursorUp(x, y)
  }, [])

  const onCursorUp = (x: number, y: number) => {
    setHighlightSelected(undefined)
    setInitClick(undefined)
    setInitTickLower(undefined)
    setInitTickUpper(undefined)
    setChartSelected(undefined)
    if (y < height / 2) {
      setCursor('grab')
    } else {
      setCursor('pointer')
    }
  }

  const onZoomAction = (x: number, y: number, zoom: number, zoomOut: boolean) => {
    let currentPrice = chart.transform_x({ tick: currentTick, amount: 0 })
    let clow = chart.transform_x({ tick: bounds.lower, amount: 0 })
    let chigh = chart.transform_x({ tick: bounds.upper, amount: 0 })
    let lower
    let upper
    const diff = (chigh + clow) / 2 - chart.inv_x(x)
    let cmid = diff * zoom
    clow = Math.max(clow, 0)
    chigh = Math.max(chigh, 0)

    // TODO: make this configurable maybe?
    const sanePriceBounds = 25

    chigh = Math.min(chigh, currentPrice * sanePriceBounds)
    clow = Math.min(clow, currentPrice * sanePriceBounds)
    if (zoomOut) {
      lower = price2Tick(clow + zoom * clow, token)
      upper = price2Tick(chigh - zoom * chigh, token)
    } else {
      lower = price2Tick(clow - zoom * clow, token)
      upper = price2Tick(chigh + zoom * chigh, token)
    }
    lower = lower + cmid
    upper = upper + cmid
    if (Math.abs(lower - upper) > maxTick - minTick) {
      return
    }
    const bndz = {
      lower,
      upper,
    }
    setBounds(bndz)
  }
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const { x, y } = getMouseLocation(e)
      setHoveredTick(undefined)
      let zoom = 0.03

      if (Math.abs(bounds.upper - bounds.lower) < 250) {
        zoom = 0.0005
      }
      const zoomOut = token.sign * e.deltaY > 0
      onZoomAction(x, y, zoom, zoomOut)
    },
    [token, chart, bounds]
  )

  return (
    <div className="absolute" style={{ height: height, width: width, cursor: cursor }}>
      <svg
        width={width}
        height={height}
        className="absolute"
        onContextMenu={(e) => {
          e.preventDefault()
        }}
        onMouseDown={(e) => onMouseDown(e)}
        onMouseMove={(e) => onMouseDrag(e)}
        onMouseUp={(e) => onMouseUp(e)}
        onMouseLeave={() => setHoveredTick(undefined)}
        onWheel={(e) => onWheel(e)}
      />
    </div>
  )
}

export default ChartController
