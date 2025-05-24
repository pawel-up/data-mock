import { test } from '@japa/runner'
import { Random } from '../../src/lib/Random.js'

test.group('Random.pick()', () => {
  test('respects the pool argument', ({ assert }) => {
    const random = new Random()
    const result = random.pick(['a', 'b'])
    assert.typeOf(result, 'array')
    result.forEach((v) => assert.include(['a', 'b'], v))
  })

  test('respects the count argument', ({ assert }) => {
    const random = new Random()
    const result = random.pick(['a', 'b', 'c', 'd'], 3)
    assert.lengthOf(result, 3)
  })

  test('adjusts the count to the array size', ({ assert }) => {
    const random = new Random()
    const result = random.pick(['a', 'b'], 10)
    assert.lengthOf(result, 2)
  })

  test('adjusts the count when below 0', ({ assert }) => {
    const random = new Random()
    const result = random.pick(['a', 'b'], -5)
    assert.lengthOf(result, 0)
  })
})

test.group('Random.pickOne()', () => {
  test('returns one of the passed values', ({ assert }) => {
    const random = new Random()
    const result = random.pickOne(['x', 'y', 'z'])
    assert.include(['x', 'y', 'z'], result)
  })
})
