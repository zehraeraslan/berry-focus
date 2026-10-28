import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done'

/**
 * Zaman damgası tabanlı sayaç. Kalan süre her zaman "bitiş anı - şimdi" ile
 * hesaplanır; sekme arka plana geçip tarayıcı interval'i yavaşlatsa bile sapma olmaz.
 */
export function useTimer() {
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [totalMs, setTotalMs] = useState(0)
  const [remainingMs, setRemainingMs] = useState(0)
  const endAt = useRef(0)
  const pausedLeft = useRef(0)

  useEffect(() => {
    if (status !== 'running') return
    const tick = () => {
      const left = Math.max(0, endAt.current - Date.now())
      setRemainingMs(left)
      if (left === 0) setStatus('done')
    }
    tick()
    const id = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick) // sekmeye dönünce anında düzelt
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [status])

  const start = useCallback((minutes: number) => {
    const ms = minutes * 60_000
    setTotalMs(ms)
    setRemainingMs(ms)
    endAt.current = Date.now() + ms
    setStatus('running')
  }, [])

  const pause = useCallback(() => {
    pausedLeft.current = Math.max(0, endAt.current - Date.now())
    setRemainingMs(pausedLeft.current)
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    endAt.current = Date.now() + pausedLeft.current
    setStatus('running')
  }, [])

  /** Süre dolmadan oturumu bitirir; o ana kadarki kalan süreyi korur. */
  const finishNow = useCallback(() => {
    setRemainingMs((prev) => (status === 'running' ? Math.max(0, endAt.current - Date.now()) : prev))
    setStatus('done')
  }, [status])

  const reset = useCallback(() => {
    setStatus('idle')
    setRemainingMs(0)
    setTotalMs(0)
  }, [])

  return { status, totalMs, remainingMs, elapsedMs: totalMs - remainingMs, start, pause, resume, finishNow, reset }
}

export type Timer = ReturnType<typeof useTimer>
