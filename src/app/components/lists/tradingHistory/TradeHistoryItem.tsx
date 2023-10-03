import { FormatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useThemeContext } from '../../../context/naked/ThemeContext'
import { useDataContext } from '../../../context/DataContext'
import { Swap } from '@gfxlabs/oku'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'

interface ITradeHistoryItem {
  trade: Swap
  scanUrl: string
  isNew: boolean
}

const TradeHistoryItem = (props: ITradeHistoryItem) => {
  const { trade, scanUrl, isNew } = props
  const { colors: themeColors } = useThemeContext()
  const { token } = useDataContext()
  const date = new Date(trade.time)
  const avgPrice = token.selected === 0 ? 1 / trade.avg_price : trade.avg_price
  const [isBlinking, setIsBlinking] = useState(isNew)
  const windowSize = useWindowSize()

  useEffect(() => {
    setIsBlinking(isNew)
  }, [isNew])
  useEffect(() => {
    if (isBlinking) {
      setTimeout(() => {
        setIsBlinking(false)
      }, 2000)
    }
  }, [isBlinking])

  let firstRowFont: string | undefined
  let isPos = (trade.side === 'buy' && token.selected === 0) || (trade.side === 'sell' && token.selected === 1)

  if (trade.usd_value >= 1000) {
    firstRowFont = isBlinking ? (isPos ? themeColors.pos_color : themeColors.neg_color) : colors.white
  } else {
    firstRowFont = isBlinking ? (isPos ? themeColors.pos_color : themeColors.neg_color) : colors.gray[400]
  }
  const [hover, setHover] = useState(false)

  return (
    <a href={`${scanUrl}tx/${trade.transaction}`} target="_blank" rel="noreferrer" className="relative h-20">
      <Tooltip.Provider>
        <Tooltip.Root open={hover} delayDuration={0}>
          <Tooltip.Trigger className="w-full">
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                backgroundColor: isBlinking
                  ? isPos
                    ? hover
                      ? themeColors.pos_color.concat('24')
                      : themeColors.pos_color.concat('14')
                    : hover
                    ? themeColors.neg_color.concat('24')
                    : themeColors.neg_color.concat('14')
                  : hover
                  ? '#FFFFFF10'
                  : undefined,
              }}
              className={`flex flex-row w-full px-2 hover:bg-[#FFFFFF10] h-[20px] items-center`}
            >
              <div className="flex flex-1">
                <T3 color={isPos ? themeColors.pos_color : themeColors.neg_color}>
                  <FormatNumber num={avgPrice} singleLetterNotation={true} smallNumberOn2Zeros={true} />
                </T3>
              </div>
              <div className="flex flex-1 justify-end">
                <T3 color={firstRowFont ? firstRowFont : colors.gray[100]}>
                  {token.selected === 0 ? (
                    <FormatNumber num={trade.amount1} singleLetterNotation={true} />
                  ) : (
                    <FormatNumber num={trade.amount0} singleLetterNotation={true} />
                  )}
                </T3>
              </div>
              <div className="flex flex-1 justify-end">
                <T3 color={firstRowFont ? firstRowFont : colors.gray[100]}>{date.toLocaleTimeString()}</T3>
              </div>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="z-50" align={'center'} side={windowSize.width < 700 ? 'bottom' : 'left'}>
              <div className=" bg-gray-900 text-gray-50 border border-gray-800 p-2 rounded-md flex flex-col gap-y-2">
                <T3>
                  Trade: <FormatNumber num={trade.price_start} /> - <FormatNumber num={trade.price_end} />
                </T3>
                <T3>Value: ${<FormatNumber num={trade.usd_value} />}</T3>
                <T3>Fees: ${<FormatNumber num={trade.fees_usd} />}</T3>
                <T3>Slippage: {<FormatNumber num={trade.slippage * 100} />}%</T3>
              </div>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </a>
  )
}
export default TradeHistoryItem
