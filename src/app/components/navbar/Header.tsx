import Menu from '@/app/assets/iconComponents/Menu'
import univ3Logo from '@/app/assets/uni-v3.webp'
import { T2 } from '../typography/Typography'
import { useModalContext } from '../../context/naked/ModalContext'
import useBreakpoint, { stringBreakpoints } from '../../hooks/useBreakpoint'
import ConnectWalletButton from '../buttons/ConnectWalletButton'
import IconButton from '../buttons/IconButton'
import ChangeNetworkDropDown from '../dropdown/ChangeNetworkDropDown'
import SearchPoolDropDown from '../dropdown/SearchPoolDropDown'
import SettingsDropdown from '../dropdown/SettingsDropdown'
import NavBar from './NavBar'
import { useLocation } from 'react-router-dom'
import useWindowDimensions from '../../hooks/useWindowDimensions'

function Header() {
  const { setShowMobileMenu } = useModalContext()
  const { width } = useWindowDimensions()

  const isDesktop = width > 1070

  const ConnectWalletSpace = useBreakpoint({ base: '8px', sm: '10px' })
  const HeaderHeight = useBreakpoint({ base: '40px', sm: '50px' })
  const SearbhBarSpace = useBreakpoint({ base: '6px', sm: '10px', lg: '18px' })
  const margin = useBreakpoint({ base: '8px', sm: '16px' })
  const location = useLocation()

  const showIcon = useBreakpoint({ base: false, sm: true })

  return (
    <div
      style={{ height: HeaderHeight, paddingRight: margin, paddingLeft: margin }}
      className="bg-[#0E0E0E] grow flex flex-row items-center justify-between py-[6px] mt-2 lg:mt-0"
    >
      <div className={`flex flex-row justify-between w-full`} style={{ gap: ConnectWalletSpace }}>
        <NavBar />
        <div className="flex flex-row  items-center" style={{ gap: SearbhBarSpace }}>
          <div className="px-2 py-1 border rounded-md border-gray-500 bg-gray-900 flex items-center gap-x-1 min-w-[56px]">
            <img src={univ3Logo} alt="UNIv3" width={19} height={28} />
            <T2 className="mt-1">V3</T2>
          </div>
          <ChangeNetworkDropDown />
          <SearchPoolDropDown />
          <ConnectWalletButton />
          {!location.pathname.includes('/user') && (
            <div className="flex flex-row items-center">
              {!isDesktop ? (
                <IconButton
                  IconComponent={Menu}
                  onClick={() => setShowMobileMenu(true)}
                  iconClasses="stroke-gray-400"
                />
              ) : (
                <SettingsDropdown />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
