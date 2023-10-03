export const getLocalStorageItem = (key: string) => {
  const stored = window.localStorage.getItem(key)
  try {
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    return null
  }
}

export const setLocalStorageItem = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))

  return value
}

export const appendLocalStorageItem = (key: string, value: any) => {
  const stored = getLocalStorageItem(key)
  const newValue = stored ? [...stored, value] : [value]

  return setLocalStorageItem(key, newValue)
}

export const removeLocalStorageItem = (key: string, value: any) => {
  const stored = getLocalStorageItem(key)
  const newValue = stored ? stored.filter((item: any) => item !== value) : []

  return setLocalStorageItem(key, newValue)
}
