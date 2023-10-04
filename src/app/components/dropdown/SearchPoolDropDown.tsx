import { useChainLoader } from '../../route/RouteWrapper'
import Search from '@/app/assets/search.svg'
import { FormatNumber } from '../numbers/FormatNumber'
import { T2, T3, T4 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import useBreakpoint from '../../hooks/useBreakpoint'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { updateMarketWatch } from '../../lib/marketWatch'
import { FontWeightEnums } from '../../types/Enums'
import { getTokenSymbol } from '../../util/getTokenName'
import { getURLInfo } from '../../util/pathHelper'
import { useDataContext } from '../../context/DataContext'
import { PoolSummary, SearchResponse } from '@gfxlabs/oku'
import StarButton from '../buttons/StarButton'
import DebounceInput from '../inputs/DebounceInput'
import BaseModal from '../modals/BaseModal'
import BPSDropdown from './BPSDropdown'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useModalContext } from '../../context/naked/ModalContext'
import { useCurrentClient } from '../../hooks/useClient'
import { Row, createColumnHelper, getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'
import { getTokenByAddress } from '../../lib/getToken'

import { useVirtual } from 'react-virtual'

interface IDropdownModal {
  onClose: () => void
  searchTerm: string
}

function SearchPoolDropDown() {
  // https://github.com/radix-ui/primitives/issues/1342
  // undid implementation of new Dropdown to wait for Combobox to be used for search

  const ref = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)
  const { width } = useWindowDimensions()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="z-[10] flex flex-col items-center justify-center w-fit">
      <div ref={ref} className="w-full flex h-full">
        <SearchDropdownButton setShowModal={setShowModal} setSearchTerm={setSearchTerm} showModal={showModal} />
      </div>
      <DropdownModal
        offsetTop={ref.current ? ref.current?.offsetTop + ref.current?.clientHeight : 0}
        offsetRight={ref.current ? width - ref.current?.offsetLeft - ref.current.clientWidth - 20 : 0}
        showModal={showModal}
        setShowModal={setShowModal}
        searchTerm={searchTerm}
      />
    </div>
  )
}

export default SearchPoolDropDown

const DropdownModal = ({
  offsetTop,
  offsetRight,
  showModal,
  setShowModal,
  searchTerm,
}: {
  offsetTop: number
  offsetRight: number
  showModal: boolean
  searchTerm: string
  setShowModal: (val: boolean) => void
}) => {
  return (
    <BaseModal
      showOverlay
      offsetTop={offsetTop + 8}
      offsetRight={offsetRight}
      showModal={showModal}
      onClose={() => setShowModal(false)}
    >
      <SearchDropdownModal onClose={() => setShowModal(false)} searchTerm={searchTerm} />
    </BaseModal>
  )
}

export const SearchDropdownButton = ({
  setShowModal,
  setSearchTerm,
  showModal,
}: {
  setShowModal: (val: boolean) => void
  setSearchTerm: (val: string) => void
  showModal: boolean
}) => {
  const inputWidth = useBreakpoint({ base: '150px', sm: '350px', md: '300px', lg: '430px' })
  const inputHeight = useBreakpoint({ base: '28px', sm: '35px' })
  const placeHolderPadding = useBreakpoint({ base: '8px', sm: '16px' })
  const [focus, setFocus] = useState(false)
  const [val, setVal] = useState('')
  const location = useLocation()
  const { pageParam } = getURLInfo(location)
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => setShowModal(true)}
      className={`
      w-fit
      w-max-[${inputWidth}px]
      `}
      style={{ zIndex: showModal ? 160 : 0 }}
    >
      <DebounceInput
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
        className={`
          placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal rounded-full border-[1px] text-white
          w-full
          `}
        style={{
          height: inputHeight,
          backgroundColor: colors.gray[900],
          borderColor: hover || focus ? colors.blue.vibrant : colors.gray[700],
          paddingLeft: placeHolderPadding,
          marginTop: 0,
          backgroundImage: focus ? '' : val === '' ? `url(${Search})` : '',
          backgroundSize: '12px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '10px center',
        }}
        onFocus={() => {
          setFocus(true)
        }}
        onBlur={() => {
          setFocus(false)
        }}
        onInputChange={(val) => {
          setVal(val)
          setSearchTerm(val)
        }}
        reset={!showModal}
      ></DebounceInput>
    </div>
  )
}

const SearchDropdownModal = (props: IDropdownModal) => {
  const { onClose, searchTerm } = props
  const [fee, setFee] = useState<undefined | number>(undefined)
  const { setShowCreatePoolModal } = useModalContext()
  const width = useBreakpoint({ base: 100, sm: 200, md: 400, lg: 448 })
  const { currentChain } = useChainLoader()
  const { favoritePool, setFavoritePool } = useDataContext()
  const [pools, setPools] = useState(favoritePool)

  const tableContainerRef = useRef<HTMLDivElement>(null)

  //TODO: infinite scroll
  const { data: searchResults, refetch } = useCurrentClient('cush_search', [
    searchTerm,
    {
      fee_tiers: fee ? [fee] : [],
      result_offset: 0,
      sort_by: 'total_volume_7d_usd',
      result_size: 50,
      sort_order: false,
    },
  ])
  //const {data:topPools} = useCurrentClient("cush_searchPoolsByList", [favoritePool])

  const ch = createColumnHelper<PoolSummary>()

  const togglePool = (address: string) => {
    if (pools.includes(address)) {
      const updatedPools = updateMarketWatch('REMOVE', address, currentChain)
      setPools(updatedPools)
      setFavoritePool(updatedPools)
    } else {
      const updatedPools = updateMarketWatch('ADD', address, currentChain)
      setPools(updatedPools)
      setFavoritePool(updatedPools)
    }
  }
  const columns = useMemo(
    () => [
      ch.accessor((pool) => pool.address, {
        id: 'pool',
        header: () => (
          <div className="text-start pl-5">
            <T2 weight={FontWeightEnums.SEMIBOLD}>
              <Trans>Pools</Trans>
            </T2>
          </div>
        ),
        cell: (props) => {
          const pool = props.row.original
          const token0Info = getTokenByAddress(pool.t0, currentChain)
          const token1Info = getTokenByAddress(pool.t1, currentChain)
          return (
            <div className="flex flex-row items-center gap-x-1">
              <StarButton
                onClick={(e) => {
                  togglePool(pool.address)
                  e.stopPropagation()
                  e.preventDefault()
                }}
                isStarred={pools.includes(pool.address)}
              />
              <div className="flex flex-row items-center w-fit">
                <div className="flex flex-row gap-0">
                  <div className="h-[18px] w-[18px] rounded-[18px] bg-green-700 z-10">
                    <img className="rounded-full" src={token0Info.logoURI} alt={token0Info.symbol} />
                  </div>
                  <div className="-translate-x-2 h-[18px] w-[18px] rounded-[18px] bg-blue-700">
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
            </div>
          )
        },
      }),
      ch.accessor((pool) => pool.t0_volume, {
        id: 'volume',
        cell: (props) => {
          return (
            <>
              <T3>
                <FormatNumber num={props.getValue()} singleLetterNotation={true} />
              </T3>
            </>
          )
        },
        header: () => (
          <T3 color={colors.gray[400]}>
            <Trans>{'24H Volume'}</Trans>
          </T3>
        ),
      }),
      ch.accessor((pool) => pool.fee, {
        id: 'fee',
        cell: (props) => {
          return (
            <>
              <T3>{Number(props.getValue()) / 10000 + '%'}</T3>
            </>
          )
        },
        header: () => (
          <>
            <BPSDropdown setFee={setFee} fee={fee} />
          </>
        ),
      }),
      ch.accessor((pool) => pool.tvl_usd, {
        id: 'tvl_usd',
        cell: (props) => {
          return (
            <>
              <T3>
                <FormatNumber num={props.getValue()} singleLetterNotation={true} />
              </T3>
            </>
          )
        },
        header: () => (
          <T3 color={colors.gray[400]}>
            <Trans>TVL</Trans>
          </T3>
        ),
      }),
      ch.accessor((pool) => pool.last_price, {
        id: 'price',
        cell: (props) => {
          return (
            <>
              <T3>
                <FormatNumber num={props.getValue()} singleLetterNotation={true} />
              </T3>
            </>
          )
        },
        header: () => (
          <T3 color={colors.gray[400]}>
            <Trans>Price</Trans>
          </T3>
        ),
      }),
    ],
    [currentChain, pools, fee]
  )

  const searchResultsTable = useReactTable({
    data: searchResults?.pools ? searchResults.pools : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = searchResultsTable.getRowModel()
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  })
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer

  return (
    <div
      className={` bg-[${colors.gray[900]}] border-[1px] border-[#293249] rounded-[12px] h-fit min-h-[350px] text-white flex flex-col animate-slide-down drop-shadow-xl`}
      ref={tableContainerRef}
    >
      <div className="flex flex-col">
        <div className="px-3 pb-2 flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            {/* hidden pool modal for now */}
            <div
              className="hidden flex cursor-pointer flex-row gap-x-2 rounded-lg border border-gray-400 text-xs items-center py-1 px-2 stroke-gray-400 hover:stroke-gray-200 cursor-pointer text-gray-400 hover:text-gray-200 hover:border-gray-200"
              onClick={() => {
                setShowCreatePoolModal(true)
                onClose()
              }}
            >
              <PlusCircleIcon color={colors.gray[400]} width={12} height={12} stroke="inherit" />
              Create Pool
            </div>
          </div>
        </div>
        <div className="overflow-y w-full flex flex-col">
          <table className="table-auto block overflow-y-auto h-fit max-h-[440px] no-scrollbar">
            <thead>
              {searchResultsTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan} className="pr-2 text-center">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="">
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<PoolSummary>
                return (
                  <tr key={row.id} className="hover:bg-gray-800">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`text-end
                          p-1
                          pr-4
                          ${(() => {
                            let x = {}[cell.column.id]
                            return x !== undefined ? x : ''
                          })()}`}
                      >
                        <Link to={`../${row.original.address}`} relative="path" onClick={onClose}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Link>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {searchResults?.result_size === 0 && (
          <div className="px-8 py-8">
            <T2>
              <Trans>No Search Results</Trans>
            </T2>
          </div>
        )}
      </div>
    </div>
  )
}
