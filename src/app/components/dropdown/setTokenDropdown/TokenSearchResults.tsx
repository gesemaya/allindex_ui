import { IToken } from '../../../lib/getToken'
import { TokenSearchResult } from './TokenSearchResult'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

export const TokenSearchResults = ({
  searchResults,
  setToken,
}: {
  searchResults: IToken[]
  setToken: (value: IToken) => void
}) => (
  <FixedSizeList height={290} itemCount={searchResults.length} itemSize={50} width="100%">
    {({ index, style }: ListChildComponentProps) => (
      <div style={style}>
        <TokenSearchResult token={searchResults[index]} setToken={setToken} />
      </div>
    )}
  </FixedSizeList>
)
