import { IBarEntry, IChartAttributes } from './type'

export class ChartRenderer<T> {
  width: number
  height: number
  attrs: IChartAttributes<T>
  data: T[]
  scaled: Array<IBarEntry<T>>

  min_x: number
  max_x: number
  min_y: number
  max_y: number

  shift_x: number = 0
  shift_y: number = 0
  stretch_x: number = 0
  stretch_y: number = 0

  constructor(attrs: IChartAttributes<T>, data: Array<T>, width: number, height: number) {
    this.attrs = attrs
    this.width = width
    this.height = height
    this.data = data
    const t1 = this.attrs.before(data)
    const raw = t1.map((n) => {
      const item = render_raw(this.attrs, n)
      return item
    })
    let lastWidth = 0
    if (raw.length > 0) {
      lastWidth = raw[raw.length - 1].width
    }
    const xs = raw.map((t) => t.x)
    this.min_x = Math.min(...xs)
    this.max_x = Math.max(...xs) + lastWidth
    const ys = raw.map((t) => t.y)
    this.min_y = Math.min(...ys)
    this.max_y = Math.max(...raw.map((t) => t.y + t.height))
    this.shift_x = -this.min_x
    this.shift_y = -this.min_y
    this.stretch_x = this.width / (this.max_x - this.min_x)
    this.stretch_y = this.height / (this.max_y - this.min_y)
    this.scaled = this.transform(data)
  }

  transform(dat: Array<T>) {
    const t1 = this.attrs.before(dat)
    const raw = t1.map((n) => {
      return render_raw(this.attrs, n)
    })
    const bars = raw.map((n) => {
      let out: IBarEntry<T> = { ...n }
      out.width = n.width * this.stretch_x
      out.height = n.height * this.stretch_y
      out.x = this.scale_x(n.x)
      out.y = this.scale_y(n.y)
      return out
    })
    return bars.filter((x) => {
      // setting this to >= returns dead spots in pools
      return x.y >= 0
    })
  }

  transform_x(dat: T) {
    return this.attrs.x(dat)
  }

  scale_x(x: number): number {
    return (x + this.shift_x) * this.stretch_x
  }

  scale_y(y: number): number {
    return (y + this.shift_y) * this.stretch_y
  }

  inv_x(x: number): number {
    return x / this.stretch_x - this.shift_x
  }

  inv_y(y: number): number {
    return y / this.stretch_y - this.shift_y
  }
}

export const render_raw = <T>(attrs: IChartAttributes<T>, item: T): IBarEntry<T> => {
  return {
    data: item,
    x: attrs.x(item),
    y: attrs.y(item),
    width: attrs.width(item),
    height: attrs.height(item),
  }
}
