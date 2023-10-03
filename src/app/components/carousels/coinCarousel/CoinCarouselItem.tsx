import { useChainLoader } from '../../../route/RouteWrapper'
import { FormatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getTokenByAddress } from '../../../lib/getToken'
import { FontWeightEnums } from '../../../types/Enums'
import { TokenInfoCarousel } from '@gfxlabs/oku'

interface ICoinCarouselItem {
  token: TokenInfoCarousel
}

const CoinCarouselItem = (props: ICoinCarouselItem) => {
  const { token } = props
  const { currentChain } = useChainLoader()
  const tokenInfo = getTokenByAddress(token.address, currentChain)
  return (
    <button>
      <div className="flex flex-row gap-x-1">
        <div className="h-[14px] w-[14px] rounded-full] bg-white rounded-full">
          <img className="rounded-full text-white" src={tokenInfo.logoURI} alt={'?'} />
        </div>
        <div className="flex flex-row gap-x-[6px]">
          <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            {<FormatNumber num={token.price} showOnly2Digits={true} />}
          </T3>
          <T3>{(token.change * 100).toFixed(2)}%</T3>
        </div>
      </div>
    </button>
  )
}

export default CoinCarouselItem
