import { useDebounce } from '../../hooks/useDebounce'
import { useEffect, useState } from 'react'

interface IDebounceInput extends React.InputHTMLAttributes<HTMLInputElement> {
  onInputChange: (value: string) => void
  reset?: boolean
}

const DebounceInput = ({ onInputChange, reset, ...props }: IDebounceInput) => {
  const [value, setValue] = useState('')

  const debouncedValue = useDebounce({ value, delay: 500 })

  useEffect(() => {
    onInputChange(debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  useEffect(() => {
    if (reset) {
      setValue('')
    }
  }, [reset])

  return <input value={value} {...props} onChange={(e) => setValue(e.target.value)} />
}

export default DebounceInput
