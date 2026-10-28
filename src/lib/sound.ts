let ctx: AudioContext | null = null
let muted = false

/** Kullanıcı tıklamasında çağrılmalı: tarayıcılar sesi ancak etkileşimden sonra açar. */
export function unlockAudio() {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = ctx ?? new Ctor()
    void ctx.resume()
  } catch {
    /* ses desteklenmiyorsa sessizce devam et */
  }
}

export function setMuted(value: boolean) {
  muted = value
  if (value) window.speechSynthesis?.cancel()
}

export function beep(level: 1 | 2 | 3) {
  if (muted || !ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = level === 3 ? 'square' : 'sine'
  osc.frequency.setValueAtTime(level === 1 ? 660 : 880, now)
  if (level >= 2) osc.frequency.setValueAtTime(level === 3 ? 1100 : 1040, now + 0.15)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(level === 3 ? 0.35 : 0.2, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.4)
}

export function speak(text: string) {
  if (muted || !('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'tr-TR'
  u.rate = 1.05
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
