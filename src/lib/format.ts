/** Milisaniyeyi "mm:ss" biçimine çevirir (120 dk'da "120:00"). */
export function fmt(ms: number): string {
  const s = Math.ceil(ms / 1000)
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}
