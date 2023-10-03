import { useChainLoader } from '../../route/RouteWrapper'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IChainInfo } from '../../constants/chainInfo'
import { usePositionMakerContext } from '../../context/PositionMakerContext'
import ManageButton from '../buttons/ManageButton'
import { useChartDataContext } from '../charts/context/ChartDataContext'
import ClaimFeesModal from '../modals/positionMakerPage/ClaimFeesModal'
import ClosePositionModal from '../modals/positionMakerPage/ClosePositionModal'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import { UserPositions } from '@gfxlabs/oku'
import { ArrowUpTrayIcon, EllipsisVerticalIcon, FaceSmileIcon } from '@heroicons/react/24/solid'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ManagePositionDropdown({ position, useEllipsis = false }: { position: UserPositions; useEllipsis?: boolean }) {
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  // const { setPoolAddress } = useParams()
  const { setHighlightBounds } = useChartDataContext()
  const { currentChainInfo } = useChainLoader()

  const { setEditPosition, setPosition } = usePositionMakerContext()
  const navigate = useNavigate()

  const onClaim = () => {
    setShowClaimModal(true)
  }

  const onClose = () => setShowCloseModal(true)

  // TODO: replace this with an action, and use that to navigate and set bounds, manage state via query args.
  const onEdit = () => {
    setEditPosition(true)
    setPosition(position)
    setHighlightBounds({ lower: position.tickLower, upper: position.tickUpper })
    navigate(`/${currentChainInfo.internalName}/liquidity/${position.pool}`)
  }

  return (
    <>
      <DropdownMenu.Root modal={false}>
        <DropdownTrigger
          hasCarot={!useEllipsis}
          trigger={<DropDownButton useEllipsis={useEllipsis} />}
          classes={`${
            useEllipsis ? 'px-2 py-2 bg-gray-700 w-fit' : 'w-full flex gap-2 items-center px-3 py-2 bg-blue-500'
          }`}
        />

        <DropdownItemsContainer align="end" sideOffset={6}>
          <DropdownModal
            onClosePosition={onClose}
            onClaim={onClaim}
            onEdit={onEdit}
            isClaimDisabled={
              (position.current_fee_info.token0FeesUncollected === '0x0' &&
                position.current_fee_info.token1FeesUncollected === '0x0') ||
              position.tokenId === '0'
            }
            isEditDisabled={position.tokenId === '0'}
            isCloseDisabled={position.current_liquidity === '0x0' || position.tokenId === '0'}
            currentChainInfo={currentChainInfo}
            position={position}
          />
        </DropdownItemsContainer>
      </DropdownMenu.Root>
      <ClaimFeesModal showModal={showClaimModal} setShowModal={setShowClaimModal} position={position} />
      <ClosePositionModal showModal={showCloseModal} setShowModal={setShowCloseModal} position={position} />
    </>
  )
}

export default ManagePositionDropdown

interface IDropdownModal {
  onClosePosition: () => void
  onClaim: () => void
  onEdit: () => void
  isCloseDisabled: boolean
  isClaimDisabled: boolean
  isEditDisabled: boolean
  currentChainInfo: IChainInfo
  position: UserPositions
}

const DropdownModal = (props: IDropdownModal) => {
  const {
    onClosePosition,
    onClaim,
    onEdit,
    isCloseDisabled,
    isClaimDisabled,
    isEditDisabled,
    currentChainInfo,
    position,
  } = props
  return (
    <>
      <DropdownItem classes="pt-3 pb-2 px-3">
        <a href={`${currentChainInfo.scanUrl}tx/${position.starting_amounts.mint_tx}`} target="_blank" rel="noreferrer">
          <T3 color={colors.blue[400]}>{currentChainInfo.scanSite}</T3>
        </a>
      </DropdownItem>
      <DropdownItem
        classes={`flex flex-row w-full justify-between px-3 pt-3 ${
          isEditDisabled ? 'opacity-40' : ''
        } pb-2 hover:bg-[#1f2739] gap-x-3"`}
        onClick={onEdit}
        disabled={isEditDisabled}
      >
        <T3>Edit Position</T3>
        <ArrowUpTrayIcon width={12} fill={colors.gray[200]} />
      </DropdownItem>
      <DropdownItem
        classes={`flex flex-row w-full justify-between px-3 py-2 ${
          isClaimDisabled ? 'opacity-40' : ''
        }  hover:bg-[#1f2739]`}
        disabled={isClaimDisabled}
        onClick={onClaim}
      >
        <T3>Claim Fees</T3>
        <FaceSmileIcon width={12} fill={colors.gray[200]} />
      </DropdownItem>
      <DropdownItem
        classes={`flex flex-row w-full justify-between px-3 pb-3 pt-2  ${
          isCloseDisabled ? 'opacity-40' : ''
        } hover:bg-[#1f2739] rounded-b-[10px]`}
        disabled={isCloseDisabled}
        onClick={onClosePosition}
      >
        <T3>Close</T3>
      </DropdownItem>
    </>
  )
}

interface IButton {
  useEllipsis?: boolean
}

const DropDownButton = (props: IButton) => {
  const { useEllipsis } = props
  return useEllipsis ? <EllipsisVerticalIcon width={12} color={colors.gray[50]} className="m-0" /> : <ManageButton />
}
