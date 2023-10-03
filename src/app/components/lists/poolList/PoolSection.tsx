import { useChainLoader } from '../../../route/RouteWrapper'
import { WATCH_LIST_TITLE } from '../../../constants/misc'
import { SearchResponse } from '@gfxlabs/oku'
import { searchForPool } from '../../../data/searchForPool'
import PoolDropDown from '../../dropdown/PoolDropDown'
import SearchDropdownInput from '../../inputs/SearchDropdownInput'
import PoolList from './PoolList'
import { useEffect, useState } from 'react'

interface IPoolSection {
  onClose?: () => void
}

export const PoolSection = (props: IPoolSection) => {
  const { onClose = () => {} } = props
  const [token, setToken] = useState(WATCH_LIST_TITLE)
  const [searchResults, setSearchResults] = useState<SearchResponse | undefined>(undefined)
  const [input, setInput] = useState('')
  const [lastToken, setLastToken] = useState(WATCH_LIST_TITLE)
  const { cushRpc } = useChainLoader()
  const { currentChain } = useChainLoader()

  useEffect(() => {
    setToken(WATCH_LIST_TITLE)
  }, [currentChain])

  useEffect(() => {
    if (token !== '') {
      setLastToken(token)
      setInput('')
    }
  }, [token])

  useEffect(() => {
    if (input !== '') {
      setToken('')
    } else if (input === '' && token === '') {
      setToken(lastToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  const onChange = (val: string) => {
    setInput(val)
    searchForPool(cushRpc, val as unknown as string).then((searchResults) => {
      if (searchResults && searchResults.pools.length > 0) {
        setSearchResults(searchResults)
      } else {
        setSearchResults(undefined)
      }
    })
  }

  return (
    <div className="z-[0]  height: h-[100%] xl:h-[50%]" style={{ zIndex: 0 }}>
      <div className="flex flex-col gap-1 h-full ">
        <div className="flex flex-row gap-1">
          <SearchDropdownInput onChange={onChange} value={input} width="100%" />
          <div className="w-[120px]">
            <PoolDropDown token={token} setToken={setToken} />
          </div>
        </div>
        <PoolList token={token} searchResults={searchResults} onClose={onClose} />
      </div>
    </div>
  )
}

export default PoolSection
