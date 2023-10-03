import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const useDebounce = <T>({ value, delay = 250 }: { value: T; delay?: number }): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )

  return debouncedValue
}

export function useDebounceState<S>(initialState: S | (() => S), delay = 250): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState)
  const debounceValue = useDebounce({ value: state, delay: delay })
  if (delay === 0) {
    return [state, setState]
  }
  return [debounceValue, setState]
}
