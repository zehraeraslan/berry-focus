import { describe, expect, it } from 'vitest'
import { averageEfficiency, lastDays, sessionStats, streak, timeline, tip } from './stats'
import type { Session } from './storage'

const SAMPLE = 'f'.repeat(60) + 'p'.repeat(10) + 'f'.repeat(20) + 'pp' + 'f'.repeat(8) + 'u'.repeat(10)

/** Öğlen saatine sabitlenir: gün sınırı ve saat dilimi kaymalarından etkilenmez. */
const daysAgo = (n: number) => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d.getTime()
}
const session = (n: number, samples = 'f'.repeat(120)): Session => ({ id: String(n), startedAt: daysAgo(n), plannedMin: 5, samples })

describe('sessionStats', () => {
  const st = sessionStats(SAMPLE)
  it('saniyeleri doğru sayar', () => {
    expect(st).toMatchObject({ total: 110, f: 88, p: 12, u: 10, tracked: 100 })
  })
  it('verimliliği takip edilen süreden hesaplar', () => {
    expect(st.efficiency).toBe(88)
  })
  it('en uzun kesintisiz odağı bulur', () => {
    expect(st.longest).toBe(60)
  })
  it('3 saniyeden kısa telefonu uyarı saymaz', () => {
    expect(st.episodes).toBe(1)
  })
  it('hiç takip yoksa verimlilik null döner', () => {
    expect(sessionStats('u'.repeat(30)).efficiency).toBeNull()
  })
})

describe('timeline', () => {
  it('en fazla 48 parça üretir', () => {
    expect(timeline(SAMPLE)).toHaveLength(48)
    expect(timeline('fp')).toHaveLength(2)
    expect(timeline('')).toEqual([])
  })
  it('telefonlu parçayı işaretler', () => {
    expect(timeline('f'.repeat(10) + 'p'.repeat(10), 2)).toEqual(['f', 'p'])
  })
})

describe('tip', () => {
  it('telefon hiç yoksa bunu söyler', () => {
    expect(tip('f'.repeat(100))).toContain('Hiç telefon')
  })
  it('telefon başta yoğunsa ona göre öneri verir', () => {
    expect(tip('pppp' + 'f'.repeat(100))).toContain('Başta')
  })
  it('telefon sonda yoğunsa ona göre öneri verir', () => {
    expect(tip(SAMPLE)).toContain('ikinci yarısında')
  })
  it('çok kısa oturumda dürüstçe söyler', () => {
    expect(tip('f'.repeat(20))).toContain('çok kısaydı')
  })
})

describe('streak', () => {
  it('üst üste günleri sayar', () => {
    expect(streak([session(0), session(1), session(2)])).toBe(3)
  })
  it('bugün çalışılmadıysa dünden sayar', () => {
    expect(streak([session(1), session(2)])).toBe(2)
  })
  it('boşluk seriyi bozar', () => {
    expect(streak([session(0), session(2)])).toBe(1)
    expect(streak([session(3)])).toBe(0)
  })
  it('1 dakikadan az odağı saymaz', () => {
    expect(streak([session(0, 'f'.repeat(30))])).toBe(0)
  })
})

describe('lastDays / averageEfficiency', () => {
  it('bugünün odak süresini toplar', () => {
    const days = lastDays([session(0), session(0)])
    expect(days).toHaveLength(7)
    expect(days[6].focused).toBe(240)
    expect(days[5].focused).toBe(0)
  })
  it('ortalama verimliliği oturumları birleştirerek hesaplar', () => {
    expect(averageEfficiency([session(0, 'f'.repeat(50) + 'p'.repeat(50))])).toBe(50)
    expect(averageEfficiency([])).toBeNull()
  })
})
