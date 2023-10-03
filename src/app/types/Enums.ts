export enum ThemeEnums {
  DEFAULT = 'default',
  UNICORN_POWER = 'unicornPower',
  ACCESSIBLE = 'accessible',
  GALACTIC = 'galactic',
}

export enum LayoutEnums {
  DEFAULT = 'default',
  ALTERNATE = 'alternate',
}

export enum ChartEnums {
  CANDLE = 'candle',
  DEPTH = 'depth',
  TRADINGVIEW = 'tradingview',
}

export enum OrderFormTypeEnums {
  LIMIT = 'limit',
  MARKET = 'market',
  STOP = 'stop',
}

export enum OrderFormActionEnums {
  BUY = 'buy',
  SELL = 'sell',
}

export enum OrderStatusEnums {
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CLOSED = 'CLOSED',
  IN_RANGE = 'INRANGE',
  OUT_OF_RANGE = 'OUTRANGE',
  CLAIMED = 'CLAIMED',
  CANCELLED = 'CANCELLED',
}

export enum PositionStatusEnums {
  OUT_OF_RANGE = 'out of range',
  IN_RANGE = 'in range',
  CLOSED = 'closed',
}

export enum ChartLayoutEnums {
  DEFAULT = 'default',
  SPLIT = 'split',
}

export enum ChartSizeEnums {
  DEFAULT = 'default',
  LARGE = 'large',
}

export enum FontWeightEnums {
  BOLD = '700',
  SEMIBOLD = '600',
  MEDIUM = '500',
  REGULAR = '400',
}

export enum TrendingPoolsEnums {
  TVL = 'tvl',
  TOTAL_SWAPS = 'totalSwaps',
  VOLUME = 'volume',
  TOP_GAINERS = 'topGainers',
  TOP_LOSERS = 'topLosers',
}

export enum SwapChartEnums {
  VOLUME = 'volume',
  TVL = 'tvl',
  PRICE = 'price',
}

export enum tokenChartTimeIncrementEnums {
  DAY_1 = '1d',
  DAY_7 = '7d',
  DAY_14 = '14d',
  DAY_30 = '30d',
  YEAR_1 = '1y',
}

export enum AnalyticsPageEnums {
  OVERVIEW = 'overview',
  POOLS = 'pools',
  TOKENS = 'tokens',
  POSITIONS = 'positions',
  POOL = 'pool',
  TOKEN = 'token',
  POSITION = 'position',
}
