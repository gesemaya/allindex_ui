import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums, TrendingPoolsEnums } from '../../types/Enums'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface ITrendPoolDropdown {
  setTrendType: (value: TrendingPoolsEnums) => void
  trendType: TrendingPoolsEnums
}

function TrendingPoolDropdown(props: ITrendPoolDropdown) {
  const { trendType, setTrendType } = props
  return (
    <DropdownMenu.Root>
      <DropdownTrigger
        trigger={<DropdownButton trendType={trendType} />}
        classes={'bg-gray-900 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 rounded-2xl	'}
        hasCarot
      />

      <DropdownItemsContainer>
        <DropdownModal setTrendType={setTrendType} />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

interface IDropdownButton {
  trendType: TrendingPoolsEnums
}

const DropdownButton = (props: IDropdownButton) => {
  const { trendType } = props

  const getTitle = (trendType: TrendingPoolsEnums) => {
    switch (trendType) {
      case TrendingPoolsEnums.TOP_GAINERS:
        return 'Top Gainers'
      case TrendingPoolsEnums.TOP_LOSERS:
        return 'Top Losers'
      case TrendingPoolsEnums.TOTAL_SWAPS:
        return 'Total Swaps'
      case TrendingPoolsEnums.TVL:
        return 'TVL'
      case TrendingPoolsEnums.VOLUME:
        return 'Volume'
      default:
        return 'Volume'
    }
  }

  return (
    <div className="w-[90px] flex flex-row rounded-full items-center justify-between ">
      <T3 weight={FontWeightEnums.REGULAR}>{getTitle(trendType)}</T3>
    </div>
  )
}

interface IDropdownModal {
  setTrendType: (value: TrendingPoolsEnums) => void
}

const DropdownModal = (props: IDropdownModal) => {
  const { setTrendType } = props
  return (
    <>
      <ButtonItem
        onClick={() => {
          setTrendType(TrendingPoolsEnums.TVL)
        }}
        title={'TVL'}
      />
      <ButtonItem
        onClick={() => {
          setTrendType(TrendingPoolsEnums.TOTAL_SWAPS)
        }}
        title={'Total Swaps'}
      />
      <ButtonItem
        onClick={() => {
          setTrendType(TrendingPoolsEnums.VOLUME)
        }}
        title={'Volume'}
      />
      <ButtonItem
        onClick={() => {
          setTrendType(TrendingPoolsEnums.TOP_GAINERS)
        }}
        title={'Top Gainers'}
      />
      <ButtonItem
        onClick={() => {
          setTrendType(TrendingPoolsEnums.TOP_LOSERS)
        }}
        title={'Top Losers'}
      />
    </>
  )
}

interface IButtonItem {
  onClick: () => void
  title: string
}

const ButtonItem = (props: IButtonItem) => {
  const { onClick, title } = props
  return (
    <DropdownItem onClick={onClick} classes="px-1 py-2 w-[var(--radix-dropdown-menu-trigger-width)]">
      <T2 color={colors.gray[100]}>{title}</T2>
    </DropdownItem>
  )
}

export default TrendingPoolDropdown
