import { useEffect, useMemo, useState } from 'react'
import { fmtDur } from '../lib/format'
import { RATINGS, moodLine, sessionStats, timeline, tip } from '../lib/stats'
import type { Session } from '../lib/storage'

type Props = {
  session: Session
  saved: boolean
  onRate: (r: 1 | 2 | 3) => void
  onAgain: () => void
  onHistory: () => void
}

const LABELS = { 3: 'Odaklıydım', 2: 'Fena değil', 1: 'Dağınıktım' } as const

export default function Summary({ session, saved, onRate, onAgain, onHistory }: Props) {
  const st = useMemo(() => sessionStats(session.samples), [session.samples])
  const segs = useMemo(() => timeline(session.samples), [session.samples])
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 60)
    return () => clearTimeout(id)
  }, [])
  const pct = st.efficiency ?? 0

  return (
    <section className="screen on">
      <div className="sum">
        <div className="glass score">
          <svg className="ring" viewBox="0 0 120 120" role="img" aria-label={st.efficiency === null ? 'Verimlilik hesaplanamadı' : `Verimlilik yüzde ${pct}`}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--track)" strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E8466C" strokeWidth="12" strokeLinecap="round"
              strokeDasharray="314" strokeDashoffset={on ? 314 * (1 - pct / 100) : 314} transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
            <text x="60" y="68" textAnchor="middle" fontFamily="Fredoka" fontSize="28" fontWeight="600" fill="var(--ink)">
              {st.efficiency === null ? '—' : `%${pct}`}
            </text>
          </svg>
          <h2>Verimlilik</h2>
          <p className="label" style={{ marginBottom: 0 }}>{moodLine(st.efficiency)}</p>
        </div>
        <div className="stats">
          <div className="glass stat"><div className="num">{fmtDur(st.total)}</div><span>Toplam oturum</span></div>
          <div className="glass stat"><div className="num">{fmtDur(st.f)}</div><span>Odaklı geçen süre</span></div>
          <div className="glass stat"><div className="num">{st.episodes}</div><span>Telefon uyarısı</span></div>
          <div className="glass stat"><div className="num">{fmtDur(st.longest)}</div><span>En uzun kesintisiz odak</span></div>
          <div className="glass stat wide">
            <h2 style={{ fontSize: '1.2rem' }}>Oturumun nasıl geçti</h2>
            <div className="tl" role="img" aria-label="Oturum zaman çizelgesi">
              {segs.map((c, i) => <i key={i} className={c === 'p' ? 'p' : c === 'u' ? 'a' : ''} />)}
            </div>
            <div className="legend">
              <span><b style={{ background: 'var(--berry)' }} />Odaklı</span>
              <span><b style={{ background: 'var(--mauve)' }} />Telefon</span>
              <span><b style={{ background: 'var(--track)' }} />Takip dışı (kamera veya tespit kapalı)</span>
            </div>
          </div>
          <div className="glass stat wide"><strong>Berry’nin önerisi:</strong> {tip(session.samples)}</div>
          <div className="glass stat wide">
            {saved ? (
              <>
                <strong>Bu oturumu nasıl hissettin?</strong>
                <div className="chips" style={{ marginBottom: 0 }}>
                  {([3, 2, 1] as const).map((r) => (
                    <button key={r} className="chip" aria-pressed={session.rating === r} onClick={() => onRate(r)}>
                      {RATINGS[r]} {LABELS[r]}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <span className="note" style={{ margin: 0 }}>10 saniyeden kısa oturumlar geçmişe kaydedilmez.</span>
            )}
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 22 }}>
        <button className="btn" onClick={onAgain}>Yeni oturum</button>
        <button className="btn soft" onClick={onHistory}>Geçmişim</button>
      </div>
    </section>
  )
}
