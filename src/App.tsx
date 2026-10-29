import { useEffect, useRef, useState } from 'react'
import { useCamera } from './hooks/useCamera'
import { usePhoneAlert } from './hooks/usePhoneAlert'
import { usePhoneDetector } from './hooks/usePhoneDetector'
import { useSessionRecorder } from './hooks/useSessionRecorder'
import { useTimer } from './hooks/useTimer'
import { fmt } from './lib/format'
import { setMuted as applyMuted, unlockAudio } from './lib/sound'
import { loadSessions, saveSessions, type Session } from './lib/storage'
import AlertOverlay from './components/AlertOverlay'
import History from './screens/History'
import Setup from './screens/Setup'
import Summary from './screens/Summary'
import Work from './screens/Work'

type Screen = 'setup' | 'work' | 'sum' | 'history'
const MIN_SAVE_SECONDS = 10

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [minutes, setMinutes] = useState(50)
  const timer = useTimer()
  const camera = useCamera()
  const [detectOn, setDetectOn] = useState(true)
  const [simulate, setSimulate] = useState(false)
  const [muted, setMutedState] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(loadSessions)
  const [last, setLast] = useState<{ session: Session; saved: boolean } | null>(null)
  const startedAt = useRef(0)

  const running = timer.status === 'running'
  const detector = usePhoneDetector(camera.videoRef, running && camera.state === 'on' && detectOn)
  const tracking = detectOn && camera.state === 'on' && detector.state === 'ready'
  const recorder = useSessionRecorder(running, detector.phone, tracking)
  // "Uyarıyı dene" sadece uyarıları tetikler, verimlilik kaydına girmez.
  const level = usePhoneAlert(running && (detector.phone || simulate))

  // "Uyarıyı dene" açık unutulmasın: 25 saniye sonra kendiliğinden kapanır.
  useEffect(() => {
    if (!simulate) return
    const id = setTimeout(() => setSimulate(false), 25_000)
    return () => clearTimeout(id)
  }, [simulate])

  // Süre dolunca ya da oturum bitirilince: kamerayı kapat, oturumu kaydet, özete geç.
  useEffect(() => {
    if (timer.status !== 'done') return
    camera.stop()
    setSimulate(false)
    const samples = recorder.read()
    const session: Session = {
      id: String(startedAt.current),
      startedAt: startedAt.current,
      plannedMin: Math.round(timer.totalMs / 60_000),
      samples,
    }
    const saved = samples.length >= MIN_SAVE_SECONDS
    if (saved) {
      setSessions((prev) => {
        const next = [...prev, session]
        saveSessions(next)
        return next
      })
    }
    setLast({ session, saved })
    setScreen('sum')
  }, [timer.status])

  // Sekme başlığında kalan süre: başka sekmedeyken de takip edilir.
  useEffect(() => {
    const active = timer.status === 'running' || timer.status === 'paused'
    document.title = active ? `${level >= 2 ? '⚠️ Telefonu bırak! · ' : ''}${fmt(timer.remainingMs)} · Berry Focus` : 'Berry Focus'
  }, [timer.status, timer.remainingMs, level])

  const setMuted = (v: boolean) => {
    setMutedState(v)
    applyMuted(v)
  }

  const start = () => {
    recorder.reset()
    startedAt.current = Date.now()
    unlockAudio() // ses ve konuşma için tıklama anında izin al
    timer.start(minutes)
    setScreen('work')
    void camera.start() // tıklama anında başlar: tarayıcı izin penceresini güvenle açar
  }

  const again = () => {
    timer.reset()
    setScreen('setup')
  }

  const rate = (r: 1 | 2 | 3) => {
    if (!last) return
    const updated = { ...last.session, rating: r }
    setLast({ ...last, session: updated })
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === updated.id ? updated : s))
      saveSessions(next)
      return next
    })
  }

  const clearHistory = () => {
    setSessions([])
    saveSessions([])
  }

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <svg width="30" height="30" viewBox="0 0 200 220" aria-hidden="true">
            <path d="M100 40C150 35 185 65 175 115 165 165 125 200 100 205 75 200 35 165 25 115 15 65 50 35 100 40Z" fill="#E8466C" />
            <path d="M100 42 70 14 100 28 130 14Z" fill="#6FA35B" />
          </svg>
          Berry Focus
        </div>
        {screen !== 'work' && (
          <button className="chip" onClick={() => setScreen(screen === 'history' ? 'setup' : 'history')}>
            {screen === 'history' ? 'Geri' : 'Geçmiş'}
          </button>
        )}
      </header>
      {screen === 'setup' && <Setup minutes={minutes} setMinutes={setMinutes} onStart={start} />}
      {screen === 'work' && (
        <Work
          timer={timer} camera={camera} level={level} detectorState={detector.state} boxes={detector.boxes}
          detectOn={detectOn} setDetectOn={setDetectOn} simulate={simulate} setSimulate={setSimulate}
          muted={muted} setMuted={setMuted}
        />
      )}
      <AlertOverlay level={level} />
      {screen === 'sum' && last && (
        <Summary session={last.session} saved={last.saved} onRate={rate} onAgain={again} onHistory={() => setScreen('history')} />
      )}
      {screen === 'history' && <History sessions={sessions} onClear={clearHistory} onNew={again} />}
    </div>
  )
}
