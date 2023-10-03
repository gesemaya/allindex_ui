import { useChainLoader } from '../../../route/RouteWrapper'
import { IToken } from '../../../lib/getToken'
import runBackTest from '../../../util/runBackTest'
import { PoolSummary, PositionStatistics } from '@gfxlabs/oku'
import RunTestButton from '../../buttons/RunTestButton'
import TestAmountButton from '../../buttons/TestAmountButton'
import BackTestResult from './BackTestResult'
import { useState } from 'react'
import { track } from '@multibase/js'

export const BackTest = ({
  inputToken0,
  inputToken1,
  token0,
  token1,
  poolSummary,
  tick,
}: {
  inputToken0: string
  inputToken1: string
  token0: IToken
  token1: IToken
  poolSummary: PoolSummary
  tick:
    | {
        lower: number
        upper: number
      }
    | undefined
}) => {
  const { cushRpc } = useChainLoader()
  const { currentChainInfo } = useChainLoader()
  const [backtestOption, setBacktestOption] = useState(0)
  const [backTestResults, setBackTestResults] = useState<PositionStatistics | null>(null)
  const [backTestLoading, setBackTestLoading] = useState(false)

  const onBackTest = async () => {
    setBackTestLoading(true)
    const amount0 = convertTokenAmount(parseFloat(inputToken0), token0)
    const amount1 = convertTokenAmount(parseFloat(inputToken1), token1)
    track('run_backtest', {
      chain: currentChainInfo.name,
      token0: token0.symbol,
      token1: token1.symbol,
      amount0: amount0,
      amount1: amount1,
    })
    try {
      const backtestResult = await runBackTest(
        cushRpc,
        poolSummary.address,
        tick!,
        amount0,
        amount1,
        Date.now() - backtestOption * 24 * 60 * 60 * 1000,
        Date.now()
      )

      setBackTestResults(backtestResult)
    } catch (e) {
      window.log.log(e)
    } finally {
      setBackTestLoading(false)
    }
  }

  return backTestResults === null ? (
    <div className="flex flex-row justify-between">
      <div className=" h-fit flex gap-2">
        <TestAmountButton onClick={() => setBacktestOption(7)} value={7} focus={backtestOption === 7} />
        <TestAmountButton onClick={() => setBacktestOption(30)} value={30} focus={backtestOption === 30} />
        <TestAmountButton onClick={() => setBacktestOption(90)} value={90} focus={backtestOption === 90} />
      </div>
      <RunTestButton
        onClick={onBackTest}
        loading={backTestLoading}
        disabled={!(tick && inputToken0 !== '' && inputToken1 !== '' && backtestOption)}
      />
    </div>
  ) : (
    <BackTestResult setBackTestResult={setBackTestResults} backTestResults={backTestResults} />
  )
}

const convertTokenAmount = (amount: number, token: IToken) => {
  const tokenDecimal = token.decimals
  const value = amount * 10 ** tokenDecimal

  return '0x'.concat(Math.round(value).toString(16))
}
