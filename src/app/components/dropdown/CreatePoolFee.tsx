import { T3 } from '../../components/typography/Typography'
import { FontWeightEnums } from '../../types/Enums'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const factor = 10000

const feeTiers = [100, 500, 3000, 10000]

interface IFeeTierButton {
  fee: number
  setFee: (fee: number) => void
}

function CreatePoolFeeDropdown({ fee, setFee }: { setFee: (value: number) => void; fee: number | undefined }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger hasCarot trigger={<DropdownButton fee={fee} />} classes="border border-[#293249] h-[34px]" />
      <DropdownItemsContainer>
        <DropdownModal setFee={setFee} />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

const DropdownModal = ({ setFee }: { setFee: (fee: number) => void }) => {
  return (
    <>
      {feeTiers.map((fee, index) => (
        <FeeButton key={index} setFee={setFee} fee={fee} />
      ))}
    </>
  )
}

const DropdownButton = ({ fee }: { fee: number | undefined }) => {
  const factor = 10000
  return (
    <div>
      <T3>{fee ? (fee / factor).toString().concat('% Fee tier') : 'Select'}</T3>
    </div>
  )
}

const FeeButton = (props: IFeeTierButton) => {
  const { fee, setFee } = props

  return (
    <DropdownItem
      classes="text-white flex justify-start px-2 py-2 w-[var(--radix-dropdown-menu-trigger-width)]"
      onClick={() => {
        setFee(fee)
      }}
    >
      <div className="w-[56px] flex flex-start">
        <T3 weight={FontWeightEnums.MEDIUM}>{(fee / factor).toString().concat('%')}</T3>
      </div>
    </DropdownItem>
  )
}

export default CreatePoolFeeDropdown
