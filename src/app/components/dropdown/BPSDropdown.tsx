import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import BaseDropdown from './BaseDropdown'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface IDropdown {
  setFee: (value: number | undefined) => void
  fee?: number
}

function BPSDropdown(props: IDropdown) {
  const { setFee, fee } = props
  const [showModal, setShowModal] = useState(false)

  return (
    <BaseDropdown
      showModal={showModal}
      setShowModal={setShowModal}
      buttonContent={<DropdownButton fee={fee} setShowModal={setShowModal} />}
      modalContent={<DropdownModal setFee={setFee} setShowModal={setShowModal} />}
      showCarot={false}
    />
  )
}

export default BPSDropdown

interface IButton {
  onClick: (value: number | undefined) => void
  fee: number | undefined
}

const FeeButton = (props: IButton) => {
  const { onClick, fee } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      key={fee}
      onClick={() => onClick(fee)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`py-2 px-2 justify-center rounded-[4px] flex`}
      style={{ background: hover ? getHoverColor('#0E111A') : '#0E111A' }}
    >
      <T3 key={fee}>{fee !== undefined ? (fee / 10000).toFixed(2).concat(' %') : 'All Fees'}</T3>
    </button>
  )
}

const DropdownButton = ({ setShowModal, fee }: { fee?: number; setShowModal: (bool: boolean) => void }) => {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={() => setShowModal(true)}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      className="flex items-center gap-1 rounded-[4px] h-[24px] flex-row jusitfy-between border-[1px]"
      style={{ backgroundColor: hover ? getHoverColor('##0F1012') : '##0F1012', borderColor: '#293249' }}
    >
      <div className="w-full flex flex-row justify-between px-1">
        <T3>{fee ? (fee / 10000).toFixed(2) + '%' : 'Fees'}</T3>
        <ChevronDownIcon width={14} color={colors.gray[200]} />
      </div>
    </div>
  )
}

const DropdownModal = ({
  setFee,
  setShowModal,
}: {
  setFee: (fee: number | undefined) => void
  setShowModal: (bool: boolean) => void
}) => {
  const fees = [undefined, 100, 500, 3000, 10000]
  const onClick = (fee: number | undefined) => {
    setFee(fee)
    setShowModal(false)
  }
  return (
    <div
      className=" border-[1px] rounded-[4px] h-fit  flex flex-col"
      style={{ borderColor: colors.gray[700], backgroundColor: colors.gray[900] }}
    >
      {fees.map((feeItem) => (
        <FeeButton key={feeItem} fee={feeItem} onClick={onClick} />
      ))}
    </div>
  )
}
