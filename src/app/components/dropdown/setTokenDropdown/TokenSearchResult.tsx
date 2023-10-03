import { T2, T4 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { IToken } from '../../../lib/getToken'

export const TokenSearchResult = ({ token, setToken }: { token: IToken; setToken: (value: IToken) => void }) => {
  return (
    <button className="flex p-2 gap-x-2 cursor-pointer hover:bg-[#293249] w-full" onClick={() => setToken(token)}>
      <div className="h-[14px] w-[14px] rounded-full  mt-1">
        <img className="rounded-full" src={token.logoURI} alt={token.symbol} />
      </div>
      <div className="flex flex-col gap-y-1 items-start">
        <T2 color={colors.gray[100]}>{token.name}</T2>
        <T4 color={colors.gray[400]}>{token.symbol}</T4>
      </div>
    </button>
  )
}
