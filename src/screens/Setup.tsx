import { useEffect, useState } from 'react'
import Mascot from '../components/Mascot'

const PRESETS = [15, 25, 45, 50, 90, 120]
const clamp = (v: number) => Math.min(300, Math.max(1, Math.round(v)))

type Props = { minutes: number; setMinutes: (m: number) => void; onStart: () => void }

export default function Setup({ minutes, setMinutes, onStart }: Props) {
  const [draft, setDraft] = useState(String(minutes))
  useEffect(() => setDraft(String(minutes)), [minutes])
  const custom = !PRESETS.includes(minutes)

  return (
    <section className="screen on">
      <div className="hero">
        <div className="glass">
          <h1>Birlikte çalışalım, telefonu bir kenara koy.</h1>
          <p className="lead">
            Süreni seç, kamerayı aç, odaklan. Telefonu eline alırsan Berry seni nazikçe uyarır. Oturum bitince verimlilik
            yüzdeni görürsün.
          </p>
          <div className="chips" role="group" aria-label="Çalışma süresi">
            {PRESETS.map((m) => (
              <button key={m} className="chip" aria-pressed={minutes === m} onClick={() => setMinutes(m)}>
                {m} dk
              </button>
            ))}
            <span className={'custom' + (custom ? ' on' : '')}>
              <button type="button" aria-label="Süreyi 5 dakika azalt" onClick={() => setMinutes(clamp(minutes - 5))}>−</button>
              <input
                type="number" min={1} max={300} value={draft} aria-label="Özel süre, dakika"
                onChange={(e) => {
                  setDraft(e.target.value)
                  const n = parseInt(e.target.value, 10)
                  if (!Number.isNaN(n)) setMinutes(clamp(n))
                }}
                onBlur={() => setDraft(String(minutes))}
              />
              <span>dk</span>
              <button type="button" aria-label="Süreyi 5 dakika artır" onClick={() => setMinutes(clamp(minutes + 5))}>+</button>
            </span>
          </div>
          <button className="btn" onClick={onStart}>Çalışmaya başla</button>
          <p className="privacy">Kamera görüntüsü cihazından çıkmaz ve kaydedilmez.</p>
        </div>
        <div className="glass" style={{ display: 'grid', placeItems: 'center', padding: 20 }}>
          <Mascot />
        </div>
      </div>
    </section>
  )
}
