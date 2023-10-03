import { useConfigContext } from '../../context/naked/ConfigContext'
import { useGeoipContext } from '../../context/naked/GeoipContext'
import { useEffect, useState } from 'react'

export const GeoblockProtected = ({ children }: { children: React.ReactNode }) => {
  const {
    features: { Geoblock },
  } = useConfigContext()

  const geoInfo = useGeoipContext()
  const [allowed, setAllowed] = useState(true)

  useEffect(() => {
    if (geoInfo.countryCode) {
      if (Geoblock.banned.includes(geoInfo.countryCode)) {
        setAllowed(false)
      }
    }
  }, [geoInfo.countryCode])

  if (!allowed) {
    return <div>the country-code {geoInfo.countryCode} has been geoblocked by this deployment</div>
  }

  return <>{children}</>
}
