import { TokenList } from './app/lib/tokenList'
import log from 'loglevel'

if (window.log === undefined) {
  window.log = log
  const originalFactory = log.methodFactory
  log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName)
    return rawMethod.bind(rawMethod, `[${methodName}]`)
  }
  //log.setLevel(window.ConfigJsStaticOptions.Logging.level)
}

declare global {
  interface Window {
    ConfigJsStaticOptions: any
    OkuTokenList: any
    log: log.RootLogger
  }
}

export const DefaultConfig = window.ConfigJsStaticOptions
export const DefaultTokenList: TokenList = window.OkuTokenList
