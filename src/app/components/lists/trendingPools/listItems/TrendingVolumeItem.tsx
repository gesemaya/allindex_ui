import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { formatNumberToString } from '../../../../util/formatNumbers'
import { PoolSummary } from '@gfxlabs/oku'
import TrendingPoolTitle from './TrendingPoolTitle'

function TrendingVolumeItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center">
      <div className="flex  flex-[19] ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex flex-[7] justify-end">
        <T3>${formatNumberToString(pool.t0_volume_usd + pool.t1_volume_usd)}</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.green[400]}>
          ${formatNumberToString(pool.t0_volume_7d * pool.t0_price_usd + pool.t1_volume_7d * pool.t1_price_usd)}
        </T3>
      </div>
    </div>
  )
}

export default TrendingVolumeItem
