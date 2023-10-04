import { useChainLoader } from '../../route/RouteWrapper'
import { FormatNumber } from '../numbers/FormatNumber'
import PositionStatusTag from '../tags/PositionStatusTag'
import { T1, T2, T3, T4 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getTokenSymbol } from '../../util/getTokenName'
import { getMMDDYYYY, timeNumberConvertString } from '../../util/timeConvert'
import ManagePositionDropdown from '../dropdown/ManagePositionDropdown'
import { PoolPairFromSymbol } from '../dropdown/PairDropdown'
import PriceRangeBar from '../lists/orderHistory/PriceRangeBar'
import Paginator from './Paginator'
import { TableDrawer } from './TableDrawer'
import { UserPositions } from '@gfxlabs/oku'
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid'
import { formatUnits } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

interface IPositionsHistoryTable {
  positions: UserPositions[]
}

function PositionsHistoryTable(props: IPositionsHistoryTable) {
  const { positions } = props
  const [currentPage, setCurrentPage] = useState(1)
  const { currentChainInfo } = useChainLoader()

  const thClass = 'p-4 first:rounded-tl-xl last:rounded-tr-xl'

  let PageSize = 10

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    const positionsSliced = positions.slice(firstPageIndex, lastPageIndex)

    return positionsSliced
  }, [currentPage, positions])

  const makeDrawer = () => {
    return new TableDrawer<UserPositions>(
      [
        {
          title: 'Token ID',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (position) => {
            return <T2>{position.tokenId !== '0' ? position.tokenId : 'N/A'} </T2>
          },
        },
        {
          title: 'Status',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (position) => {
            return <PositionStatusTag status={position.status as any} />
          },
        },
        {
          title: 'Pool',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (position) => {
            return (
              <PoolPairFromSymbol
                token0Symbol={
                  getTokenSymbol(
                    position.position_pool_data?.token0,
                    position.position_pool_data?.token0_name,
                    currentChainInfo.id
                  )!
                }
                token1Symbol={
                  getTokenSymbol(
                    position.position_pool_data?.token1,
                    position.position_pool_data?.token1_name,
                    currentChainInfo.id
                  )!
                }
                token0Address={position.position_pool_data.token0}
                token1Address={position.position_pool_data.token1}
              />
            )
          },
        },
        {
          title: 'Fee',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (position) => {
            return <T2>{position.position_pool_data?.fee ? `${position.position_pool_data?.fee / 10000}%` : ''}</T2>
          },
        },
        {
          title: 'Price Range',
          headerClass: `${thClass} text-left`,
          dataClass: thClass,
          render: (position) => {
            return (
              <PriceRangeBar
                currentPrice={position.position_pool_data.token1_price}
                rangeLower={parseFloat(position.position_price_range?.inverse_lower_price)}
                rangeUpper={parseFloat(position.position_price_range?.inverse_upper_price)}
                isClosed={position.status === 'closed'}
              />
            )
          },
        },
        {
          title: 'Token 0 Amount',
          headerClass: `${thClass} text-right`,
          dataClass: `${thClass} text-right`,
          render: (position) => {
            return (
              <div className="flex flex-1 flex-col">
                <T2>
                  <FormatNumber
                    num={parseFloat(
                      formatUnits(
                        position.current_position_values.amount0_current,
                        position.position_pool_data.token0_decimals
                      )
                    )}
                  />{' '}
                  {position.position_pool_data.token0_symbol}
                </T2>
                <div className="flex flex-row gap-1 justify-end">
                  {parseFloat(position.amount_deltas.amount0_delta) !== 0 ? (
                    parseFloat(position.amount_deltas.amount0_delta) < 0 ? (
                      <ArrowDownLeftIcon width={8} fill={colors.red[400]} />
                    ) : (
                      <ArrowUpRightIcon width={8} fill={colors.green[400]} />
                    )
                  ) : (
                    <></>
                  )}
                  <T4
                    color={parseFloat(position.amount_deltas.amount0_delta) < 0 ? colors.red[400] : colors.green[400]}
                  >
                    {Number(position.amount_deltas.amount0_delta) !== 0 ? (
                      <FormatNumber num={Math.abs(Number(position.amount_deltas.amount0_delta))} />
                    ) : (
                      <></>
                    )}
                  </T4>
                </div>
              </div>
            )
          },
        },
        {
          title: 'Token 1 Amount',
          headerClass: `${thClass} text-right`,
          dataClass: `${thClass} text-right`,
          render: (position) => {
            return (
              <div className="flex flex-1 flex-col">
                <T2>
                  <FormatNumber
                    num={parseFloat(
                      formatUnits(
                        position.current_position_values.amount1_current,
                        position.position_pool_data.token1_decimals
                      )
                    )}
                  />{' '}
                  {position.position_pool_data.token1_symbol}
                </T2>
                <div className="flex flex-row gap-1 justify-end">
                  {parseFloat(position.amount_deltas.amount1_delta) !== 0 ? (
                    parseFloat(position.amount_deltas.amount1_delta) < 0 ? (
                      <ArrowDownLeftIcon width={8} fill={colors.red[400]} />
                    ) : (
                      <ArrowUpRightIcon width={8} fill={colors.green[400]} />
                    )
                  ) : (
                    <></>
                  )}
                  <T4
                    color={parseFloat(position.amount_deltas.amount1_delta) < 0 ? colors.red[400] : colors.green[400]}
                  >
                    {Number(position.amount_deltas.amount1_delta) !== 0 ? (
                      <FormatNumber num={Math.abs(Number(position.amount_deltas.amount1_delta))} />
                    ) : (
                      <></>
                    )}
                  </T4>
                </div>
              </div>
            )
          },
        },
        {
          title: 'Position Value',
          headerClass: `${thClass} text-right`,
          dataClass: `${thClass} text-right`,
          render: (position) => {
            return (
              <T2>
                $
                <FormatNumber
                  num={
                    Number(position.current_position_values.amount0_current_usd) +
                    Number(position.current_position_values.amount1_current_usd)
                  }
                  singleLetterNotation={true}
                />
              </T2>
            )
          },
        },
        {
          title: 'Time',
          headerClass: `${thClass} text-right pl-2`,
          dataClass: `${thClass} text-right pl-2`,
          render: (position) => {
            return (
              <>
                <T2>{position.created_date ? getMMDDYYYY(position.created_date * 1000) : ''}</T2>
                <T3 color={'#7C85A2'}>
                  {position.created_date ? timeNumberConvertString(position.created_date * 1000) : ''}
                </T3>
              </>
            )
          },
        },
        {
          title: <>{''}</>,
          headerClass: 'rounded-tr-xl',
          dataClass: 'flex justify-end p-4',
          render: (position) => {
            return (
              <div className="w-24">
                <ManagePositionDropdown position={position} />
              </div>
            )
          },
        },
      ],
      {
        tableClass: 'w-full overflow-y-auto',
        tbodyClass: '',
        headerRowClass: 'h-16 text-[#7C85A2] text-[14px] font-regular bg-[#0E111A] rounded-tr-xl rounded-tl-xl',
        dataRowClass: 'border-[1px] border-[#293249]',
      }
    ).withData(currentTableData)
  }

  const [drawer, setDrawer] = useState(makeDrawer())

  useEffect(() => {
    setDrawer(makeDrawer())
  }, [currentChainInfo, currentTableData])

  return (
    <>
      {positions && positions.length <= 0 ? (
        <div className="mt-10 flex flex-1 justify-center w-full">
          <T1>No Positions Yet</T1>
        </div>
      ) : (
        <>
          {drawer.render()}
          <Paginator
            currentPage={currentPage}
            totalCount={positions.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  )
}

export default PositionsHistoryTable
