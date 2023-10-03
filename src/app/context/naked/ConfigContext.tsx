import { DefaultConfig } from '../../../config'

export interface ConfigFeatures {
  Login: {
    url: string
    app_id: string
    path_prefix: string
  }
  Chat: {
    enabled: string
    url: string
  }
  ChainRpc: {
    omni: string
    protocols: string[]
  }
  Telemetry: {
    enabled: string
    url: string
    multibase_key: string
  }
  Whitelist: {
    enabled: string
  }
  Swap: {
    enabled: string
  }
  Logging: {
    level: any
  }
  Geoblock: {
    provider: string
    banned: string[]
  }
  Analytics: {
    enabled: string
    url: string
  }
  Chains: {
    comingsoon: string[]
    hidden: string[]
  }
}

const coalesce = <T,>(x: T | undefined, d: T) => {
  if (x) {
    return x
  }
  return d
}

const DefaultFlags = {
  Chat: {
    enabled: coalesce(import.meta.env.VITE_CHAT_ENABLED, 'false'),
  },
  Swap: {
    enabled: coalesce(import.meta.env.VITE_SWAP_ENABLED, 'false'),
  },
  Telemetry: {
    enabled: coalesce(import.meta.env.VITE_TELEMETRY_ENABLED, 'true'),
  },
}

export type ConfigFlags = typeof DefaultFlags

interface ConfigContextProps {
  features: ConfigFeatures
  flags: ConfigFlags
}

const DEFAULT_FEATURES: ConfigFeatures = DefaultConfig

export const useConfigContext = (): ConfigContextProps => {
  const features = { ...DEFAULT_FEATURES }
  if (!features.Logging) {
    features.Logging = {
      level: 'warn',
    }
  }
  const flags = { ...DefaultFlags }
  return { features, flags }
}
