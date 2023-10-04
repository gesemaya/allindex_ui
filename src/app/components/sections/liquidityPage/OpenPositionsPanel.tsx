import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import PositionStatusTag from '../../tags/PositionStatusTag'
import { T2, T3, T4 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { getTokenByAddress, IToken } from '../../../lib/getToken'
import { FontWeightEnums, PositionStatusEnums } from '../../../types/Enums'
import calculateUncollectedFeesFromPosition from '../../../util/calculateUncollectedFeesFromPosition'
import { getTokenSymbol } from '../../../util/getTokenName'
import { getMMDDYYYY } from '../../../util/timeConvert'
import { useDataContext } from '../../../context/DataContext'
import { positions_AllPositions, UserPositions } from '@gfxlabs/oku'
import FilterPositionsDropdown from '../../dropdown/FilterPositionsDropdown'
import ManagePositionDropdown from '../../dropdown/ManagePositionDropdown'
import PriceRangeBar from '../../lists/orderHistory/PriceRangeBar'
import { SkeletonLine } from '../../loadingStates/SkeletonLines'
import Paginator from '../../tables/Paginator'
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid'
import { formatUnits } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { ColumnDef, TableOptions, createColumnHelper, getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'

const TableTitle = ({ title, classes }: { title: string; classes?: string }) => (
  <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[400]} className={classes}>
    {title}
  </T3>
)

export interface NFTPostionInfo extends positions_AllPositions {
  unclaimedFees: number
}

function OpenPositionsPanelTable(args: { positions: UserPositions[]; columnVisibility: any }) {
  const { currentChain } = useChainLoader()
  const { positions, columnVisibility } = args
  const ch = createColumnHelper<UserPositions>()
  const [columns, setColumns] = useState([
    ch.accessor((position) => (position.tokenId !== '0' ? position.tokenId : 'N/A'), {
      id: 'tokenid',
      header: () => <TableTitle title="Token ID" classes="text-left" />,
      cell: (props) => (
        <div className="flex flex-row items-center gap-x-2">
          <T3 weight={FontWeightEnums.REGULAR}>{props.getValue()}</T3>
        </div>
      ),
    }),
    ch.accessor('status', {
      header: () => <TableTitle title="Status" classes="text-left" />,
      cell: (props) => <PositionStatusTag status={props.getValue() as PositionStatusEnums} />,
    }),
    ch.accessor((x) => x.position_pool_data.token1_price, {
      id: 'range',
      header: () => <TableTitle title="Range" classes="text-left" />,
      cell: (props) => {
        const position = props.row.original
        return (
          <PriceRangeBar
            currentPrice={position.position_pool_data.token1_price}
            rangeLower={parseFloat(position.position_price_range?.inverse_lower_price)}
            rangeUpper={parseFloat(position.position_price_range?.inverse_upper_price)}
            isClosed={position.status === 'closed'}
          />
        )
      },
    }),
    ch.accessor((x) => x.position_pool_data.token0 + '/' + x.position_pool_data.token1, {
      id: 'pair',
      header: () => <TableTitle title="Pair" classes="text-left" />,
      cell: (props) => {
        const position = props.row.original
        const token0Info = getTokenByAddress(position.position_pool_data.token0, currentChain)
        const token1Info = getTokenByAddress(position.position_pool_data.token1, currentChain)
        return (
          <div className="flex flex-row items-center gap-x-2 ">
            <PoolPair token0Info={token0Info} token1Info={token1Info} />
            <div className="rounded-[6px] p-1" style={{ backgroundColor: colors.gray[800] }}>
              <T3>{(position.position_pool_data.fee / 10000).toString().concat('%')}</T3>
            </div>
          </div>
        )
      },
    }),
    ch.accessor((x) => x.starting_amounts.timestamp, {
      id: 'date',
      header: () => <TableTitle title="Date" classes="" />,
      cell: (props) => {
        const position = props.row.original
        return (
          <div className="">
            <T3 weight={FontWeightEnums.REGULAR}>{getMMDDYYYY(props.getValue())}</T3>
          </div>
        )
      },
    }),
    ch.accessor((x) => x.current_position_values.amount0_current, {
      id: 'amount0',
      header: () => <TableTitle title="Amount" classes="text-end" />,
      cell: (props) => {
        const position = props.row.original
        const token0Info = getTokenByAddress(position.position_pool_data.token0, currentChain)
        const token0Change = Number(position.amount_deltas.amount0_delta)
        const token0Balance = formatUnits(
          position.current_position_values.amount0_current,
          position.position_pool_data.token0_decimals
        )
        return (
          <div className="flex justify-start flex-col text-end">
            <T3 weight={FontWeightEnums.REGULAR}>
              <FormatNumber num={Number(token0Balance)} />{' '}
              {getTokenSymbol(token0Info?.address!, token0Info?.symbol, token0Info?.chainId!)}
            </T3>
            <div className="flex flex-row gap-1 mt-[6px] justify-end">
              {token0Change < 0 ? (
                <ArrowDownLeftIcon width={8} fill={colors.red[400]} />
              ) : (
                <ArrowUpRightIcon width={8} fill={colors.green[400]} />
              )}
              <T4 color={token0Change < 0 ? colors.red[400] : colors.green[400]}>
                <FormatNumber num={Math.abs(token0Change)} />
              </T4>
            </div>
          </div>
        )
      },
    }),
    ch.accessor((x) => x.current_position_values.amount1_current, {
      id: 'amount1',
      header: () => <TableTitle title="Amount" classes="text-end" />,
      cell: (props) => {
        const position = props.row.original
        const token1Info = getTokenByAddress(position.position_pool_data.token1, currentChain)
        const token1Change = Number(position.amount_deltas.amount1_delta)
        const token1Balance = formatUnits(
          position.current_position_values.amount1_current,
          position.position_pool_data.token1_decimals
        )
        return (
          <div className="flex justify-start flex-col text-end">
            <T3 weight={FontWeightEnums.REGULAR}>
              <FormatNumber num={Number(token1Balance)} />{' '}
              {getTokenSymbol(token1Info?.address!, token1Info?.symbol, token1Info?.chainId!)}
            </T3>
            <div className="flex flex-row gap-1 mt-[6px] justify-end">
              {token1Change < 0 ? (
                <ArrowDownLeftIcon width={8} fill={colors.red[400]} />
              ) : (
                <ArrowUpRightIcon width={8} fill={colors.green[400]} />
              )}
              <T4 color={token1Change < 0 ? colors.red[400] : colors.green[400]}>
                <FormatNumber num={Math.abs(token1Change)} />
              </T4>
            </div>
          </div>
        )
      },
    }),
    ch.accessor((x) => x.current_position_values.total_value_current_usd, {
      id: 'value',
      header: () => <TableTitle title="Value" classes="text-end" />,
      cell: (props) => {
        return (
          <div className="text-end">
            <T3 weight={FontWeightEnums.REGULAR}>
              $<FormatNumber num={props.getValue()} />
            </T3>
          </div>
        )
      },
    }),
    ch.accessor((x) => x.current_fee_info, {
      id: 'fees',
      header: () => <TableTitle title="Fees" classes="text-end" />,
      cell: (props) => {
        const position = props.row.original
        return (
          <div className="text-end">
            <T3 weight={FontWeightEnums.REGULAR} color={colors.green[400]}>
              $<FormatNumber num={calculateUncollectedFeesFromPosition(position)} />
            </T3>
          </div>
        )
      },
    }),
    ch.display({
      id: 'control',
      header: '',
      size: 30,
      minSize: 30,
      maxSize: 30,
      cell: (props) => {
        const position = props.row.original
        return (
          <div className="text-end object-end">
            <div className="w-fit ">
              <ManagePositionDropdown position={position} useEllipsis={true} />
            </div>
          </div>
        )
      },
    }),
  ])

  const table = useReactTable({
    data: positions,
    state: {
      columnVisibility,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="table-auto grow">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan} className="py-2">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-y border-gray-700">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`
              py-2
              ${(() => {
                let x = {
                  tokenid: '',
                  status: '',
                  range: '',
                  pair: '',
                  control: 'pl-6',
                }[cell.column.id]
                return x !== undefined ? x : 'pl-4'
              })()}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function OpenPositionsPanel({ positions }: { positions: UserPositions[] | undefined }) {
  const [filter, setFilter] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const columnVisibility = useBreakpoint({
    base: {
      date: false,
      amount0: true,
      amount1: true,
      range: true,
      status: false,
      pair: false,
    },
    sm: {
      date: false,
      amount0: true,
      amount1: true,
      range: false,
      status: false,
      pair: false,
    },
    md: {
      date: false,
      amount0: true,
      amount1: true,
      range: true,
      status: true,
      pair: false,
    },
    lg: {
      date: true,
      amount0: true,
      amount1: true,
      range: true,
      pair: true,
    },
  })

  let PageSize = 10

  const currentPositionsData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return (positions && positions.slice(firstPageIndex, lastPageIndex)) || []
  }, [currentPage, positions])

  return (
    <div className="flex flex-1 flex-col bg-[#0E0E0E] rounded-[16px] border-[1px] border-[#141B2B] p-3">
      <div className="flex w-full h-fit justify-between items-center">
        <T2 weight={FontWeightEnums.SEMIBOLD}>Open Positions</T2>
        <FilterPositionsDropdown setFilter={setFilter} filter={filter} />
      </div>
      <div className="flex w-full">
        <OpenPositionsPanelTable positions={currentPositionsData} columnVisibility={columnVisibility} />
      </div>
    </div>
  )
}

const PoolPair = ({ token0Info, token1Info }: { token0Info: IToken | undefined; token1Info: IToken | undefined }) => {
  return token0Info && token1Info ? (
    <div className="flex flex-row items-center w-fit gap-[16px]">
      <div className="flex">
        <div className="h-[14px] w-[14px] rounded-[18px] bg-green-700">
          <img className="rounded-full" src={token0Info.logoURI} alt={token0Info.symbol} />
        </div>
        <div className="absolute ml-[10px] h-[14px] w-[14px] rounded-[18px] bg-blue-700">
          <img className="rounded-full" src={token1Info.logoURI} alt={token1Info.symbol} />
        </div>
      </div>
      <div className="flex flex-row items-center ">
        <T3>{`${getTokenSymbol(token0Info.address, token0Info.symbol, token0Info.chainId)}`}</T3>
        <T3 color={colors.gray[400]}>{`/${getTokenSymbol(
          token1Info.address,
          token1Info.symbol,
          token1Info.chainId
        )}`}</T3>
      </div>
    </div>
  ) : (
    <SkeletonLine />
  )
}

export default OpenPositionsPanel
