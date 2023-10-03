import { FormatNumber } from '../../../numbers/FormatNumber'
import { T2 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'

export const PercentChangeCard = ({ time, percent }: { time: string; percent: number }) => {
  const color = percent > 0 ? colors.green[300] : colors.red[300]

  const Icon =
    percent > 0 ? (
      <ArrowUpIcon width={12} fill={colors.green[300]} />
    ) : (
      <ArrowDownIcon width={12} fill={colors.red[300]} />
    )
  return (
    <div className="flex bg-gray-800 border border-gray-700 rounded-[10px] py-4 px-3 gap-y-2 justify-between">
      <T2 color={colors.gray[100]}> {time}</T2>
      <div className="flex">
        {Icon}
        <T2 color={color}>
          <FormatNumber num={(percent * 100).toFixed(2)} />%
        </T2>
      </div>
    </div>
  )
}
