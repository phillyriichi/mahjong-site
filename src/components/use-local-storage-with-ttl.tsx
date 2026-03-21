import { useState } from 'react'

interface StorageValue<T> {
  value: T
  expiry: number
}

function useLocalStorageWithTTL<T>(key: string, defaultValue: T, ttlInMs: number = 1000 * 3600) {
  const getStoredValue = (): T => {
    try {
      const itemStr = window.localStorage.getItem(key)
      if (!itemStr) return defaultValue

      const item: StorageValue<T> = JSON.parse(itemStr)
      const now = new Date().getTime()

      // if expired, remove the stored item.
      if (now > item.expiry) {
        window.localStorage.removeItem(key)
        return defaultValue
      }
      return item.value
    } catch (error) {
      return defaultValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  const setValue = (value: T) => {
    try {
      const expiry = new Date().getTime() + ttlInMs
      const dataToStore: StorageValue<T> = { value, expiry }
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(dataToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

export default useLocalStorageWithTTL
