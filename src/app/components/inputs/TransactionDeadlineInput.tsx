import { IOrderSettings } from '../dropdown/OrderFormDropdown'
import Input from './NumberInput'
import { useEffect } from 'react'

interface ITransactionDeadlineInput {
  settings: IOrderSettings
  setSettings: (value: IOrderSettings) => void
  value: string
  setValue: (value: string) => void
}

function TransactionDeadlineInput(props: ITransactionDeadlineInput) {
  const { settings, setSettings, value, setValue } = props

  useEffect(() => {
    setSettings({ ...settings, transactionDeadline: value === '' ? 0 : parseFloat(value) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="flex flex-row items-center rounded-[4px] max-w-[57px] border-[1px] bg-[#141B2B] border-[#293249] gap-1 pr-2">
      <Input value={value} onUserInput={setValue} placeholder="" style={{ textAlign: 'right', color: '#7C85A2' }} />
    </div>
  )
}

export default TransactionDeadlineInput
