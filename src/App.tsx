import { useConversation } from '@elevenlabs/react'
import { useState } from 'react'
import './App.css'
import { useInputVolume } from './hooks/useInputVolume'
import { useAudioDevices } from './hooks/useAudioDevices'

function App() {
  const {
    startSession,
    endSession,
    isSpeaking,
    getInputVolume,
    status,
    changeInputDevice,
  } = useConversation()

  const [selectedDevice, setSelectedDevice] = useState<string>('')

  const isConnected = status === 'connected'
  
  const inputVolume = useInputVolume(getInputVolume, isConnected)
  const devices = useAudioDevices()

  const start = async () => {
    await startSession({
      agentId: import.meta.env.VITE_AGENT_ID,
      connectionType: 'webrtc',
      ...(selectedDevice && { inputDeviceId: selectedDevice }),
    })
  }

  const handleDeviceChange = async (deviceId: string) => {
    setSelectedDevice(deviceId)

    if (status === 'connected') {
      await changeInputDevice({
        inputDeviceId: deviceId,
        format: 'pcm',
        sampleRate: 16000,
      })
    }
  }

  return (
    <div className="app-container">
      <div>
        <div className="logo-container">
          <img
            src="/src/assets/yardvark-logo-transparent.png"
            alt="Yardvark"
            className="logo"
          />
        </div>
        <h1 className="app-title">Lawn Care Assistant</h1>
        <div className="input-group">
          <label className="input-label">Microphone</label>
          <select
            value={selectedDevice}
            onChange={(e) => handleDeviceChange(e.target.value)}
            disabled={isConnected}
            className="device-select"
          >
            <option value="">Default</option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
        {isConnected && (
          <>
            <div className="volume-indicator">
              <div className="volume-status">
                <span className="volume-icon">
                  {inputVolume > 0.01 ? '🎤' : '🎧'}
                </span>
                <span className="volume-text">
                  {inputVolume > 0.01 ? 'Speaking' : 'Listening'}
                </span>
              </div>
              <div className="volume-bar">
                <div
                  className={`volume-bar-fill ${inputVolume > 0.01 ? 'active' : 'inactive'}`}
                  style={{ width: `${Math.min(inputVolume * 200, 100)}%` }}
                />
              </div>
            </div>
            <div className={`speaking-indicator ${!isSpeaking ? 'inactive' : ''}`}>
              <div className="speaking-wave">
                <div className="speaking-wave-bar"></div>
                <div className="speaking-wave-bar"></div>
                <div className="speaking-wave-bar"></div>
                <div className="speaking-wave-bar"></div>
              </div>
              <span>{isSpeaking ? 'Assistant is speaking' : 'Assistant is listening'}</span>
            </div>
          </>
        )}
        <button
          onClick={isConnected ? endSession : start}
          className={`session-button ${isConnected ? 'connected' : 'disconnected'}`}
        >
          {isConnected ? 'End Session' : 'Start Session'}
        </button>
      </div>
    </div>
  )
}

export default App
