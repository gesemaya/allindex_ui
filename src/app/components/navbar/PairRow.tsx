import { useChainLoader } from '../../route/RouteWrapper'
import useBreakpoint, { breakpoints, stringBreakpoints } from '../../hooks/useBreakpoint'
import useMobile from '../../hooks/useMobile'
import { updateMarketWatch } from '../../lib/marketWatch'
import { useDataContext } from '../../context/DataContext'
import StarButton from '../buttons/StarButton'
import PairDropdown, { PoolPair } from '../dropdown/PairDropdown'
import PairPullUp from '../dropdown/PairPullUp'
import InfoBar from './InfoBar'
import { useEffect, useState } from 'react'

function PairRow() {
  const { favoritePool, setFavoritePool, poolSummary, token0, token1 } = useDataContext()
  const { currentChain } = useChainLoader()
  const poolGap = useBreakpoint({ base: '0px', md: '8px' })
  const [pools, setPools] = useState(favoritePool)
  const { isMobile } = useMobile()
  useEffect(() => {
    setPools(favoritePool)
  }, [favoritePool])

  const togglePool = (address: string) => {
    if (pools.includes(address)) {
      const poolsAfterRemove = updateMarketWatch('REMOVE', address, currentChain)
      setFavoritePool(poolsAfterRemove)
      setPools(poolsAfterRemove)
    } else {
      const poolsAfterAdd = updateMarketWatch('ADD', address, currentChain)
      setFavoritePool(poolsAfterAdd)
      setPools(poolsAfterAdd)
    }
  }
  return (
    pools && (
      <div className="outline outline-1 outline-gray-800 rounded-lg flex flex-row items-center gap-x-4 px-[18px] bg-[#0E0E0E]">
        <div className="w-fit flex items-center md:flex-row" style={{ gap: poolGap }}>
          {isMobile ? <PairPullUp /> : <PairDropdown />}
          <StarButton isStarred={pools.includes(poolSummary.address)} onClick={() => togglePool(poolSummary.address)} />
        </div>
        <div className="overflow-x-auto no-scrollbar w-fit flex flex-row items-center gap-x-4">
          <InfoBar />
        </div>
      </div>
    )
  )
}

export default PairRow
