// a function that takes in a positions_AllPositions object and returns the total uncollected fees in dollar value
import { UserPositions } from '@gfxlabs/oku'
import { formatUnits } from 'ethers/lib/utils.js'

const calculateUncollectedFeesFromPosition = (position: UserPositions) => {
  const { current_fee_info, position_pool_data } = position
  const { token0FeesCollected, token1FeesUncollected } = current_fee_info
  const { token0_decimals, token0_price_usd, token1_decimals, token1_price_usd } = position_pool_data

  const token0FeesInDollarValue = parseFloat(formatUnits(token0FeesCollected, token0_decimals)) * token0_price_usd
  const token1FeesInDollarValue = parseFloat(formatUnits(token1FeesUncollected, token1_decimals)) * token1_price_usd

  return token0FeesInDollarValue + token1FeesInDollarValue
}

export default calculateUncollectedFeesFromPosition
