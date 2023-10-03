import { T2, T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'

export const StatValueCard = ({ stat, value }: { stat: string; value: React.ReactElement }) => {
  return (
    <div className="flex flex-col bg-gray-800 w-full border border-gray-700 rounded-[10px] py-4 px-3 gap-y-2">
      <T3 color={colors.gray[400]}>{stat}</T3>
      <T2 color={colors.gray[100]}> ${value}</T2>
    </div>
  )
}
