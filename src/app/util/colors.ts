import rgba from 'color-rgba'

export function parseColor(input: string) {
  return rgba(input)
}

export const toRgba = (xs: number[]) => {
  return `rgba(${xs[0]},${xs[1]},${xs[2]},${xs[3]})`
}
