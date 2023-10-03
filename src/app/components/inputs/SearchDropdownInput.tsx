import Search from '../../assets/search.svg'
import { colors } from '../../constants/colors'
import useBreakpoint from '../../hooks/useBreakpoint'
import { Trans } from '@lingui/react'
import { useState } from 'react'

interface ISearchDropdownInput {
  //    setSearchResults: (val: SearchResponse | undefined) => void
  onChange: (value: string) => void
  value: string
  width?: number | string
}

function SearchDropdownInput(props: ISearchDropdownInput) {
  const { onChange, width = '100%', value } = props
  const inputWidth = width
  const inputHeight = 32
  const placeHolderPadding = useBreakpoint({ base: '8px', sm: '16px' })
  const [focus, setFocus] = useState(false)
  return (
    <Trans
      id="Search Dropdown Input"
      render={() => (
        <input
          className="flex flex-1 placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal rounded-[16px] border-[1px] text-white"
          style={{
            width: inputWidth,
            height: inputHeight,
            backgroundColor: colors.gray[900],
            borderColor: focus ? colors.blue.vibrant : colors.gray[700],
            paddingLeft: placeHolderPadding,
            backgroundImage: focus || value !== '' ? '' : `url(${Search})`,
            backgroundSize: '12px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px center',
          }}
          onFocus={() => {
            setFocus(true)
          }}
          onBlur={() => {
            setFocus(false)
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    />
  )
}

export default SearchDropdownInput
