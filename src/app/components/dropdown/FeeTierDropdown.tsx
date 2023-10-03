import { useChainLoader } from '../../route/RouteWrapper'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { calculatePercentages } from '../../util/calculateFeeTierPercentages'
import { liquidityPath } from '../../util/pathHelper'
import { useDataContext } from '../../context/DataContext'
import { PoolSummary } from '@gfxlabs/oku'
import { fetchFeeTiersPositionCount } from '../../data/cush_getFeeTiersPositionCount'
import { searchPoolsByTokenAddresses } from '../../data/search_pools'
import { DropdownItem, DropdownItemsContainer, DropdownTrigger } from './Dropdown/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const factor = 10000

const feeTierSwitch = (fee: number) => {
  switch (fee) {
    case 100:
      return 'Very stable Pairs'
    case 500:
      return 'Stable pairs'
    case 3000:
      return 'Standard'
    case 10000:
      return 'Exotic Pairs'
  }
}

interface IFeeTierButton {
  pool: PoolSummary
  setPool: (pool: PoolSummary) => void
  setFee: (fee: number) => void
  feeTierPercentage: string
}

function FeeTierDropdown({ setPool }: { setPool: (value: PoolSummary) => void }) {
  const { poolSummary } = useDataContext()

  const [pools, setPools] = useState<PoolSummary[] | undefined>(undefined)
  const [fee, setFee] = useState<undefined | number>(undefined)
  const [feeTiers, setFeeTiers] = useState<undefined | { [fee: number]: number }>(undefined)

  const { cushRpc } = useChainLoader()

  const getPools = async (token0: string, token1: string) => {
    const associatedPools = await searchPoolsByTokenAddresses(cushRpc, token0, token1)
    setPools(associatedPools.pools)
  }

  useEffect(() => {
    if (poolSummary && poolSummary.fee && poolSummary.t0_symbol && poolSummary.t0_symbol) {
      setFee(poolSummary.fee)
      const token0Address = poolSummary.t0
      const token1Address = poolSummary.t1
      getPools(token0Address, token1Address).then()

      fetchFeeTiersPositionCount(cushRpc, {
        token0Address: poolSummary.t0,
        token1Address: poolSummary.t1,
      })
        .then(setFeeTiers)
        .catch((err) => {
          window.log.error(err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolSummary])

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownTrigger hasCarot trigger={<DropdownButton fee={fee} />} classes="border border-[#293249]" />
      <DropdownItemsContainer>
        <DropdownModal pools={pools} setPool={setPool} setFee={setFee} feeTiers={feeTiers} />
      </DropdownItemsContainer>
    </DropdownMenu.Root>
  )
}

const DropdownModal = ({
  pools,
  setPool,
  setFee,
  feeTiers,
}: {
  pools: PoolSummary[] | undefined
  setPool: (pool: PoolSummary) => void
  setFee: (fee: number) => void
  feeTiers: { [fee: number]: number } | undefined
}) => {
  const feeTierPercentages = calculatePercentages(feeTiers)
  return (
    <>
      {pools &&
        pools
          .sort((x, y) => {
            return x.fee - y.fee
          })
          .map((pool, index) => (
            <FeeButton
              key={index}
              pool={pool}
              setPool={setPool}
              setFee={setFee}
              feeTierPercentage={feeTierPercentages[pool.fee] || '0'}
            />
          ))}
    </>
  )
}

const DropdownButton = ({ fee }: { fee: number | undefined }) => {
  const factor = 10000
  return (
    <div>
      <T3>{fee ? (fee / factor).toString().concat('% Fee tier') : 'Loading...'}</T3>
    </div>
  )
}

const FeeButton = (props: IFeeTierButton) => {
  const { pool, setFee, feeTierPercentage } = props
  const navigate = useNavigate()
  const { currentChainInfo } = useChainLoader()

  return (
    <DropdownItem
      classes="text-white flex justify-start px-2 py-2 w-[var(--radix-dropdown-menu-trigger-width)]"
      onClick={() => {
        setFee(pool.fee)
        navigate(liquidityPath(pool.address, currentChainInfo.internalName))
      }}
    >
      <div className="w-[56px] flex flex-start">
        <T3 weight={FontWeightEnums.MEDIUM}>{(pool.fee / factor).toString().concat('%')}</T3>
      </div>
      <div className="flex flex-row justify-between w-full">
        <T3 color={colors.gray[500]}>{feeTierSwitch(pool.fee)}</T3>
        {/* TODO use TVl info to get  %  */}
        <T3 color={colors.blue[400]}>{feeTierPercentage.concat('%')} select</T3>
      </div>
    </DropdownItem>
  )
}

export default FeeTierDropdown
