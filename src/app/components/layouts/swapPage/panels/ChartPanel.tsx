import Panel from '../../../containers/Panel'
import { IToken } from '../../../../lib/getToken'
import { tokenChartTimeIncrementEnums } from '../../../../types/Enums'
import { useSwapPageContext } from '../../../../context/SwapPageContext'
import { IBounds } from '../../../charts/charts/lineChart/types'
import TokenChartPanel from '../../../charts/layouts/TokenChartPanel'
import { useState } from 'react'
import { TokenOverview } from '@gfxlabs/oku'

interface IChartPanel {
  height: number
  width: number
  token0: IToken
  token1: IToken
  tokenOverview0: TokenOverview | undefined
  tokenOverview1: TokenOverview | undefined
}

function ChartPanel(props: IChartPanel) {
  const { height, width, token0, token1, tokenOverview0, tokenOverview1 } = props
  const [timeIncrement, setTimeIncrement] = useState(tokenChartTimeIncrementEnums.DAY_1)
  const { flip } = useSwapPageContext()
  const [bounds, setBounds] = useState<IBounds | undefined>(undefined)

  return (
    <Panel>
      <div
        className="flex flex-1 gap-3 h-full "
        style={{ flexDirection: flip ? 'column-reverse' : 'column', height: height - 24, width: width }}
      >
        <TokenChartPanel
          height={height / 2 - 18}
          width={width}
          timeIncrement={timeIncrement}
          setTimeIncrement={setTimeIncrement}
          token={token0}
          xBounds={bounds}
          setXBounds={setBounds}
          price={tokenOverview0?.cg_token_info?.current_price}
        />
        <TokenChartPanel
          height={height / 2 - 18}
          width={width}
          timeIncrement={timeIncrement}
          setTimeIncrement={setTimeIncrement}
          token={token1}
          xBounds={bounds}
          setXBounds={setBounds}
          price={tokenOverview1?.cg_token_info?.current_price}
        />
      </div>
    </Panel>
  )
}

export default ChartPanel
