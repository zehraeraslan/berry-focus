import { useCallback, useEffect, useRef } from 'react'

/**
 * Çalışma sırasında her saniye için bir işaret kaydeder (f/p/u).
 * Süre, geçen gerçek zamandan hesaplanır; böylece interval yavaşlasa bile saniyeler atlanmaz.
 * Duraklatılan süre kaydedilmez.
 */
export function useSessionRecorder(running: boolean, phone: boolean, tracking: boolean) {
  const marks = useRef<string[]>([])
  const accMs = useRef(0)
  const live = useRef({ phone, tracking })
  live.current = { phone, tracking }

  useEffect(() => {
    if (!running) return
    let last = Date.now()
    const tick = () => {
      const now = Date.now()
      accMs.current += now - last
      last = now
      const mark = !live.current.tracking ? 'u' : live.current.phone ? 'p' : 'f'
      while (marks.current.length < Math.floor(accMs.current / 1000)) marks.current.push(mark)
    }
    const id = setInterval(tick, 500)
    return () => {
      tick() // duraklatma/bitişte son parçayı da ekle
      clearInterval(id)
    }
  }, [running])

  const reset = useCallback(() => {
    marks.current = []
    accMs.current = 0
  }, [])
  const read = useCallback(() => marks.current.join(''), [])
  return { reset, read }
}
