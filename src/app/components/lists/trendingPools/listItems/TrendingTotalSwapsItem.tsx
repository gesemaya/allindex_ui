import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { PoolSummary } from '@gfxlabs/oku'
import TrendingPoolTitle from './TrendingPoolTitle'

function TrendingTotalSwapsItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex  ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex ">
        <T3 color={colors.green[400]}>{pool.tx_count}</T3>
      </div>
    </div>
  )
}

export default TrendingTotalSwapsItem
