import { OrderBookTick } from '@gfxlabs/oku'
import { ITrade } from './OrderBookItems'

export const filterAsks = (askEntries: OrderBookTick[]): ITrade[] => {
  let askSum = 0
  const f1 = askEntries.map((ask) => ({ ...ask, total: (askSum += Number(ask.size)) }))
  return f1.sort((a, b) => {
    return Number(b.price) - Number(a.price)
  })
}

export const filterBids = (bidEntries: OrderBookTick[]): ITrade[] => {
  let bidSum = 0

  const f1 = bidEntries.map((bid) => ({ ...bid, total: (bidSum += Number(bid.size)) }))
  return f1.sort((a, b) => {
    return Number(b.price) - Number(a.price)
  })
}
