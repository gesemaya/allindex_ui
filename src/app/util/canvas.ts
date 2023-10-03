import { Context } from 'konva/lib/Context'

export class Helper {
  ctx: Context

  constructor(ctx: Context) {
    this.ctx = ctx
  }

  do(lambda: (ctx: Context) => void) {
    return lambda(this.ctx)
  }

  doStroke(lambda: (ctx: Context) => void) {
    this.ctx.beginPath()
    this.do(lambda)
    this.ctx.stroke()
    return 0
  }

  doFill(lambda: (ctx: Context) => void) {
    this.ctx.beginPath()
    this.do(lambda)
    this.ctx.fill()
    return 0
  }

  doStrokeFill(lambda: (ctx: Context) => void) {
    this.ctx.beginPath()
    this.do(lambda)
    this.ctx.stroke()
    this.ctx.fill()
    return 0
  }
}
