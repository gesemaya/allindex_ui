import { track } from '@multibase/js'
import { useEffect, useState } from 'react'
import { useMatches, useParams } from 'react-router-dom'
import { useChainLoader } from './RouteWrapper'

export const TelemetrySender = () => {
  const { currentChainInfo } = useChainLoader()
  const matches = useMatches()
  const [pageName, setPageName] = useState('')
  const { poolAddress, token0, token1 } = useParams()
  useEffect(() => {
    for (const m of matches.reverse()) {
      if (m.handle) {
        const base = (m.handle as any).base
        if (base) {
          setPageName(base)
          break
        }
      }
    }
    if (pageName) {
      if (pageName === 'swap') {
        track(pageName + '_click', { chain: currentChainInfo.name, token0: token0, token1: token1 })
      } else {
        track(pageName + '_click', { chain: currentChainInfo.name, address: poolAddress })
      }
    }
  }, [matches])

  return <></>
}
