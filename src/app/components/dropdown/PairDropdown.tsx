import { useChainLoader } from '../../route/RouteWrapper'
import { T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import { getTokenLogoUrl } from '../../util/getTokenLogo'
import { getTokenSymbol } from '../../util/getTokenName'
import { useDataContext } from '../../context/DataContext'
import PoolSection from '../lists/poolList/PoolSection'
import { SkeletonLine } from '../loadingStates/SkeletonLines'
import { CopyText } from '../misc/CopyText'
import BaseDropdown from './BaseDropdown'
import { useEffect, useState } from 'react'

function PairDropdown() {
  const { token0, token1, poolSummary } = useDataContext()
  const [showModal, setShowModal] = useState(false)

  const poolFee = poolSummary && (poolSummary.fee / 10000).toString()

  return token0 && token1 ? (
    <BaseDropdown
      showModal={showModal}
      setShowModal={setShowModal}
      buttonContent={<PairDropdownButton poolFee={poolFee} token0Info={token0} token1Info={token1} />}
      modalContent={
        <div
          className="p-2 rounded-xl text-white  flex flex-col flex-1  w-[400px] border-[1px]"
          style={{ borderColor: colors.gray[700], backgroundColor: colors.gray.dark }}
        >
          <PoolSection onClose={() => setShowModal(false)} />
        </div>
      }
      fullWidthModal
    />
  ) : (
    <SkeletonLine />
  )
}

export default PairDropdown

const PairDropdownButton = ({
  token0Info,
  token1Info,
  poolFee,
}: {
  poolFee?: string
  token0Info: IToken
  token1Info: IToken
}) => {
  return (
    <span className=" h-fit w-fit">
      <PoolPair poolFee={poolFee} token0Info={token0Info} token1Info={token1Info} showCopyIcon />
    </span>
  )
}

export const PoolPair = ({
  token0Info,
  token1Info,
  poolFee,
  showCopyIcon = false,
}: {
  token0Info?: IToken
  token1Info?: IToken
  poolFee?: string
  showCopyIcon?: boolean
}) => {
  const { currentChainInfo } = useChainLoader()
  return token0Info && token1Info ? (
    <h1 className="flex flex-row items-center gap-2 w-fit " title="Token Pair">
      <div className="flex relative mr-3">
        <div className="h-[18px] w-[18px] rounded-[18px] z-10">
          <img
            className="rounded-full"
            src={token0Info.logoURI}
            alt={getTokenSymbol(token0Info.address, token0Info.symbol, currentChainInfo.id)}
          />
        </div>
        <div className="h-[18px] w-[18px] rounded-[18px] absolute left-3">
          <img
            className="rounded-full"
            src={token1Info.logoURI}
            alt={getTokenSymbol(token1Info.address, token1Info.symbol, currentChainInfo.id)}
          />
        </div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        {poolFee && (
          <div className="py-1">
            <div className="text-sm text-white">{poolFee + '%'}</div>
          </div>
        )}
        {showCopyIcon ? (
          <>
            <div className="text-white font-semibold text-sm flex items-center gap-x-1">
              {getTokenSymbol(token0Info.address, token0Info.symbol, currentChainInfo.id)}{' '}
              <CopyText copyText={token0Info.address} />
            </div>
            <div className={`text-[${colors.gray[400]}] font-semibold text-sm flex items-center gap-x-1`}>/</div>
            <div className={`text-[${colors.gray[400]}] font-semibold text-sm flex items-center gap-x-1`}>
              {`${getTokenSymbol(token1Info.address, token1Info.symbol, currentChainInfo.id)}`}
              <CopyText copyText={token1Info.address} />
            </div>
          </>
        ) : (
          <>
            <div className="text-white font-semibold text-sm">
              {getTokenSymbol(token0Info.address, token0Info.symbol, currentChainInfo.id)}
            </div>
            <div className={`text-[${colors.gray[400]}] font-semibold text-sm`}>/</div>
            <div className={`text-[${colors.gray[400]}] font-semibold text-sm`}>{`${getTokenSymbol(
              token1Info.address,
              token1Info.symbol,
              currentChainInfo.id
            )}`}</div>
          </>
        )}
      </div>
    </h1>
  ) : (
    <SkeletonLine />
  )
}

export const PoolPairFromSymbol = ({
  token0Symbol,
  token1Symbol,
  token0Address,
  token1Address,
}: {
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
}) => {
  const { currentChainInfo } = useChainLoader()
  const [token0Logo, setToken0Logo] = useState<string>()
  const [token1Logo, setToken1Logo] = useState<string>()

  useEffect(() => {
    const token0Logo = getTokenLogoUrl(token0Address, currentChainInfo.id)
    const token1Logo = getTokenLogoUrl(token1Address, currentChainInfo.id)
    setToken0Logo(token0Logo)
    setToken1Logo(token1Logo)
  }, [token0Symbol, token1Symbol])

  return token0Logo && token1Logo ? (
    <div className="flex flex-row items-center w-fit gap-[26px]">
      <div className="flex">
        <div className="h-[18px] w-[18px] rounded-[18px]">
          <img className="rounded-full" src={token0Logo} alt={token0Symbol} />
        </div>

        <div className="absolute ml-[15px] h-[18px] w-[18px] rounded-[18px]">
          <img className="rounded-full" src={token1Logo} alt={token1Symbol} />
        </div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <T2>{token0Symbol}</T2>
        <T2 color={'#7C85A2'}>/{token1Symbol}</T2>
      </div>
    </div>
  ) : (
    <SkeletonLine />
  )
}
