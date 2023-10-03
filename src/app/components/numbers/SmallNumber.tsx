import { convertFromSciNot } from '../../util/formatNumbers'

interface ISmallNumber {
  number: number
  showOnly2Digits?: boolean
  minimumNumber?: number
  removeTrailingZeros?: boolean
}

function SmallNumber(props: ISmallNumber) {
  const { number, showOnly2Digits, minimumNumber = 1e-2, removeTrailingZeros = false } = props
  const isNumberNegative = number < 0
  const isNumberSmallEnough = Math.abs(number) < minimumNumber

  const getZerosAfterDecimal = (): number => {
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

  const getDigitsToShow = (): string => {
    let digitsToShow = (Math.abs(number) * Math.pow(10, getZerosAfterDecimal() + 4)).toPrecision(4)
    digitsToShow = digitsToShow.includes('.')
      ? `${digitsToShow.slice(0, digitsToShow.indexOf('.'))} ${removeTrailingZeros ? '' : '000'}`
      : digitsToShow
    digitsToShow = showOnly2Digits ? digitsToShow.substring(0, digitsToShow.length - 2) : digitsToShow
    return digitsToShow
  }

  return (
    <span>
      {isNumberSmallEnough && number !== 0 ? (
        <>
          <span>{isNumberNegative ? '-0.0' : '0.0'}</span>
          <sub>{`${getZerosAfterDecimal()}`}</sub>
          <span>{getDigitsToShow()}</span>
        </>
      ) : (
        number
      )}
    </span>
  )
}

export default SmallNumber
