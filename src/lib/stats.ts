import type { Session } from './storage'

export type Mark = 'f' | 'p' | 'u'
export const RATINGS = { 1: '😵', 2: '😐', 3: '😊' } as const

export function sessionStats(samples: string) {
  let f = 0, p = 0, u = 0, longest = 0, run = 0, prun = 0, episodes = 0
  for (const c of samples) {
    if (c === 'f') { f++; run++; longest = Math.max(longest, run) } else run = 0
    if (c === 'p') { p++; prun++ }
    else { if (prun >= 3) episodes++; prun = 0 } // 3 sn'den uzun telefon = bir uyarı
    if (c === 'u') u++
  }
  if (prun >= 3) episodes++
  const tracked = f + p
  return { total: samples.length, f, p, u, tracked, longest, episodes, efficiency: tracked ? Math.round((f / tracked) * 100) : null }
}

/** Oturumu en çok `segments` parçaya böler; parçanın en az %25'inde telefon varsa "telefon" sayılır. */
export function timeline(samples: string, segments = 48): Mark[] {
  const n = Math.min(segments, samples.length)
  if (!n) return []
  const size = samples.length / n
  return Array.from({ length: n }, (_, i) => {
    const part = samples.slice(Math.floor(i * size), Math.max(Math.floor(i * size) + 1, Math.floor((i + 1) * size)))
    const p = [...part].filter((c) => c === 'p').length
    const u = [...part].filter((c) => c === 'u').length
    if (p >= Math.max(1, part.length * 0.25)) return 'p'
    return u > part.length / 2 ? 'u' : 'f'
  })
}

export function moodLine(efficiency: number | null): string {
  if (efficiency === null) return 'Bu oturumda tespit kapalıydı, süreni yine de kaydettim.'
  if (efficiency >= 90) return 'Bugün harikaydın! 🍓'
  if (efficiency >= 70) return 'Güzel bir çalışmaydı, biraz daha ve mükemmel olur.'
  return 'Zor bir gündü ama denedin. Yarın daha iyi olacak 🌱'
}

export function tip(samples: string): string {
  const s = sessionStats(samples)
  if (s.total < 60) return 'Oturum çok kısaydı. Gerçek bir değerlendirme için en az birkaç dakika çalışmayı dene.'
  if (s.tracked === 0) return 'Kamera ve telefon tespiti açıkken çalışırsan sana kişisel öneriler verebilirim.'
  if (s.p === 0) return 'Hiç telefon almadın. Aynı düzeni sonraki oturumda da koru.'
  let late = 0
  const half = samples.length / 2
  for (let i = 0; i < samples.length; i++) if (samples[i] === 'p' && i >= half) late++
  const share = late / s.p
  if (share >= 0.65) return 'Telefon seni oturumun ikinci yarısında çağırmış. 25-30 dakikalık bloklar ve kısa molalar dene.'
  if (share <= 0.35) return 'Başta zorlanıp sonra toparlanmışsın. Oturumdan önce telefonu başka odaya bırakmayı dene.'
  return 'Telefon oturum boyunca seni dağıtmış. Telefonu görüş alanından tamamen uzaklaştırmayı dene.'
}

export function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Son `n` günün odaklı süresi (saniye). */
export function lastDays(sessions: Session[], n = 7) {
  return Array.from({ length: n }, (_, k) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - k))
    const key = dayKey(d.getTime())
    const day = sessions.filter((s) => dayKey(s.startedAt) === key)
    return {
      key,
      label: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
      focused: day.reduce((a, s) => a + sessionStats(s.samples).f, 0),
      count: day.length,
    }
  })
}

/** Üst üste kaç gün en az 1 dakika odaklanılmış (bugün henüz çalışılmadıysa dünden sayar). */
export function streak(sessions: Session[]): number {
  const focusedDays = new Set(sessions.filter((s) => sessionStats(s.samples).f >= 60).map((s) => dayKey(s.startedAt)))
  const d = new Date()
  if (!focusedDays.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1)
  let count = 0
  while (focusedDays.has(dayKey(d.getTime()))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

export function averageEfficiency(sessions: Session[]): number | null {
  let f = 0, tracked = 0
  for (const s of sessions) {
    const st = sessionStats(s.samples)
    f += st.f
    tracked += st.tracked
  }
  return tracked ? Math.round((f / tracked) * 100) : null
}
