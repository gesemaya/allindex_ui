import Refresh from '../../../assets/iconComponents/Refresh'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useDataContext } from '../../../context/DataContext'
import { PositionStatistics } from '@gfxlabs/oku'
import IconButton from '../../buttons/IconButton'

interface IBackTestResultContainer {
  backTestResults: PositionStatistics | null
  setBackTestResult: (value: PositionStatistics | null) => void
}

function BackTestResult(props: IBackTestResultContainer) {
  const { backTestResults, setBackTestResult } = props
  const { token0, token1 } = useDataContext()

  return (
    <div
      className="rounded-[16px] border-[1px] py-3 px-2 flex flex-col gap-4"
      style={{ borderColor: colors.gray[700] }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <T3>Summary</T3>
          <IconButton
            IconComponent={Refresh}
            containerClasses={`bg-blue-800 p-1 rounded-full`}
            iconClasses="stroke-blue-400 w-[12px] h-[12px]"
            onClick={() => setBackTestResult(null)}
          />
        </div>
        <div className="flex flex-row justify-between">
          <T3 color={colors.gray[300]}>{token0.symbol} Annualized APR:</T3>
          <T3>{backTestResults && <FormatNumber num={backTestResults?.raw_fee_apr0} />}%</T3>
        </div>
        <div className="flex flex-row justify-between">
          <T3 color={colors.gray[300]}>{token0.symbol} PnL:</T3>
          <T3>{backTestResults && <FormatNumber num={backTestResults?.net_potential_profit_quoted0} />}</T3>
        </div>
        <div className="flex flex-row justify-between">
          <T3 color={colors.gray[300]}>{token1.symbol} Annualized APR:</T3>
          <T3>{backTestResults && <FormatNumber num={backTestResults?.raw_fee_apr1} />}%</T3>
        </div>
        <div className="flex flex-row justify-between">
          <T3 color={colors.gray[300]}>{token1.symbol} PnL:</T3>
          <T3>{backTestResults && <FormatNumber num={backTestResults?.net_potential_profit_quoted1} />}</T3>
        </div>
      </div>
      <div className="flex flex-col  gap-1">
        <div className="flex flex-row justify-between">
          <T3 color={colors.gray[300]}>{token0.symbol} Fees:</T3>
          <T3>{backTestResults && <FormatNumber num={backTestResults?.fees_quoted0} />}</T3>
        </div>
        <div className="flex flex-row justify-between">
          <T3 color={colors.gray[300]}>{token1.symbol} Fees:</T3>
          <T3>{backTestResults && <FormatNumber num={backTestResults?.fees_quoted1} />}</T3>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <div className=" flex flex-row gap-1"></div>
        </div>
      </div>
    </div>
  )
}

export default BackTestResult
