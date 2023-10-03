import { FormatNumber } from '../../../numbers/FormatNumber'
import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { formatNumberToString } from '../../../../util/formatNumbers'
import { PoolSummary } from '@gfxlabs/oku'
import TrendingPoolTitle from './TrendingPoolTitle'

function TrendingTopLoserItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center">
      <div className="flex  flex-[19] ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex flex-[7] justify-end">
        <T3>${<FormatNumber num={pool.t0_price_usd} singleLetterNotation={true} />}</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.green[400]}>${formatNumberToString(pool.t1_volume_usd + pool.t0_volume_usd)}</T3>
      </div>
    </div>
  )
}

export default TrendingTopLoserItem
