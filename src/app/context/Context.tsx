import { RpcBlockContextProvider } from './naked/RpcBlockContext'
import { ChartDataContextProvider } from '../components/charts/context/ChartDataContext'
import { DataContextProvider } from './DataContext'
import { PositionMakerContextProvider } from './PositionMakerContext'
import { SwapPageContextProvider } from './SwapPageContext'
import { TrollboxContextProvider } from './TrollboxContext'
import { UserOrderProvider } from './UserOrderContext'
import React from 'react'
import { NetworkContextProvider } from './NetworkContext'

interface IContext {
  children: React.ReactNode
}

function AppContext(props: IContext): any {
  const { children } = props
  const providers = [
    NetworkContextProvider,
    RpcBlockContextProvider,
    DataContextProvider,
    ChartDataContextProvider,
    PositionMakerContextProvider,
    UserOrderProvider,
    TrollboxContextProvider,
    SwapPageContextProvider,
  ]
  const res = providers.reduceRight((acc, CurrVal) => <CurrVal>{acc as any}</CurrVal>, children)
  return res as any
}

export default AppContext
