import useBreakpoint from '../../../hooks/useBreakpoint'
import LiquidityChart from '../../charts/charts/liquidityChart/LiquidityChart'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

function ChartPanel() {
  const height = useBreakpoint({ base: 400, sm: 450 })
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }, [ref.current?.offsetWidth])

  useEffect(() => {
    const handleScroll = (e: any) => {
      if (ref.current && ref.current.contains(e.target)) {
        e.preventDefault()
      }
    }
    document.addEventListener('wheel', handleScroll, { passive: false })
    return () => {
      document.removeEventListener('wheel', handleScroll)
    }
  }, [ref])

  return (
    <div
      ref={ref}
      className="flex flex-col rounded-[16px] border-[1px] border-[#141B2B] bg-[#0b0b0ebb] p-4"
      style={{ height: height, minHeight: height, maxHeight: height }}
    >
      <LiquidityChart />
    </div>
  )
}

export default ChartPanel
