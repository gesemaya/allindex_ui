import { colors } from '../../../../../../constants/colors'
import { useThemeContext } from '../../../../../../context/naked/ThemeContext'
import { BetweenNumbers } from '../../../../../../util/between'
import { Helper } from '../../../../../../util/canvas'
import { parseColor, toRgba } from '../../../../../../util/colors'
import { useDataContext } from '../../../../../../context/DataContext'
import { ChartRenderer } from '../../draw'
import { ITick } from '../../type'
import styles from './lineChart.module.css'
import Konva from 'konva'
import { Context } from 'konva/lib/Context'
import { useCallback } from 'react'
import { Layer, Shape, Stage } from 'react-konva'

interface IBarChart {
  chart: ChartRenderer<ITick>
  height: number
  width: number
  hoveredTick: ITick | undefined
  currentTick: number
}

const createGradient = (
  context: Context,
  current_px: number,
  width: number,
  height: number,
  min_x: number,
  max_x: number,
  left: number[],
  right: number[],
  opacity: number
) => {
  left = [...left]
  right = [...right]
  left[3] = opacity
  right[3] = opacity
  const grd = context.createLinearGradient(0, height, width, height)
  if (BetweenNumbers(min_x, max_x, current_px)) {
    const caled = (current_px - min_x) / (max_x - min_x)
    const summed = left.map((num, idx) => {
      const frac = 0.5
      return num * frac + right[idx] * (1 - frac)
    })
    summed[3] = opacity
    grd.addColorStop(0, toRgba(left))
    grd.addColorStop(caled, toRgba(summed))
    grd.addColorStop(1, toRgba(right))
  } else {
    if (current_px < min_x) {
      const diff = min_x - current_px
      const windowSize = max_x - min_x
      let frac = (1 - diff / (diff + windowSize)) * 0.5
      const less_summed = left.map((num, idx) => {
        return num * frac + right[idx] * (1 - frac)
      })
      less_summed[3] = opacity
      grd.addColorStop(0, toRgba(less_summed))
      grd.addColorStop(1, toRgba(right))
    } else {
      const diff = current_px - max_x
      const windowSize = max_x - min_x
      let frac = (1 - diff / (diff + windowSize)) * 0.5
      const greater_summed = right.map((num, idx) => {
        return num * frac + left[idx] * (1 - frac)
      })
      greater_summed[3] = opacity
      grd.addColorStop(0, toRgba(left))
      grd.addColorStop(1, toRgba(greater_summed))
    }
  }
  return grd
}

function BarChart(props: IBarChart) {
  const { chart, height, width, hoveredTick, currentTick } = props
  const { colors: themeColors } = useThemeContext()
  const { token } = useDataContext()

  const drawLiquidity = useCallback(
    (context: Context, shape: Konva.Shape) => {
      const hp = new Helper(context)
      if (!chart) {
        return
      }
      if (chart.scaled.length < 2) {
        return
      }
      context.clearRect(0, 0, shape.attrs.width, shape.attrs.height)
      const current_px = chart.transform_x({ tick: currentTick, amount: 0 })
      let leftColor = parseColor(token.selected === 1 ? themeColors.neg_color : themeColors.pos_color)
      let rightColor = parseColor(token.selected === 0 ? themeColors.neg_color : themeColors.pos_color)
      const first = chart.scaled[0]
      hp.doStrokeFill((ctx) => {
        if (leftColor && rightColor) {
          const gradientArgs = [
            context,
            current_px,
            shape.attrs.width,
            shape.attrs.height,
            chart.min_x,
            chart.max_x,
            leftColor,
            rightColor,
          ] as const
          ctx.fillStyle = createGradient(...gradientArgs, 0.2)
          ctx.strokeStyle = createGradient(...gradientArgs, 0.8)
        }
        ctx.lineTo(token.selected === 1 ? 0 : shape.attrs.width, first.y)
        ctx.lineWidth = 2
        ctx.moveTo(first.x, shape.attrs.height)
        for (let idx = 0; idx < chart.scaled.length; idx = idx + 1) {
          const arr = chart.scaled
          const bar = chart.scaled[idx]
          //.map(fixCoord)
          const next = arr.slice(idx + 1, idx + 2).shift()
          const prev = idx !== 0 ? arr[idx - 1] : undefined
          if (!next) {
            ctx.lineTo(bar.x, bar.y)
            break
          }
          if (prev) {
            if (prev.data.tick === bar.data.tick) {
              ctx.lineTo(bar.x, Math.min(bar.y, prev.y))
            }
          }
          // ok now there - what if there are two liquidities in the middle with the same tick? (which there commonly will be!)
          if (!(next.data.tick === bar.data.tick)) {
            ctx.lineTo(bar.x, bar.y)
            ctx.lineTo(next.x, bar.y)
            ctx.lineTo(next.x, next.y)
          }
        }
        const last = chart.scaled[chart.scaled.length - 1]
        ctx.lineTo(last.x, last.y)
        ctx.lineTo(last.x, shape.attrs.height)
        if (currentTick < first.data.tick) {
          ctx.lineTo(token.selected === 1 ? 0 : shape.attrs.width, shape.attrs.height)
        }

        const strokeColor = parseColor(ctx.fillStyle.toString())
        if (strokeColor) {
          strokeColor[3] = 0.8
          ctx.strokeStyle = toRgba(strokeColor)
        }
      })
    },
    [token, currentTick, chart, hoveredTick]
  )

  const drawMidline = useCallback(
    (context: Context, shape: Konva.Shape) => {
      // this draws the gray bar
      const current_px = chart.transform_x({ tick: currentTick, amount: 0 })
      const current_x = chart.scale_x(current_px)
      const hp = new Helper(context)
      if (BetweenNumbers(chart.min_x, chart.max_x, current_px)) {
        hp.doStroke((ctx) => {
          ctx.strokeStyle = colors.gray[400]
          ctx.lineWidth = 1
          ctx.moveTo(current_x, shape.attrs.height)
          ctx.lineTo(current_x, 0)
        })
      }
    },
    [token, currentTick, chart, hoveredTick]
  )

  const drawHoverline = useCallback(
    (context: Context, shape: Konva.Shape) => {
      // this draws the gray bar
      const hp = new Helper(context)
      // now draw the hover
      if (hoveredTick) {
        const tsf = chart.transform([hoveredTick])[0]
        if (!tsf) {
          return
        }
        hp.doStroke((ctx) => {
          ctx.strokeStyle = '#3E607EAA'
          ctx.lineWidth = 1
          ctx.moveTo(tsf.x, shape.attrs.height)
          ctx.lineTo(tsf.x, 0)
        })
      }
    },
    [token, currentTick, chart, hoveredTick]
  )
  return (
    <div className="absolute   overflow-hidden flex-col" style={{ width: width, height: height }}>
      <div className={styles.barChartAnimation} style={{ width: width, backgroundColor: '#0E0E0E73' }} />
      <Stage width={width} height={height}>
        <Layer>
          <Shape sceneFunc={drawLiquidity} x={0} y={0} width={width} height={height} />
          <Shape sceneFunc={drawMidline} x={0} y={0} width={width} height={height} />
          <Shape sceneFunc={drawHoverline} x={0} y={0} width={width} height={height} />
        </Layer>
      </Stage>
      {/* <div className={styles.barChartAnimation} style={{ position: 'absolute', backgroundColor: '#08080b', height: height}}></div> */}
      {/*
          <canvas
          style={{
imageRendering: '-webkit-optimize-contrast',
}}
ref={canvasRef}
width={width}
height={height}
/>
        */}
    </div>
  )
}

export default BarChart
