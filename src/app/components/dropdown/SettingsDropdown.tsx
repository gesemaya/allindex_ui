import SettingsButton from '../buttons/SettingsButton'
import AppLayoutModal from '../modals/AppLayoutModal'
import { DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function SettingsDropdown() {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger trigger={<SettingsButton />} classes=" !p-0" />

      <DropdownItemsContainer align="start">
        <AppLayoutModal />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

export default SettingsDropdown
