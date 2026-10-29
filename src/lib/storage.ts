/**
 * Bir oturum: `samples` her çalışma saniyesi için bir karakter tutar.
 *   f = odaklı, p = telefon görüldü, u = takip dışı (kamera/tespit kapalı)
 */
export type Session = {
  id: string
  startedAt: number
  plannedMin: number
  samples: string
  rating?: 1 | 2 | 3
}

const KEY = 'berry-focus:sessions:v1'

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Session[]) : []
  } catch {
    return []
  }
}

export function saveSessions(list: Session[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-300)))
  } catch {
    /* depolama dolu ya da kapalıysa uygulama yine çalışsın */
  }
}
