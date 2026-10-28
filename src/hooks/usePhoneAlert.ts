import { useEffect, useRef, useState } from 'react'
import { levelFor, type AlertLevel } from '../lib/alertLevel'
import { beep, speak } from '../lib/sound'

/** Telefonun kesintisiz görüldüğü süreye göre uyarı seviyesini üretir ve sesleri çalar. */
export function usePhoneAlert(phone: boolean): AlertLevel {
  const [level, setLevel] = useState<AlertLevel>(0)
  const since = useRef(0)

  useEffect(() => {
    if (!phone) {
      setLevel(0)
      return
    }
    since.current = Date.now()
    const id = setInterval(() => setLevel(levelFor((Date.now() - since.current) / 1000)), 300)
    return () => clearInterval(id)
  }, [phone])

  useEffect(() => {
    if (level === 0) return
    if (level === 1) {
      beep(1)
      return
    }
    beep(level)
    const beepId = setInterval(() => beep(level), level === 2 ? 3000 : 1200)
    let speakId: ReturnType<typeof setInterval> | undefined
    if (level === 3) {
      speak('Telefonu bırak!')
      speakId = setInterval(() => speak('Telefonu bırak!'), 6000)
    }
    return () => {
      clearInterval(beepId)
      if (speakId) clearInterval(speakId)
      window.speechSynthesis?.cancel()
    }
  }, [level])

  return level
}
