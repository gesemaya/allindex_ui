// take in a list of granularities that can be positive or negative from the current price that's already sorted and a price and return an array of granularities that are close to the price

export const calculateSuggestedGranularities = (nums: number[]): { label: string; value: number; index: number }[] => {
  return nums.map((num, idx) => {
    let label = num < 1 ? Math.pow(10, num).toFixed(Math.abs(num)) : Math.pow(10, num).toString()
    return { label, value: num, index: idx }
  })
}
