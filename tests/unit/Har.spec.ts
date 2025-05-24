import { test } from '@japa/runner'
import { Har, IHarTiming } from '../../src/index.js'

test.group('timing()', () => {
  test('has blocked property', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.typeOf(result.blocked, 'number')
  })

  test('has connect property', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.typeOf(result.connect, 'number')
  })

  test('has receive property', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.typeOf(result.receive, 'number')
  })

  test('has send property', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.typeOf(result.send, 'number')
  })

  test('has wait property', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.typeOf(result.wait, 'number')
  })

  test('has dns property', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.typeOf(result.dns, 'number')
  })

  test('has no ssl property by default', ({ assert }) => {
    const har = new Har()
    const result = har.timing()
    assert.isUndefined(result.ssl)
  })

  test('adds ssl property', ({ assert }) => {
    const har = new Har()
    const result = har.timing({ ssl: true })
    assert.typeOf(result.ssl, 'number')
  })

  test('timing values are within expected range', ({ assert }) => {
    const har = new Har()
    const result = har.timing({ ssl: true })
    const keys: (keyof IHarTiming)[] = ['blocked', 'connect', 'receive', 'send', 'wait', 'dns', 'ssl']
    for (const key of keys) {
      if (result[key] !== undefined) {
        assert.isAtLeast(result[key], 0)
        assert.isAtMost(result[key], 100)
      }
    }
  })
})

test.group('version()', () => {
  test('returns HAR version', ({ assert }) => {
    const har = new Har()
    const result = har.version()
    assert.equal(result, '1.2')
  })
})

test.group('creator()', () => {
  test('returns creator info', ({ assert }) => {
    const har = new Har()
    const result = har.creator()
    assert.typeOf(result, 'object', 'returns an object')
    assert.typeOf(result.name, 'string', 'name is set')
    assert.typeOf(result.version, 'string', 'version is set')
    assert.typeOf(result.comment, 'string', 'comment is set')
  })

  test('creator info fields are not empty', ({ assert }) => {
    const har = new Har()
    const result = har.creator()
    assert.isAbove(result.name.length, 0)
    assert.isAbove(result.version.length, 0)
    assert.isAbove(result.comment!.length, 0)
  })
})

test.group('browser()', () => {
  test('returns browser info', ({ assert }) => {
    const har = new Har()
    const result = har.browser()
    assert.typeOf(result, 'object', 'returns an object')
    assert.typeOf(result.name, 'string', 'name is set')
    assert.typeOf(result.version, 'string', 'version is set')
    assert.typeOf(result.comment, 'string', 'comment is set')
  })

  test('browser info fields are not empty', ({ assert }) => {
    const har = new Har()
    const result = har.browser()
    assert.isAbove(result.name.length, 0)
    assert.isAbove(result.version.length, 0)
    assert.isAbove(result.comment!.length, 0)
  })
})

test.group('seed()', () => {
  test('seed can be changed after construction', ({ assert }) => {
    const har = new Har({ seed: 1 })
    const t1 = har.timing({ ssl: true })
    har.seed(2)
    const t2 = har.timing({ ssl: true })
    assert.notDeepEqual(t1, t2)
  })
})

test.group('locale()', () => {
  test('locale does not throw', ({ assert }) => {
    const har = new Har()
    // @ts-expect-error Testing invalid argument
    assert.doesNotThrow(() => har.locale('en'))
  })
})
