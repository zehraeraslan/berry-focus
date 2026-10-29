import { fmtDur } from '../lib/format'
import { RATINGS, averageEfficiency, lastDays, sessionStats, streak } from '../lib/stats'
import type { Session } from '../lib/storage'

type Props = { sessions: Session[]; onClear: () => void; onNew: () => void }

export default function History({ sessions, onClear, onNew }: Props) {
  const days = lastDays(sessions)
  const max = Math.max(...days.map((d) => d.focused))
  const today = days[days.length - 1]
  const avg = averageEfficiency(sessions)
  const recent = [...sessions].reverse().slice(0, 8)

  return (
    <section className="screen on">
      <h1 style={{ fontSize: '2rem', marginTop: 22 }}>Geçmişim</h1>
      {sessions.length === 0 ? (
        <div className="glass stat" style={{ marginTop: 16 }}>
          <strong>Henüz oturum yok.</strong>
          <p className="note">İlk oturumunu tamamladığında gün gün odak süren burada görünecek.</p>
        </div>
      ) : (
        <>
          <div className="stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 16 }}>
            <div className="glass stat"><div className="num">{fmtDur(today.focused)}</div><span>Bugünkü odak</span></div>
            <div className="glass stat"><div className="num">{streak(sessions)} gün</div><span>Seri</span></div>
            <div className="glass stat"><div className="num">{avg === null ? '—' : `%${avg}`}</div><span>Ortalama verimlilik</span></div>
          </div>
          <div className="glass stat" style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: '1.2rem' }}>Son 7 gün (odaklı dakika)</h2>
            <div className="bars" role="img" aria-label="Son 7 günün odaklı süre grafiği">
              {days.map((d) => (
                <div className="col" key={d.key}>
                  <small>{Math.round(d.focused / 60)}</small>
                  <i style={{ height: max ? Math.max(4, Math.round((d.focused / max) * 100)) : 4 }} />
                  <small>{d.label}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="glass stat" style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: '1.2rem' }}>Son oturumlar</h2>
            {recent.map((s) => {
              const st = sessionStats(s.samples)
              return (
                <div className="srow" key={s.id}>
                  <span>{new Date(s.startedAt).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{fmtDur(st.total)} · {st.efficiency === null ? '—' : `%${st.efficiency}`} {s.rating ? RATINGS[s.rating] : ''}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
      <div className="row" style={{ marginTop: 22 }}>
        <button className="btn" onClick={onNew}>Yeni oturum</button>
        {sessions.length > 0 && (
          <button className="btn soft" onClick={() => window.confirm('Tüm oturum geçmişi silinsin mi? Bu işlem geri alınamaz.') && onClear()}>
            Geçmişi temizle
          </button>
        )}
      </div>
    </section>
  )
}
