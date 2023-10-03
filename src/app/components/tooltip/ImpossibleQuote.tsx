import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'

const ImpossibleQuoteToolTip = () => (
  <div className={`absolute left-5 -top-10 w-[180px] bg-[${colors.gray[900]}] rounded-lg p-2`}>
    <T3 color={colors.gray[200]}>May be due to server error or insufficient liquidity</T3>
  </div>
)

export default ImpossibleQuoteToolTip
