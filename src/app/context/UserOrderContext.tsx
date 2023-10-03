import { useChainLoader } from '../route/RouteWrapper'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from '../constants/addresses'
import { Order, TokenBalance, UserPositions } from '@gfxlabs/oku'
import { fetchUserTokenBalances } from '../data/cush_userTokenBalances'
import { fetchOrdersForUsers } from '../data/fetchOrdersForUser'
import { fetchPositions } from '../data/positions'
import { multicall } from '@wagmi/core'
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { uniswapNftManagerABI } from '../../generated'

interface UserOrderContextProps {
  currentPositions: UserPositions[] | undefined
  allUserOrders: Order[] | undefined
  getAndSetAllUserOrders: (address: `0x${string}`) => void
  getAndSetCurrentPositions: (address: `0x${string}`) => void
  userTokenBalances: TokenBalance[] | undefined
}

export const UserOrderContext = createContext({} as UserOrderContextProps)

export const UserOrderProvider = ({ children }: { children: ReactElement }) => {
  const { address } = useAccount()
  const { cushRpc } = useChainLoader()
  const [currentPositions, setCurrentPositions] = useState<any[] | undefined>()
  const [allUserOrders, setAllUserOrders] = useState<Order[] | undefined>()
  const [userTokenBalances, setUserTokenBalances] = useState<TokenBalance[] | undefined>()
  const { currentChainInfo } = useChainLoader()

  useEffect(() => {
    if (address) {
      getAndSetCurrentPositions(address)
      getAndSetAllUserOrders(address)

      getAndSetUserTokenBalances(address)
    } else {
      setUserTokenBalances([])
    }
  }, [address, cushRpc])

  const getAndSetUserTokenBalances = (address: `0x${string}`) => {
    fetchUserTokenBalances(cushRpc, address)
      .then((tokens) => {
        const sortedTokensByBalance = tokens.token_balances.sort((a, b) => b.balance - a.balance)
        setUserTokenBalances(sortedTokensByBalance)
      })
      .catch(() => {
        setUserTokenBalances([])
      })
  }

  const getAndSetCurrentPositions = (address: `0x${string}`) => {
    fetchPositions(cushRpc, { user_address: address })
      .then((positions) => {
        positions.sort((a, b) => {
          if (b.status === 'in range') {
            return 1
          }
          if (a.status === 'in range') {
            return -1
          }
          return b.created_date - a.created_date
        })
        const multiCallPositions: any = positions.map((position) => {
          return {
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS(currentChainInfo.id),
            abi: uniswapNftManagerABI,
            functionName: 'positions',
            args: [position.tokenId ? position.tokenId : '1'],
          }
          // use '1' as a placeholder for tokenId if it doesn't exist so it returns 0 for all collectData
        })
        multicall({ contracts: multiCallPositions, allowFailure: true })
          .then((res) => {
            const userPositions = positions.map((position, index) => {
              if (res[index]) {
                const { liquidity, tokensOwed0, tokensOwed1 } = res[index] as any
                return {
                  ...position,
                  contractData: {
                    liquidity,
                    tokensOwed0,
                    tokensOwed1,
                  },
                }
              }
              return position
            })
            setCurrentPositions(userPositions)
          })
          .catch(() => {
            setCurrentPositions([])
          })
      })

      .catch((err) => {
        window.log.error(err)
        setCurrentPositions([])
      })
  }

  const getAndSetAllUserOrders = (address: `0x${string}`) => {
    fetchOrdersForUsers(cushRpc, address)
      .then((orders) => {
        orders.sort((a, b) => {
          if (b.limit_order_full) {
            return 1
          }
          if (a.limit_order_full) {
            return -1
          }
          if (b.status?.toLowerCase() === 'open') {
            return 1
          }
          if (a.status?.toLowerCase() === 'open') {
            return -1
          }
          return b.time! - a.time!
        })

        setAllUserOrders(orders)
      })
      .catch(() => {
        setAllUserOrders([])
      })
  }

  return (
    <UserOrderContext.Provider
      value={{
        currentPositions,
        allUserOrders,
        getAndSetAllUserOrders,
        getAndSetCurrentPositions,
        userTokenBalances,
      }}
    >
      {children}
    </UserOrderContext.Provider>
  )
}

export const useUserOrderContext = (): UserOrderContextProps => {
  const context = useContext<UserOrderContextProps>(UserOrderContext)

  if (context === null) {
    throw new Error('"useUserOrderContext" should be used inside a "UserOrderContextProvider"')
  }

  return context
}
