import { useConfigContext } from './ConfigContext'
import { createContext, useContext, useEffect, useState } from 'react'

interface GeoipContextProps {
  countryCode: string
}

const GeoipContext = createContext({} as GeoipContextProps)

export const GeoipContextProvider = ({ children }: { children: any }) => {
  const config = useConfigContext()
  const [countryCode, setCountryCode] = useState('')
  const [retry, setRetry] = useState(1)
  const getCountry = async () => {
    return fetch(config.features.Geoblock.provider)
      .then((x) => {
        return x.json()
      })
      .then((res) => {
        return res.country
      })
  }
  const updateCountry = async () => {
    if (retry < 10) {
      return getCountry()
        .then((x) => {
          setCountryCode(x)
          setRetry(100)
        })
        .catch(() => {
          setRetry(retry + 1)
        })
    }
  }
  useEffect(() => {
    updateCountry().then()
  }, [retry])
  return (
    <GeoipContext.Provider
      value={{
        countryCode,
      }}
    >
      {children}
    </GeoipContext.Provider>
  )
}

export const useGeoipContext = (): GeoipContextProps => {
  const context = useContext<GeoipContextProps>(GeoipContext)
  if (context === null) {
    throw new Error('"useGeoipContext" should be used inside a "GeoipContextProvider"')
  }

  return context
}
