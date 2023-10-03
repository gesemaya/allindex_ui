import useWindowDimensions from './useWindowDimensions'

interface IBreakpoint<T> {
  base: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export const stringBreakpoints = { base: 'base', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const
export const breakpoints = { base: 0, sm: 640, md: 1024, lg: 1400, xl: 1600 }

function useBreakpoint<T>(props: IBreakpoint<T>): T {
  const { width } = useWindowDimensions()
  const base = props.base
  const sm = props.sm
  const md = props.md
  const lg = props.lg
  const xl = props.xl
  if (width >= breakpoints.base && width < breakpoints.sm) {
    return base
  } else if (width >= breakpoints.sm && width < breakpoints.md) {
    if (sm !== undefined) {
      return sm
    } else {
      return base
    }
  } else if (width >= breakpoints.md && width < breakpoints.lg) {
    if (md !== undefined) {
      return md
    } else if (sm !== undefined) {
      return sm
    } else {
      return base
    }
  } else if (width >= breakpoints.lg && width < breakpoints.xl) {
    if (lg !== undefined) {
      return lg
    } else if (md !== undefined) {
      return md
    } else if (sm !== undefined) {
      return sm
    } else {
      return base
    }
  } else {
    if (xl !== undefined) {
      return xl
    } else if (lg !== undefined) {
      return lg
    } else if (md !== undefined) {
      return md
    } else if (sm !== undefined) {
      return sm
    } else {
      return base
    }
  }
}

export default useBreakpoint
