import { T3 } from '../typography/Typography'
import { IOrderSettings } from '../dropdown/OrderFormDropdown'
import Input from './NumberInput'
import { useEffect } from 'react'

interface ISlippageInput {
  settings: IOrderSettings
  setSettings: (value: IOrderSettings) => void
  value: string
  setValue: (value: string) => void
}

function SlippageInput(props: ISlippageInput) {
  const { settings, setSettings, value, setValue } = props

  useEffect(() => {
    setSettings({ ...settings, slippage: value === '' ? 0 : parseFloat(value) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const checkValue = (value: string) => {
    const slippage = parseFloat(value) > 100 ? '100' : value
    setValue(slippage)
  }

  return (
    <div className="flex flex-row items-center rounded-[4px]  min-w-[94px] max-w-[94px]  border-[1px] bg-[#141B2B] border-[#293249] gap-1 pr-2">
      <Input value={value} onUserInput={checkValue} placeholder="" style={{ textAlign: 'right', color: '#7C85A2' }} />
      <T3>%</T3>
    </div>
  )
}

export default SlippageInput
