import { useChainLoader } from '../../../route/RouteWrapper'
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import { TokenInfoCarousel } from '@gfxlabs/oku'
import { fetchTopTokens } from '../../../data/cush_topTokens'
import CoinCarouselItem from './CoinCarouselItem'
import styles from './carousel.module.css'
import { useEffect, useState } from 'react'

function CoinCarousel() {
  const { cushRpc } = useChainLoader()
  const [tokenListNew, setTokenListNew] = useState<TokenInfoCarousel[]>([])

  const [tokenList, setTokenList] = useState<TokenInfoCarousel[]>([])

  const { width } = useWindowDimensions()
  const itemWidth = 100

  useEffect(() => {
    fetchTopTokens(cushRpc, { addresses: [] }).then((res) => {
      setTokenListNew(res)
    })
  }, [cushRpc])

  useEffect(() => {
    if (tokenListNew.length > 0) {
      const newWidth = itemWidth * tokenListNew.length
      setWidth(`-${newWidth}px`)
      setTokenList(addTokensToCarousel(tokenListNew, width, itemWidth))
    }
  }, [width, tokenListNew])

  function setWidth(width: string) {
    document.documentElement.style.setProperty('--width', width)
  }

  return (
    <div className={styles.carousel}>
      {tokenList.length > 0 &&
        tokenList.map((tokenItem, index) => {
          return (
            <div key={index} className="pb-2 pt-1 flex items-center  justify-center mx-3">
              <CoinCarouselItem token={tokenItem}></CoinCarouselItem>
            </div>
          )
        })}
    </div>
  )
}

export default CoinCarousel

const addTokensToCarousel = (tokenList: TokenInfoCarousel[], clientWidth: number, itemWidth: number) => {
  const itemsDisplayed = Math.ceil(clientWidth / itemWidth)
  const dataLength = tokenList.length
  const loopTotal = Math.floor(itemsDisplayed / dataLength)
  let newList = tokenList.concat(tokenList.slice(0, itemsDisplayed + 1))
  for (let i = 0; i < loopTotal; i++) {
    newList = newList.concat(tokenList.slice(0, itemsDisplayed - dataLength * (i + 1) + 1))
  }
  tokenList.concat(tokenList.slice(0, itemsDisplayed + 1))

  return newList
}
