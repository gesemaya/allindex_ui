import { useChainLoader } from '../../../../route/RouteWrapper'
import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { getTokenLogoUrl } from '../../../../util/getTokenLogo'
import { getTokenSymbol } from '../../../../util/getTokenName'
import { shortenTokenSymbol } from '../../../../util/shortenTokenSymbol'
import { PoolSummary } from '@gfxlabs/oku'

function TrendingPoolTitle({ pool }: { pool: PoolSummary }) {
  const { currentChain } = useChainLoader()

  return (
    <div className="flex items-center gap-[5px]">
      <div className="flex flex-row gap-0 m-0 ">
        <div className="flex h-[18px] w-[18px] ">
          <img
            className="rounded-full bg-white z-[2] h-[18px] w-[18px] "
            src={getTokenLogoUrl(pool.t0, currentChain)}
            alt={pool.t0_symbol}
          />
        </div>
        <div className="flex ml-[-5px] h-[18px] w-[18px]">
          <img className="rounded-full bg-white" src={getTokenLogoUrl(pool.t1, currentChain)} alt={pool.t1_symbol} />
        </div>
      </div>
      <div className="flex flex-row">
        <T3>{shortenTokenSymbol(getTokenSymbol(pool.t0, pool.t0_symbol, currentChain)!)}</T3>
        <T3 color={colors.gray[400]}>/{shortenTokenSymbol(getTokenSymbol(pool.t1, pool.t1_symbol, currentChain)!)}</T3>
      </div>
      <T3>{pool.fee / 10000}%</T3>
    </div>
  )
}

export default TrendingPoolTitle
