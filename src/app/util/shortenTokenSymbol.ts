export const shortenTokenSymbol = (symbol: string, maxChars: number = 6): string =>
  symbol.length <= maxChars ? symbol : `${symbol.slice(0, maxChars)}...`
