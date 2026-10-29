import { describe, expect, it } from 'vitest'
import { isClear, levelFor, smooth } from './alertLevel'

describe('levelFor', () => {
  it('eşik saniyelerinde seviye değiştirir', () => {
    expect(levelFor(0)).toBe(0)
    expect(levelFor(2.9)).toBe(0)
    expect(levelFor(3)).toBe(1)
    expect(levelFor(7.9)).toBe(1)
    expect(levelFor(8)).toBe(2)
    expect(levelFor(14.9)).toBe(2)
    expect(levelFor(15)).toBe(3)
    expect(levelFor(120)).toBe(3)
  })
})

describe('smooth', () => {
  it('tek karelik tespiti yok sayar', () => {
    expect(smooth([true, ...Array(9).fill(false)])).toBe(false)
  })
  it('10 örneğin 6\'sında telefon varsa ihlal sayar', () => {
    expect(smooth([...Array(6).fill(true), ...Array(4).fill(false)])).toBe(true)
  })
  it('kısa süreli kaçırmayı tolere eder', () => {
    expect(smooth([true, true, true, true, true, true, true, false, true, true])).toBe(true)
  })
  it('yalnızca son `size` örneğe bakar', () => {
    expect(smooth([...Array(20).fill(true), ...Array(10).fill(false)])).toBe(false)
  })
})

describe('isClear', () => {
  it('son 4 örnek boşsa telefon gitmiş sayılır', () => {
    expect(isClear([true, true, false, false, false, false])).toBe(true)
  })
  it('yeterli örnek yoksa ya da telefon varsa temiz sayılmaz', () => {
    expect(isClear([false, false])).toBe(false)
    expect(isClear([false, false, false, true])).toBe(false)
  })
})
