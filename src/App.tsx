import { useEffect, useState } from 'react'
import { useCamera } from './hooks/useCamera'
import { useTimer } from './hooks/useTimer'
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

  // Süre dolunca ya da oturum bitirilince kamerayı kapat ve özete geç.
  useEffect(() => {
    if (timer.status === 'done') {
      camera.stop()
      setScreen('sum')
    }
  }, [timer.status, camera.stop])

  // Sekme başlığında kalan süre: başka sekmedeyken de takip edilir.
  useEffect(() => {
    const active = timer.status === 'running' || timer.status === 'paused'
    document.title = active ? `${fmt(timer.remainingMs)} · Berry Focus` : 'Berry Focus'
  }, [timer.status, timer.remainingMs])

  const start = () => {
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
      {screen === 'work' && <Work timer={timer} camera={camera} />}
      {screen === 'sum' && <Summary elapsedMs={timer.elapsedMs} onAgain={again} />}
    </div>
  )
}
