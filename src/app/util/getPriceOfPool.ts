import { PoolSummary } from '@gfxlabs/oku'

const getPriceOfPool = (poolSummarylevel1: PoolSummary) => {
  const { t1_price, t0_price, is_preferred_token_order } = poolSummarylevel1

  const price = is_preferred_token_order ? t0_price : t1_price

  return price
}

export default getPriceOfPool
