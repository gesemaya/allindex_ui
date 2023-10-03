import { T3 } from '../typography/Typography'
import AutoButton from '../buttons/AutoButton'
import SettingsButton from '../buttons/SettingsButton'
import SlippageInput from '../inputs/SlippageInput'
import TransactionDeadlineInput from '../inputs/TransactionDeadlineInput'
import { DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'

interface IOrderDropdown {
  settings: IOrderSettings
  setSettings: (value: IOrderSettings) => void
}

export interface IOrderSettings {
  slippage: number
  transactionDeadline: number
  refreshSeconds?: number
}

function OrderFormDropdown(props: IOrderDropdown) {
  const { settings, setSettings } = props
  const [valueSlippage, setValueSlippage] = useState(settings.slippage.toString())
  const [valueDeadline, setValueDeadline] = useState(settings.transactionDeadline.toString())

  const onAuto = () => {
    setSettings({ slippage: 1, transactionDeadline: 30 })
    setValueDeadline('30')
    setValueSlippage('1')
  }

  return (
    <Dropdown.Root>
      <DropdownTrigger trigger={<SettingsButton />} classes=" !p-0" />

      <DropdownItemsContainer align="end">
        <div className={`h-fit p-3 flex flex-col`}>
          <T3>Settings</T3>
          <div className="flex flex-col mt-3">
            <T3>Slippage Tolerance:</T3>
            <div className="flex flex-row mt-[6px] mb-4 gap-2">
              <AutoButton onClick={onAuto} />
              <SlippageInput
                settings={settings}
                setSettings={setSettings}
                value={valueSlippage}
                setValue={setValueSlippage}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <T3>Transaction deadline:</T3>
            <div className="flex flex-row mt-[6px] gap-2 items-center">
              <TransactionDeadlineInput
                settings={settings}
                setSettings={setSettings}
                value={valueDeadline}
                setValue={setValueDeadline}
              />
              <T3>minutes</T3>
            </div>
          </div>
        </div>
      </DropdownItemsContainer>
    </Dropdown.Root>
  )
}

export default OrderFormDropdown
