import { useChainLoader } from '../../route/RouteWrapper'
import { FormatNumber } from '../numbers/FormatNumber'
import { T2, T3, T4 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useThemeContext } from '../../context/naked/ThemeContext'
import useMobile from '../../hooks/useMobile'
import { getTokenSymbol } from '../../util/getTokenName'
import { useDataContext } from '../../context/DataContext'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'

function InfoBar() {
  const { token } = useDataContext()
  const { poolSummary } = useDataContext()
  const { isMobile } = useMobile()
  const { currentChainInfo } = useChainLoader()

  const price = token.selected === 0 ? 1 / poolSummary.t0_price : poolSummary.t0_price
  return !poolSummary ? (
    <></>
  ) : (
    <>
      <InfoText title={'Price'} info={<FormatNumber num={price} singleLetterNotation={true} />} />
      {poolSummary && poolSummary.t0 ? (
        <InfoText
          title={'24H Change'}
          info={
            <FormatNumber
              num={
                token.selected === 0
                  ? poolSummary.t1_price * poolSummary.t1_change
                  : poolSummary.t0_price * poolSummary.t0_change
              }
              singleLetterNotation={true}
            />
          }
          percentChange={token.selected === 0 ? poolSummary.t1_change * 100 : poolSummary.t0_change * 100}
        />
      ) : (
        <></>
      )}
      <InfoText
        title={'TVL'}
        info={
          <FormatNumber
            num={poolSummary.t0_tvl * poolSummary.t0_price_usd + poolSummary.t1_tvl * poolSummary.t1_price_usd}
            singleLetterNotation={true}
          />
        }
        token="$"
        percentChange={poolSummary?.tvl_usd_change * 100}
      />

      <InfoText
        title={isMobile ? 'Vol. 24H' : 'Volume 24H'}
        info={
          <FormatNumber
            num={token.selected === 0 ? poolSummary.t0_volume : poolSummary.t1_volume}
            singleLetterNotation={true}
          />
        }
        token={
          token.selected === 0
            ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)
            : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)
        }
        percentChange={(token.selected === 0 ? poolSummary.t0_volume_change : poolSummary.t1_volume_change) * 100}
      />
      <InfoText
        title={isMobile ? 'Vol. 7D' : 'Volume 7D'}
        info={
          <FormatNumber
            num={token.selected === 0 ? poolSummary.t0_volume_7d : poolSummary.t1_volume_7d}
            singleLetterNotation={true}
          />
        }
        token={
          token.selected === 0
            ? getTokenSymbol(poolSummary.t0, poolSummary.t0_symbol, currentChainInfo.id)
            : getTokenSymbol(poolSummary.t1, poolSummary.t1_symbol, currentChainInfo.id)
        }
        percentChange={token.selected === 0 ? poolSummary.t0_volume_change_7d : poolSummary.t1_volume_change_7d}
      />
    </>
  )
}

export default InfoBar

interface IInfoText {
  title: string
  info: string | JSX.Element
  token?: string
  percentChange?: number | undefined
}

const InfoText = (props: IInfoText) => {
  const { title, info, token, percentChange = undefined } = props
  const { colors: themeColors } = useThemeContext()
  const { isMobile } = useMobile()
  const changeColor =
    percentChange !== undefined
      ? percentChange > 0
        ? themeColors.pos_color
        : percentChange < 0
        ? themeColors.neg_color
        : colors.white
      : ''
  const Icon =
    percentChange !== undefined ? (
      percentChange > 0 ? (
        <ArrowUpIcon width={12} fill={changeColor} />
      ) : percentChange < 0 ? (
        <ArrowDownIcon width={12} fill={changeColor} />
      ) : (
        <div></div>
      )
    ) : (
      <div></div>
    )

  return (
    <div className="flex flex-row my-1" style={{ width: 'min-content' }}>
      <div className="whitespace-nowrap mr-1">
        <T2 color={colors.gray[300]}>{title}:</T2>
      </div>
      <div className="whitespace-nowrap">
        {typeof info === 'string' ? (
          <T2>{info}</T2>
        ) : (
          <div className="flex">
            {token === '$' ? (
              isMobile ? (
                <T2>
                  {token}
                  {info}
                </T2>
              ) : (
                <T2>
                  {token}
                  {info}
                </T2>
              )
            ) : isMobile ? (
              <T2>
                {' '}
                {info} {token}
              </T2>
            ) : (
              <T2>
                {' '}
                {info} {token}
              </T2>
            )}
          </div>
        )}
      </div>
      {percentChange !== undefined && (
        <div className="flex flex-row">
          {isNaN(percentChange) || isNaN(Math.abs(percentChange)) || !Number.isFinite(percentChange) ? (
            <T3 color={colors.gray[300]}>NA</T3>
          ) : (
            <>
              {Icon}
              <T3 color={changeColor}>{Math.abs(percentChange).toFixed(2)}%</T3>
            </>
          )}
        </div>
      )}
    </div>
  )
}
