import { colors } from '../../constants/colors'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { IToken } from '../../lib/getToken'
import { useDataContext } from '../../context/DataContext'
import PoolSection from '../lists/poolList/PoolSection'
import BaseModal from '../modals/BaseModal'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { PoolPair } from './PairDropdown'

function PairPullUp() {
  const { token0, token1, poolSummary } = useDataContext()
  const [showModal, setShowModal] = useState(false)
  const { width, height } = useWindowDimensions()

  const poolFee = poolSummary && (poolSummary.fee / 10000).toString()
  return (
    <div className="z-30" style={{ zIndex: showModal ? 100 : 0 }}>
      <PairDropdownButton
        onClick={() => setShowModal(true)}
        poolFee={poolFee}
        token1Info={token0}
        token2Info={token1}
      />
      <BaseModal showModal={showModal} onClose={() => setShowModal(false)} offsetLeft={0} offsetTop={height - 300}>
        <div
          className=" py-4 px-8  text-white  flex flex-col  border-[1px] "
          style={{
            borderColor: colors.gray[700],
            backgroundColor: colors.gray.dark,
            width: width,
            height: 300,
          }}
        >
          <PoolSection
            onClose={() => {
              setShowModal(false)
            }}
          ></PoolSection>
        </div>
      </BaseModal>
    </div>
  )
}

export default PairPullUp

const PairDropdownButton = ({
  token1Info,
  token2Info,
  poolFee,
  onClick,
}: {
  token1Info: IToken
  token2Info: IToken
  poolFee?: string
  onClick: () => void
}) => {
  return (
    <button onClick={onClick} className=" h-fit w-fit flex flex-row items-center gap-2 ">
      <PoolPair poolFee={poolFee} token0Info={token1Info} token1Info={token2Info} showCopyIcon={false} />
      <ChevronDownIcon color={colors.white} width={16} />
    </button>
  )
}
