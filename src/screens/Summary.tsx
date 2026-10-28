import { useEffect, useState } from 'react'

const SEG = Array.from({ length: 48 }, (_, i) => (i === 12 || i === 13 ? 'a' : i >= 30 && i % 4 === 1 ? 'p' : ''))

export default function Summary({ elapsedMs, onAgain }: { elapsedMs: number; onAgain: () => void }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 60)
    return () => clearTimeout(id)
  }, [])
  const mins = Math.max(1, Math.round(elapsedMs / 60_000))

  return (
    <section className="screen on">
      <div className="sum">
        <div className="glass score">
          <svg className="ring" viewBox="0 0 120 120" role="img" aria-label="Verimlilik yüzdesi">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--track)" strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E8466C" strokeWidth="12" strokeLinecap="round"
              strokeDasharray="314" strokeDashoffset={on ? 314 * 0.13 : 314} transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
            <text x="60" y="68" textAnchor="middle" fontFamily="Fredoka" fontSize="28" fontWeight="600" fill="var(--ink)">%87</text>
          </svg>
          <h2>Verimlilik</h2>
          <p className="label" style={{ marginBottom: 0 }}>Odaklı süre ÷ toplam süre</p>
        </div>
        <div className="stats">
          <div className="glass stat"><div className="num">{mins} dk</div><span>Toplam oturum</span></div>
          <div className="glass stat"><div className="num">%87</div><span>Odaklı geçen süre</span></div>
          <div className="glass stat"><div className="num">3</div><span>Telefon uyarısı</span></div>
          <div className="glass stat"><div className="num">22 dk</div><span>En uzun kesintisiz odak</span></div>
          <div className="glass stat wide">
            <h2 style={{ fontSize: '1.2rem' }}>Oturumun nasıl geçti</h2>
            <div className="tl" role="img" aria-label="Oturum zaman çizelgesi">
              {SEG.map((c, i) => <i key={i} className={c} />)}
            </div>
            <div className="legend">
              <span><b style={{ background: 'var(--berry)' }} />Odaklı</span>
              <span><b style={{ background: 'var(--mauve)' }} />Telefon</span>
              <span><b style={{ background: 'var(--track)' }} />Kadrajda yok</span>
            </div>
          </div>
          <div className="glass stat wide">
            <strong>Berry’nin önerisi:</strong> Bir sonraki oturumda 35 dakikalık bloklar ve 5 dakikalık molalar dene.
            <p className="note">Süre gerçek, diğer sayılar örnektir. Telefon tespiti bağlanınca gerçek verilerle dolacak.</p>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 22 }}><button className="btn" onClick={onAgain}>Yeni oturum</button></div>
    </section>
  )
}
