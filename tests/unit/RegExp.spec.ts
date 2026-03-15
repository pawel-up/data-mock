import { test } from '@japa/runner'
import { RegExp as DataMockRegExp } from '../../src/lib/RegExp.js'

test.group('RegExp.fromPattern()', () => {
  test('generates string matching simple pattern', ({ assert }) => {
    const rx = new DataMockRegExp()
    const result = rx.fromPattern(/^[a-z]{5}$/)
    assert.match(result, /^[a-z]{5}$/)
  })

  test('generates different strings without seed', ({ assert }) => {
    const rx = new DataMockRegExp()
    const result1 = rx.fromPattern(/^[a-z]{10}$/)
    const result2 = rx.fromPattern(/^[a-z]{10}$/)
    assert.notEqual(result1, result2)
  })

  test('respects max options', ({ assert }) => {
    const rx = new DataMockRegExp()
    // It should generate something between 1 and 3 characters as max is 3
    const result = rx.fromPattern(/^[a-z]+$/, { max: 3 })
    assert.isAtMost(result.length, 3)
    assert.isAtLeast(result.length, 1)
  })

  test('matches string patterns', ({ assert }) => {
    const rx = new DataMockRegExp()
    const result = rx.fromPattern('^\\d{5}$')
    assert.match(result, /^\d{5}$/)
  })
})
