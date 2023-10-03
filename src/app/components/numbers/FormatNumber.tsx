import { DEFAULT_LOCALE } from '../../constants/locales'
import SmallNumber from './SmallNumber'

interface IFormatNumber {
  num: number | string
  singleLetterNotation?: boolean
  showOnly2Digits?: boolean
  smallNumberOn2Zeros?: boolean
  useScientificNotation?: boolean
}

export const FormatNumber = (props: IFormatNumber) => {
  const { singleLetterNotation, showOnly2Digits, smallNumberOn2Zeros, useScientificNotation } = props
  let { num } = props

  //Validations for 'num' parameter:
  if (typeof num === 'string') {
    num = Number(num)
  }
  if (num === 0) return <>{'0.00'}</>
  if (!num || isNaN(num)) return <></>

  //Manage small and big number scenarios:
  if (Math.abs(num) < 0.000001 || (smallNumberOn2Zeros && Math.abs(num) < 0.01)) {
    return <SmallNumber number={num} showOnly2Digits={showOnly2Digits} />
  }
  if (Math.abs(num) >= Math.pow(10, 18) || useScientificNotation) {
    return <>{`${num.toExponential(2).replace('e+', 'x10^')}`}</>
  }

  //Manage depending on number size:
  if (Math.abs(num) >= 0.000001 && Math.abs(num) <= 0.001) {
    return (
      <>
        {`${Number(num.toFixed(6)).toLocaleString(DEFAULT_LOCALE, {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })}`}
      </>
    )
  }
  if (Math.abs(num) >= 0.00001 && Math.abs(num) < 1) {
    return (
      <>
        {showOnly2Digits
          ? `${Number(num.toFixed(5)).toLocaleString(DEFAULT_LOCALE, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : `${Number(num.toFixed(5)).toLocaleString(DEFAULT_LOCALE, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 5,
            })}`}
      </>
    )
  }
  if (Math.abs(num) >= 1 && Math.abs(num) < 10) {
    return (
      <>
        {showOnly2Digits
          ? `${Number(num.toPrecision(6)).toLocaleString(DEFAULT_LOCALE, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : `${Number(num.toPrecision(6)).toLocaleString(DEFAULT_LOCALE, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3,
            })}`}
      </>
    )
  }
  if (Math.abs(num) >= 10 && Math.abs(num) < 10000) {
    return (
      <>
        {`${Number(num.toPrecision(6)).toLocaleString(DEFAULT_LOCALE, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
      </>
    )
  }
  if (Math.abs(num) >= 10000 && Math.abs(num) < 1000000) {
    return (
      <>
        {singleLetterNotation
          ? `${Number(num / 1000).toFixed(2)}K`
          : `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`}
      </>
    )
  }
  if (Math.abs(num) >= 1000000 && Math.abs(num) < 1000000000) {
    return (
      <>
        {singleLetterNotation
          ? `${Number(num / 1000000).toFixed(2)}M`
          : `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`}
      </>
    )
  }
  if (Math.abs(num) >= 1000000000 && Math.abs(num) < 1000000000000) {
    return (
      <>
        {singleLetterNotation
          ? `${Number(num / 1000000000).toFixed(2)}B`
          : `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`}
      </>
    )
  }
  if (Math.abs(num) >= 1000000000000 && Math.abs(num) < 1000000000000000) {
    return (
      <>
        {singleLetterNotation
          ? `${Number(num / 1000000000000).toFixed(2)}T`
          : `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`}
      </>
    )
  }
  if (Math.abs(num) >= 1000000000000000 && Math.abs(num) < 1000000000000000000) {
    return (
      <>
        {singleLetterNotation
          ? `${Number(num / 1000000000000000).toFixed(2)}Q`
          : `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`}
      </>
    )
  }

  return <>{`${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`}</>
}

interface IFormatNumberByGranularity {
  num: number
  granularity: number
}

export const FormatByGranularity = (props: IFormatNumberByGranularity) => {
  const { granularity } = props
  let { num } = props

  if (num === 0) return <>{'0.00'}</>
  if (!num || isNaN(num)) return <></>
  if (num < 0.000001) {
    return <SmallNumber number={num} />
  }
  let formatted: string
  if (num >= 0.0000001 && num <= 0.001) {
    return <>{num.toFixed(granularity < 0 ? Math.abs(granularity) : 0)}</>
  } else if (num >= 0.00001 && num < 0.1) {
    return <>{num.toFixed(granularity < 0 ? Math.abs(granularity) : 0)}</>
  } else if (num >= 0.1 && num < 1000000) {
    formatted = num.toFixed(4)
  } else if (num >= Math.pow(10, 4)) {
    formatted = num.toExponential(2)
  } else {
    formatted = `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`
  }
  return (
    <>
      {granularity < 0 ? (
        Number(formatted).toFixed(Math.abs(granularity))
      ) : (
        <FormatNumber num={Number(formatted)} singleLetterNotation={true} />
      )}
    </>
  )
}
