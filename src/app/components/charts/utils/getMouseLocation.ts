const getMouseLocation = (
  event:
    | React.MouseEvent<SVGSVGElement, MouseEvent>
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.WheelEvent
    | React.MouseEvent<HTMLElement, MouseEvent>
    | MouseEvent
    | React.TouchEvent<SVGSVGElement>
) => {
  const target = event.target as Element
  const dimensions = target.getBoundingClientRect()
  if (isTouchEvent(event)) {
    if (event.changedTouches.length > 0) {
      const x = event.changedTouches.item(0).clientX
      const y = event.changedTouches.item(0).clientY
      return { x, y }
    }
    const x = event.touches.item(0).clientX
    const y = event.touches.item(0).clientY
    return { x, y }
  } else {
    const x = event.clientX - dimensions.left
    const y = event.clientY - dimensions.top
    return { x, y }
  }
}

function isTouchEvent(object: any): object is React.TouchEvent<SVGSVGElement> {
  return !('clientX' in object && 'clientY' in object)
}

export default getMouseLocation
