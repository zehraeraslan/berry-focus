import { describe, expect, it } from 'vitest'
import { fmt, fmtDur } from './format'

describe('fmt', () => {
  it('mm:ss biçimler', () => {
    expect(fmt(50 * 60_000)).toBe('50:00')
    expect(fmt(61_000)).toBe('01:01')
    expect(fmt(0)).toBe('00:00')
  })
  it('kalan kesirli saniyeyi yukarı yuvarlar', () => {
    expect(fmt(1)).toBe('00:01')
  })
  it('100 dakikayı aşan süreleri taşırmaz', () => {
    expect(fmt(120 * 60_000)).toBe('120:00')
  })
})

describe('fmtDur', () => {
  it('süreyi okunur yazar', () => {
    expect(fmtDur(42)).toBe('42 sn')
    expect(fmtDur(125)).toBe('2 dk 5 sn')
    expect(fmtDur(3000)).toBe('50 dk')
  })
})
