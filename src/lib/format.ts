/** Milisaniyeyi "mm:ss" biçimine çevirir (120 dk'da "120:00"). */
export function fmt(ms: number): string {
  const s = Math.ceil(ms / 1000)
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}

/** Saniyeyi okunur süreye çevirir: "42 sn", "7 dk 5 sn", "50 dk". */
export function fmtDur(sec: number): string {
  if (sec < 60) return `${sec} sn`
  if (sec < 600) return `${Math.floor(sec / 60)} dk ${sec % 60} sn`
  return `${Math.round(sec / 60)} dk`
}
