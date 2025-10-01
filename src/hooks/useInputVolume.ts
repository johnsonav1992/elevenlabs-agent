import { useEffect, useState } from 'react'

export function useInputVolume(
  getInputVolume: () => number,
  isConnected: boolean
) {
  const [inputVolume, setInputVolume] = useState(0)

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setInputVolume(getInputVolume())
      }, 100)
      return () => clearInterval(interval)
    }
  }, [getInputVolume, isConnected])

  return inputVolume
}
