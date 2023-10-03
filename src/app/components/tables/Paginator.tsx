import { colors } from '../../constants/colors'
import { DOTS, usePagination } from '../../hooks/usePagination'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

interface IPaginator {
  onPageChange: (nextPage: number) => void
  totalCount: number
  siblingCount?: number
  currentPage: number
  pageSize: number
}

const Paginator = (props: IPaginator) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange && paginationRange[paginationRange.length - 1]

  return (
    <div className="flex justify-center gap-8 m-4">
      <button disabled={currentPage === 1} onClick={onPrevious}>
        <ChevronLeftIcon width={14} color={colors.blue[400]} />
      </button>
      {paginationRange &&
        paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <span>{DOTS}</span>
          }
          return (
            <button
              className={`${
                pageNumber === currentPage ? 'text-white bg-[#293249]' : 'text-[#99A1BD]'
              } hover:text-white rounded-md w-6 h-6`}
              onClick={() => onPageChange(Number(pageNumber))}
              key={`pageCaps-${index}`}
            >
              <p className="text-sm">{pageNumber}</p>
            </button>
          )
        })}
      <button disabled={currentPage === lastPage} onClick={onNext}>
        <ChevronRightIcon width={14} color={colors.blue[400]} />
      </button>
    </div>
  )
}

export default Paginator
