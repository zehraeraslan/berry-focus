export type AlertLevel = 0 | 1 | 2 | 3

/** Telefon kesintisiz kaç saniye görünürse hangi uyarı seviyesine geçilir. */
export const LEVEL_AT = { 1: 3, 2: 8, 3: 15 } as const

export function levelFor(seconds: number): AlertLevel {
  if (seconds >= LEVEL_AT[3]) return 3
  if (seconds >= LEVEL_AT[2]) return 2
  if (seconds >= LEVEL_AT[1]) return 1
  return 0
}

/**
 * Zamansal yumuşatma: son `size` örneğin en az `need` tanesinde telefon varsa "ihlal" sayılır.
 * Tek karelik yanlış tespitler (ya da tek karelik kaçırmalar) uyarıyı tetiklemez/kesmez.
 */
export function smooth(history: boolean[], size = 10, need = 6): boolean {
  return history.slice(-size).filter(Boolean).length >= need
}
