import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'

const LimitOrderPriceInputToolTip = () => {
  return (
    <div className={`absolute left-24 top-4 w-48 h-24 bg-[${colors.gray[700]}] rounded-lg p-3`}>
      <div className="text-left">
        <T3>
          Uniswap V3 has a minimum tick size similar to traditional exchanges, which limits where users are allowed to
          place orders.
        </T3>
      </div>
    </div>
  )
}

export default LimitOrderPriceInputToolTip
