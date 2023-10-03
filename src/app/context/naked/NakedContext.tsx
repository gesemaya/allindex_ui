import { Web3Provider } from '../../Web3Provider'
import { AuthContextProvider } from './AuthContext'
import { GeoipContextProvider } from './GeoipContext'
import { I18nProvider } from './I18nContext'
import { ModalContextProvider } from './ModalContext'
import { RpcContextProvider } from './RpcContext'
import { TelemetryContextProvider } from './TelemetryContext'
import { ThemeContextProvider } from './ThemeContext'
import React from 'react'
import { WindowContextProvider } from './WindowContext'

interface IContext {
  children: React.ReactNode
}

function NakedContext(props: IContext): any {
  const { children } = props
  const providers = [
    I18nProvider,
    ThemeContextProvider,
    GeoipContextProvider,
    WindowContextProvider,
    Web3Provider,
    RpcContextProvider,
    AuthContextProvider,
    ModalContextProvider,
    TelemetryContextProvider,
  ]
  return providers.reduceRight((acc, CurrVal) => <CurrVal>{acc as any}</CurrVal>, children)
}

export default NakedContext
