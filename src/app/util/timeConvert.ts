export const timeConvert = (timeStamp: number) => {
  const date = new Date(timeStamp)
  const second =
    date.getSeconds().toString() === '0'
      ? '00'
      : date.getSeconds() < 10
      ? '0' + date.getSeconds().toString()
      : date.getSeconds().toString()
  const minute =
    date.getMinutes().toString() === '0'
      ? '00'
      : date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes().toString()
  const hour =
    date.getHours().toString() === '0'
      ? '00'
      : date.getHours() < 10
      ? '0' + date.getHours().toString()
      : date.getHours().toString()
  const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  return { second, minute, hour, day, month, year }
}

export const getMMDDYYYY = (timeStamp: number | string) => {
  const date = new Date(timeStamp)
  const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  const mmddyyyy = month + '/' + day + '/' + year
  return mmddyyyy
}

export const xTimeDataConvert = (data: number) => {
  const { minute, second, hour, day, month } = timeConvert(data)
  const time = month + '/' + day + ', ' + hour + ':' + minute + ':' + second

  return time
}

// take timestamp string and return time in format: 00:00:00
export const timeConvertString = (timeStamp: string) => {
  const date = new Date(timeStamp)
  const second =
    date.getSeconds().toString() === '0'
      ? '00'
      : date.getSeconds() < 10
      ? '0' + date.getSeconds().toString()
      : date.getSeconds().toString()
  const minute =
    date.getMinutes().toString() === '0'
      ? '00'
      : date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes().toString()
  const hour =
    date.getHours().toString() === '0'
      ? '00'
      : date.getHours() < 10
      ? '0' + date.getHours().toString()
      : date.getHours().toString()
  const time = hour + ':' + minute + ':' + second
  return time
}

// take timestamp number and return time in format: 00:00:00
export const timeNumberConvertString = (timeStamp: number) => {
  const date = new Date(timeStamp)
  const second =
    date.getSeconds().toString() === '0'
      ? '00'
      : date.getSeconds() < 10
      ? '0' + date.getSeconds().toString()
      : date.getSeconds().toString()
  const minute =
    date.getMinutes().toString() === '0'
      ? '00'
      : date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes().toString()
  const hour =
    date.getHours().toString() === '0'
      ? '00'
      : date.getHours() < 10
      ? '0' + date.getHours().toString()
      : date.getHours().toString()
  const time = hour + ':' + minute + ':' + second
  return time
}
