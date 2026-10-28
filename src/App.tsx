import { useEffect, useState } from 'react'
import { useCamera } from './hooks/useCamera'
import { usePhoneAlert } from './hooks/usePhoneAlert'
import { usePhoneDetector } from './hooks/usePhoneDetector'
import { useTimer } from './hooks/useTimer'
import { setMuted as applyMuted, unlockAudio } from './lib/sound'
import AlertOverlay from './components/AlertOverlay'
import { fmt } from './lib/format'
import Setup from './screens/Setup'
import Summary from './screens/Summary'
import Work from './screens/Work'

type Screen = 'setup' | 'work' | 'sum'

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [minutes, setMinutes] = useState(50)
  const timer = useTimer()
  const camera = useCamera()
  const [detectOn, setDetectOn] = useState(true)
  const [simulate, setSimulate] = useState(false)
  const [muted, setMutedState] = useState(false)

  const running = timer.status === 'running'
  const detector = usePhoneDetector(camera.videoRef, running && camera.state === 'on' && detectOn)
  const level = usePhoneAlert(running && (detector.phone || simulate))

  // "Uyarıyı dene" açık unutulmasın: 25 saniye sonra kendiliğinden kapanır.
  useEffect(() => {
    if (!simulate) return
    const id = setTimeout(() => setSimulate(false), 25_000)
    return () => clearTimeout(id)
  }, [simulate])

  const setMuted = (v: boolean) => {
    setMutedState(v)
    applyMuted(v)
  }

  // Süre dolunca ya da oturum bitirilince kamerayı kapat ve özete geç.
  useEffect(() => {
    if (timer.status === 'done') {
      camera.stop()
      setSimulate(false)
      setScreen('sum')
    }
  }, [timer.status, camera.stop])

  // Sekme başlığında kalan süre: başka sekmedeyken de takip edilir.
  useEffect(() => {
    const active = timer.status === 'running' || timer.status === 'paused'
    document.title = active ? `${level >= 2 ? '⚠️ Telefonu bırak! · ' : ''}${fmt(timer.remainingMs)} · Berry Focus` : 'Berry Focus'
  }, [timer.status, timer.remainingMs, level])

  const start = () => {
    unlockAudio() // ses ve konuşma için tıklama anında izin al
    timer.start(minutes)
    setScreen('work')
    void camera.start() // tıklama anında başlar: tarayıcı izin penceresini güvenle açar
  }

  const again = () => {
    timer.reset()
    setScreen('setup')
  }

  return (
    <div className="wrap">
      <div className="brand">
        <svg width="30" height="30" viewBox="0 0 200 220" aria-hidden="true">
          <path d="M100 40C150 35 185 65 175 115 165 165 125 200 100 205 75 200 35 165 25 115 15 65 50 35 100 40Z" fill="#E8466C" />
          <path d="M100 42 70 14 100 28 130 14Z" fill="#6FA35B" />
        </svg>
        Berry Focus
      </div>
      {screen === 'setup' && <Setup minutes={minutes} setMinutes={setMinutes} onStart={start} />}
      {screen === 'work' && <Work
          timer={timer} camera={camera} level={level} detectorState={detector.state} boxes={detector.boxes}
          detectOn={detectOn} setDetectOn={setDetectOn} simulate={simulate} setSimulate={setSimulate}
          muted={muted} setMuted={setMuted}
        />}
      <AlertOverlay level={level} />
      {screen === 'sum' && <Summary elapsedMs={timer.elapsedMs} onAgain={again} />}
    </div>
  )
}
