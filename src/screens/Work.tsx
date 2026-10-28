import Berry from '../components/Berry'
import CameraPanel from '../components/CameraPanel'
import { fmt } from '../lib/format'
import type { AlertLevel } from '../lib/alertLevel'
import type { Camera } from '../hooks/useCamera'
import type { Box, DetectorState } from '../hooks/usePhoneDetector'
import type { Timer } from '../hooks/useTimer'

const MESSAGES = [
  'Harika gidiyorsun! Telefon masada kalsın.',
  'Telefonu bırak lütfen 🥺',
  'Hâlâ telefonda! Şimdi odaklanma zamanı.',
  'Telefonu bırak!',
]

type Props = {
  timer: Timer
  camera: Camera
  level: AlertLevel
  detectorState: DetectorState
  boxes: Box[]
  detectOn: boolean
  setDetectOn: (v: boolean) => void
  simulate: boolean
  setSimulate: (v: boolean) => void
  muted: boolean
  setMuted: (v: boolean) => void
}

function statusText(p: Props): string {
  if (!p.detectOn) return 'Telefon tespiti kapalı.'
  if (p.camera.state !== 'on') return 'Telefon tespiti için kamera gerekli.'
  if (p.detectorState === 'loading') return 'Telefon tespiti yükleniyor…'
  if (p.detectorState === 'error') return 'Tespit modeli yüklenemedi. İnternet bağlantını kontrol et.'
  return 'Telefon tespiti hazır.'
}

export default function Work(props: Props) {
  const { timer, camera, level, boxes, detectOn, setDetectOn, simulate, setSimulate, muted, setMuted } = props
  const paused = timer.status === 'paused'
  const progress = timer.totalMs ? 1 - timer.remainingMs / timer.totalMs : 0
  return (
    <section className="screen on">
      <div className="stage">
        <div className="glass timer">
          <Berry progress={progress} />
          <div className="num clock">{fmt(timer.remainingMs)}</div>
          <p className="label">{paused ? 'Duraklatıldı.' : 'Odak zamanı. Çilek doldukça oturum biter.'}</p>
          <div className="row">
            <button className="btn soft" onClick={paused ? timer.resume : timer.pause}>{paused ? 'Devam et' : 'Duraklat'}</button>
            <button className="btn" onClick={timer.finishNow}>Oturumu bitir</button>
          </div>
        </div>
        <div className="side">
          <CameraPanel camera={camera} boxes={boxes} />
          <div className="glass bubble">
            <svg viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="34" r="22" fill="#fff" stroke="#8C6574" strokeWidth="3" />
              <circle cx="22" cy="32" r="3" fill="#8C6574" /><circle cx="38" cy="32" r="3" fill="#8C6574" />
              <circle cx="17" cy="39" r="4" fill="#FFC6D3" /><circle cx="43" cy="39" r="4" fill="#FFC6D3" />
            </svg>
            <span>{MESSAGES[level]}</span>
          </div>
          <div className="tools">
            <button className="chip" aria-pressed={detectOn} onClick={() => setDetectOn(!detectOn)}>Telefon tespiti</button>
            <button className="chip" aria-pressed={muted} onClick={() => setMuted(!muted)}>Sessiz</button>
            <button className="chip" aria-pressed={simulate} onClick={() => setSimulate(!simulate)}>
              {simulate ? 'Denemeyi durdur' : 'Uyarıyı dene'}
            </button>
          </div>
          <p className="status">{statusText(props)}</p>
        </div>
      </div>
    </section>
  )
}
