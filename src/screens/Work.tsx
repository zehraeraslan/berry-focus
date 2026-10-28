import Berry from '../components/Berry'
import CameraPanel from '../components/CameraPanel'
import { fmt } from '../lib/format'
import type { Camera } from '../hooks/useCamera'
import type { Timer } from '../hooks/useTimer'

export default function Work({ timer, camera }: { timer: Timer; camera: Camera }) {
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
          <CameraPanel camera={camera} />
          <div className="glass bubble">
            <svg viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="34" r="22" fill="#fff" stroke="#8C6574" strokeWidth="3" />
              <circle cx="22" cy="32" r="3" fill="#8C6574" /><circle cx="38" cy="32" r="3" fill="#8C6574" />
              <circle cx="17" cy="39" r="4" fill="#FFC6D3" /><circle cx="43" cy="39" r="4" fill="#FFC6D3" />
            </svg>
            <span>Harika gidiyorsun! Telefon masada kalsın.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
