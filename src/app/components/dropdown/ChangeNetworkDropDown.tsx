import { useChainLoader } from '../../route/RouteWrapper'
import { T2 } from '../typography/Typography'
import useBreakpoint from '../../hooks/useBreakpoint'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums } from '../../types/Enums'
import { CHAIN_INFO, IChainInfo } from '../../constants/chainInfo'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useLocation, useMatches, useNavigate, useParams } from 'react-router-dom'
import { Chain } from 'wagmi'
import { useConfigContext } from '../../context/naked/ConfigContext'

function ChangeNetworkDropDown() {
  const { currentChainInfo } = useChainLoader()
  const iconSize = useBreakpoint({ base: '12px', sm: '16px' })
  const { isMobile } = useMobile()
  const {
    features: { Chains },
  } = useConfigContext()

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger
        trigger={
          <div className="flex items-center justify-between gap-1">
            <img
              src={currentChainInfo.logoUrl}
              style={{ width: iconSize, minWidth: iconSize, minHeight: iconSize, height: iconSize }}
              alt={currentChainInfo.name}
            />
            <div className="w-fit flex flex-1">
              {!isMobile && (
                <T2 className="flex whitespace-nowrap" weight={FontWeightEnums.REGULAR}>
                  {currentChainInfo?.name}
                </T2>
              )}
            </div>
          </div>
        }
        hasCarot
        classes="bg-[#212121]"
      />

      <DropdownItemsContainer sideOffset={6}>
        {Object.values(CHAIN_INFO)
          .sort((a, b) => {
            if (Chains.comingsoon.includes(a.internalName) < Chains.comingsoon.includes(b.internalName)) {
              return -1
            }
            if (a.id < b.id) {
              return -1
            } else if (a.id === b.id) {
              return 0
            }
            return 1
          })
          .filter((network) => !Chains.hidden.includes(network.internalName) && network.id !== currentChainInfo.id)
          .map((network) => {
            return network.id !== currentChainInfo?.id ? (
              <DropdownItem key={network.id}>
                <NetworkButton
                  key={network.id}
                  chain_info={network}
                  chain={currentChainInfo}
                  comingSoon={Chains.comingsoon.includes(network.internalName)}
                />
              </DropdownItem>
            ) : (
              <></>
            )
          })}
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

export default ChangeNetworkDropDown

const NetworkButton = ({
  chain_info,
  chain,
  comingSoon,
}: {
  chain_info: IChainInfo
  comingSoon: boolean
  chain:
    | (Chain & {
        unsupported?: boolean | undefined
      })
    | undefined
}) => {
  const navigate = useNavigate()
  useLocation()

  const shouldDisable = comingSoon || chain_info.id === chain?.id

  const { chain: chainPath } = useParams()
  const { pathname } = useLocation()

  const matches = useMatches()

  return (
    <button
      className={`text-white ${comingSoon ? 'line-through' : ''} flex items-center px-4 py-2  text-sm`}
      disabled={shouldDisable}
      key={chain_info.id}
      onClick={() => {
        let match
        for (const m of matches.reverse()) {
          if (m.handle) {
            const base = (m.handle as any).base
            if (base) {
              match = base
              break
            }
          }
        }
        if (match) {
          navigate(`../${chain_info.internalName}/${match}/`)
        } else {
          let newPath = pathname.replace(chainPath ? chainPath : 'ethereum', chain_info.internalName)
          navigate(newPath)
        }
      }}
    >
      <img
        src={chain_info.logoUrl || CHAIN_INFO[1].logoUrl}
        className="w-5 h-5 mr-2"
        alt={chain_info.name}
        style={{ width: 16, height: 16 }}
      />
      {chain_info.name}
    </button>
  )
}
