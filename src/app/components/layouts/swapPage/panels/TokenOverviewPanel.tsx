import { useChainLoader } from '../../../../route/RouteWrapper'
import { FormatNumber } from '../../../numbers/FormatNumber'
import { T1, T2, T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { IToken } from '../../../../lib/getToken'
import { isStableCoin } from '../../../../lib/isStableCoin'
import { FontWeightEnums } from '../../../../types/Enums'
import { formatNumberToString } from '../../../../util/formatNumbers'
import { getTokenSymbol } from '../../../../util/getTokenName'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import TokenSwitch from '../../../switch/TokenSwitch'
import { PercentChangeCard } from '../cards/PercentChange'
import { StatValueCard } from '../cards/StatValue'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { usePoolTokenInfo } from '../../../../hooks/usePoolTokenInfo'
import { TokenOverview } from '@gfxlabs/oku'

interface ITokenOverviewPanel {
  token0: IToken
  token1: IToken
  tokenOverview0: TokenOverview | undefined
  tokenOverview1: TokenOverview | undefined
}

function TokenOverviewPanel(props: ITokenOverviewPanel) {
  const { token0, token1, tokenOverview0, tokenOverview1 } = props
  const { currentChain } = useChainLoader()

  const { token, setToken } = usePoolTokenInfo()

  useEffect(() => {
    // set to default to not on the stablecoin
    const isToken0Stable = isStableCoin(currentChain, token0.address)
    const isToken1Stable = isStableCoin(currentChain, token1.address)

    if (!((isToken0Stable && isToken1Stable) || (!isToken0Stable && !isToken1Stable))) {
      if (isToken1Stable) {
        setToken(0)
      } else {
        setToken(1)
      }
    }
  }, [token0.address, token1.address])

  const [selectedToken, setSelectedToken] = useState(token.selected === 0 ? tokenOverview0 : tokenOverview1)

  useEffect(() => {
    if (tokenOverview0 && tokenOverview1 && token) {
      token.selected === 0 ? setSelectedToken(tokenOverview0) : setSelectedToken(tokenOverview1)
    }
  }, [tokenOverview0, tokenOverview1, token])

  return (
    <div
      className={`flex flex-1 flex-col bg-red-400 rounded-lg border-[1px]  border-[${colors.gray[800]}] p-3`}
      style={{ backgroundColor: colors.gray.dark }}
    >
      <div className="flex justify-between w-full">
        <T2 weight={FontWeightEnums.MEDIUM} color={colors.gray[50]}>
          Token Overview
        </T2>

        <div>
          <TokenSwitch
            setTokenSelected={setToken}
            token={token}
            token0Address={token0.address}
            token0Symbol={token0.symbol!}
            token1Address={token1.address}
            token1Symbol={token1.symbol!}
            isLogo={true}
          />
        </div>
      </div>
      <div>
        {selectedToken ? (
          <div>
            <T3 color={colors.gray[400]}>
              {selectedToken.name} ({getTokenSymbol(selectedToken.address, selectedToken.symbol, currentChain)})
            </T3>

            <div className="flex content-end mt-2">
              <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
                ${selectedToken.cg_token_info && formatNumberToString(selectedToken.cg_token_info?.current_price)}
              </T1>

              <div className="flex items-end ml-2">
                {selectedToken.price_deltas.day_change_usd > 0 ? (
                  <ArrowUpIcon width={12} fill={colors.green[300]} className="mb-[2px]" />
                ) : (
                  <ArrowDownIcon width={12} fill={colors.red[500]} className="mb-[2px]" />
                )}
                <p
                  className={`${
                    selectedToken.price_deltas.day_change_usd > 0 ? 'text-green-500' : 'text-red-500'
                  } text-xs`}
                >
                  <FormatNumber num={(selectedToken.price_deltas.day_change_usd * 100).toFixed(2)} />%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 mt-5 gap-x-2">
              {selectedToken.circulating_market_cap_usd > 0 && (
                <StatValueCard
                  stat="Market Cap"
                  value={<FormatNumber num={selectedToken.circulating_market_cap_usd} />}
                />
              )}
              {selectedToken.fully_diluted_market_cap_usd > 0 && (
                <StatValueCard
                  stat="Fully Diluted Valuation"
                  value={<FormatNumber num={selectedToken.fully_diluted_market_cap_usd} />}
                />
              )}
            </div>
            <div className="grid grid-cols-3 mt-5 gap-x-2 gap-y-2">
              <PercentChangeCard time="1h" percent={selectedToken.price_deltas.hour_change_usd} />
              <PercentChangeCard time="24h" percent={selectedToken.price_deltas.day_change_usd} />
              <PercentChangeCard time="7d" percent={selectedToken.price_deltas.week_change_usd} />
              <PercentChangeCard time="14d" percent={selectedToken.price_deltas.two_week_change_usd} />
              <PercentChangeCard time="30d" percent={selectedToken.price_deltas.month_change_usd} />
              <PercentChangeCard time="1y" percent={selectedToken.price_deltas.year_change_usd} />
            </div>
          </div>
        ) : (
          <SkeletonLines lines={6} random />
        )}
      </div>
    </div>
  )
}

export default TokenOverviewPanel
