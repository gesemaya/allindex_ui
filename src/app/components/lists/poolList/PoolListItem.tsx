import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useThemeContext } from '../../../context/naked/ThemeContext'
import getPriceOfPool from '../../../util/getPriceOfPool'
import { getTokenSymbol } from '../../../util/getTokenName'
import { IPoolSummary } from '../../../data/search_pools'
import StarButton from '../../buttons/StarButton'
import { NavLink } from 'react-router-dom'

interface IPoolListItem {
  pool: IPoolSummary
  isStarred: boolean
  togglePool: (pool_address: string) => void
  onClose: () => void
}

const PoolListItem = (props: IPoolListItem) => {
  const { pool, isStarred, togglePool } = props
  const { colors: themeColors } = useThemeContext()
  const { currentChainInfo } = useChainLoader()
  const change = pool.is_preferred_token_order ? pool.t0_change : pool.t1_change

  return (
    <NavLink
      to={`../${pool.address}`}
      relative="path"
      className="px-1 mx-1 rounded-[4px] flex flex-row items-center hover:bg-[#FFFFFF10]"
      style={({ isActive }) => ({
        backgroundColor: isActive ? '#FFFFFF10' : undefined,
      })}
      end
    >
      <div className="flex flex-row w-full justify-between text-[12px] font-normal  py-1 ">
        <div className="flex flex-row flex-[35] ">
          <T3 color="white">{getTokenSymbol(pool.t0, pool.t0_symbol, currentChainInfo.id)}</T3>
          <T3 color={colors.gray[400]}>/{getTokenSymbol(pool.t1, pool.t1_symbol, currentChainInfo.id)}</T3>
        </div>
        <div className="flex flex-[15] justify-end">
          <T3 color={colors.gray[400]}>{pool.fee / 10000}%</T3>
        </div>
        <div className="flex flex-[30] justify-end text-white text-xs">
          <T3>
            <FormatNumber num={getPriceOfPool(pool)} singleLetterNotation={true} />
          </T3>
        </div>
        <div className="flex flex-[26] justify-center">
          <T3 color={change > 0 ? themeColors.pos_color : change < 0 ? themeColors.neg_color : 'white'}>
            {change > 0 ? '+' : '-'}
            <FormatNumber num={Math.abs(change * 100)} showOnly2Digits={true} smallNumberOn2Zeros={true} />%
          </T3>
        </div>
      </div>
      <StarButton onClick={() => togglePool(pool.address)} isStarred={isStarred} />
    </NavLink>
  )
}

export default PoolListItem
