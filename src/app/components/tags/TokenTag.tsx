import { useChainLoader } from '../../route/RouteWrapper'
import { getTokenByAddress, IToken } from '../../lib/getToken'
import { T2 } from '../typography/Typography'
import { useEffect, useState } from 'react'

interface ITokenTag {
  tokenSymbol: string
  tokenAddress: string
}

function TokenTag(props: ITokenTag) {
  const { tokenSymbol, tokenAddress } = props
  const { currentChain } = useChainLoader()

  const [tokenInfo, setTokenInfo] = useState<IToken | undefined>(undefined)

  useEffect(() => {
    const res = getTokenByAddress(tokenAddress, currentChain)
    setTokenInfo(res)
  }, [tokenAddress])

  return (
    <div className="w-full flex items-center gap-1">
      <img src={tokenInfo?.logoURI} alt={tokenSymbol} className="h-3 w-3 rounded-full" />
      <T2>{tokenSymbol}</T2>
    </div>
  )
}

export default TokenTag
