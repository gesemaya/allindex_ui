import { DEFAULT_LOCALE } from '../constants/locales'

export const formatNumberToString = (
  num: number | string,
  getOnly2Digits?: boolean,
  useScientificNotation?: boolean
): string => {
  //Validations for 'num' parameter:
  if (typeof num === 'string') {
    num = Number(num)
  }
  if (num === 0) return '0.00'
  if (!num || isNaN(num)) return ''
  //Manage small and big number scenarios:
  if (Math.abs(num) < 0.00001) {
    return formatSmallNumberToString(num, getOnly2Digits)
  }

  if (Math.abs(num) >= Math.pow(10, 18) || useScientificNotation) {
    return `${num.toExponential(2).replace('e', 'x10^')}`
  }

  //Manage depending on number size:
  if (Math.abs(num) >= 0.00001 && Math.abs(num) < 1) {
    const smallNum = Number(num.toFixed(9)).toLocaleString(DEFAULT_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 9,
    })

    return removeTrailingZeros(smallNum)
  }
  if (Math.abs(num) >= 1 && Math.abs(num) < 10000) {
    return `${Number(num.toPrecision(7)).toLocaleString(DEFAULT_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`
  }
  if (Math.abs(num) >= 10000 && Math.abs(num) < 1000000) {
    return `${Number(num / 1000).toFixed(2)}K`
  }
  if (Math.abs(num) >= 1000000 && Math.abs(num) < 1000000000) {
    return `${Number(num / 1000000).toFixed(2)}M`
  }
  if (Math.abs(num) >= 1000000000 && Math.abs(num) < 1000000000000) {
    return `${Number(num / 1000000000).toFixed(2)}B`
  }
  if (Math.abs(num) >= 1000000000000 && Math.abs(num) < 1000000000000000) {
    return `${Number(num / 1000000000000).toFixed(2)}T`
  }
  if (Math.abs(num) >= 1000000000000000 && Math.abs(num) < 1000000000000000000) {
    return `${Number(num / 1000000000000000).toFixed(2)}Q`
  }

  return `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 2 })}`
}

export const formatSmallNumberToString = (num: number | string, getOnly2Digits?: boolean) => {
  if (typeof num === 'string') {
    num = Number(num)
  }

  if (num === 0) return '0.00'
  if (!num) return ''
  if (num >= 0.00001) {
    return formatNumberToString(num)
  }
  const isNumberNegative = num < 0

  return `${isNumberNegative ? '-0.0' : '0.0'}(${getZerosAfterDecimal(num)})${getDigitsAfterDecimalZeros(
    num,
    getOnly2Digits
  )}`
}

export const removeTrailingZeros = (num: number | string): string => {
  const isGreaterThanOne = Number(num) > 1

  const [intPart, decimalPart] = String(num).split('.')

  if (!decimalPart) {
    return intPart
  }

  const trimmedDecimal = decimalPart.replace(/0+$/, '')

  if (!trimmedDecimal) {
    return `${intPart}.00`
  }

  if (isGreaterThanOne) {
    const roundedDecimal = Number(`0.${trimmedDecimal}`).toFixed(2).slice(2)
    return `${intPart}.${trimmedDecimal}${roundedDecimal}`
  }

  return `${intPart}.${trimmedDecimal}`
}

const getZerosAfterDecimal = (number: number): number => {
  let numberString = number.toString()
  if (numberString.includes('e-')) {
    numberString = convertFromSciNot(number)
    // If the numberString is '0' it doesn't have any decimals. So just get the exponential part
    if (numberString === '0') {
      return Number(number.toString().slice(number.toString().indexOf('-') + 1, number.toString().length))
    }
  }
  const zeros = numberString.match('.([0]*)([{1-9}])')
  const numberZeros = zeros ? zeros[1].length : 0
  return numberZeros
}

const getDigitsAfterDecimalZeros = (number: number, getOnly2Digits?: boolean): string => {
  let digitsToShow = (Math.abs(number) * Math.pow(10, getZerosAfterDecimal(number) + 4)).toPrecision(4)
  digitsToShow = digitsToShow.includes('.') ? `${digitsToShow.slice(0, digitsToShow.indexOf('.'))}000` : digitsToShow
  digitsToShow = getOnly2Digits ? digitsToShow.substring(0, digitsToShow.length - 2) : digitsToShow
  return digitsToShow
}

export const prettyNumber = (number: number, sigfigs?: number) => {
  let exp = sigfigs ? sigfigs : number > 1 ? 3 : 4
  if (number === 0) return '0'
  const sigFig = Math.log10(number)

  let ans: string
  if (sigFig >= 0) {
    ans = number.toFixed(exp - 1).toString()
  } else {
    if (sigFig < -exp) {
      ans = SciNot(number, sigfigs)
    } else {
      ans = number.toFixed(Math.abs(sigFig) + exp).toString()
    }
  }

  if (Number(ans) >= 1) {
    ans = removeTrailingZeros(numberWithCommas(ans))
  } else {
    ans = ans.includes('e-') ? convertFromSciNot(Number(ans)) : ans
  }

  return removeTrailingZeros(ans)
}

const SciNot = (number: number, exp?: number) => number.toExponential(exp ? exp : 4)

export const numberWithCommas = (x: string): string => {
  let numx = Number(x)
  if (isNaN(numx)) {
    numx = 0
  }
  return numx.toLocaleString('en-US')
}

export const convertFromSciNot = (number: number) => {
  if (!number.toString().includes('e')) return number.toString()
  const decimalsPart = number.toString().split('.')?.[1] || ''
  const eDecimals = Number(decimalsPart?.split('e-')?.[1]) || 0
  const countOfDecimals = decimalsPart.length + eDecimals
  return Number(number).toFixed(countOfDecimals)
}

/**
 * @deprecated Please use FormatNumber component or formatNumberToString (for string representation)
 */
export const formatPriceInLocale = (num: number | string) => {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  const prettyNum = prettyNumber(num)

  const removedDec = prettyNum.replace(/,/g, '')

  if (parseFloat(removedDec) >= 1) {
    return parseFloat(removedDec).toFixed(2)
  }

  return prettyNum
}
