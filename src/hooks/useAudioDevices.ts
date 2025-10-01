import { useEffect, useState } from 'react'

export function useAudioDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const audioInputs = deviceList.filter(
        (device) => device.kind === 'audioinput'
      )
      setDevices(audioInputs)
    })
  }, [])

  return devices
}
