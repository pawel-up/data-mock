import { test } from '@japa/runner'
import Http from '../../../src/lib/Http.js'

test.group('#payloadOperations', () => {
  test('returns an array of strings', ({ assert }) => {
    const http = new Http()
    const { payloadOperations } = http.request
    assert.typeOf(payloadOperations, 'array')
    assert.typeOf(payloadOperations[0], 'string')
  })
})

test.group('#nonPayloadOperations', () => {
  test('returns an array of strings', ({ assert }) => {
    const http = new Http()
    const { nonPayloadOperations } = http.request
    assert.typeOf(nonPayloadOperations, 'array')
    assert.typeOf(nonPayloadOperations[0], 'string')
  })
})

test.group('request()', () => {
  test('has the url', ({ assert }) => {
    const http = new Http()
    const result = http.request.request()
    assert.typeOf(result.url, 'string')
  })

  test('has the method', ({ assert }) => {
    const http = new Http()
    const result = http.request.request()
    assert.typeOf(result.method, 'string')
  })

  test('has the headers', ({ assert }) => {
    const http = new Http()
    const result = http.request.request()
    assert.typeOf(result.headers, 'string')
  })

  test('forces the payload', ({ assert }) => {
    const http = new Http()
    for (let i = 0; i < 100; i++) {
      const result = http.request.request({ payload: { force: true } })
      assert.typeOf(result.payload, 'string')
    }
  })

  test('never generates the payload', ({ assert }) => {
    const http = new Http()
    for (let i = 0; i < 100; i++) {
      const result = http.request.request({ payload: { noPayload: true } })
      assert.isUndefined(result.payload)
    }
  })

  test('adds content type with payload', ({ assert }) => {
    const http = new Http()
    for (let i = 0; i < 50; i++) {
      const result = http.request.request({ payload: { force: true } })
      assert.include(result.headers, 'content-type')
    }
  })
})

test.group('get()', () => {
  test('always returns "GET"', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.get().method)
    const compare = new Array(20).fill('GET')
    assert.deepEqual(result, compare)
  })

  test('never have payload', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.get().payload)
    const compare = new Array(20).fill(undefined)
    assert.deepEqual(result, compare)
  })
})

test.group('post()', () => {
  test('always returns "POST"', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.post().method)
    const compare = new Array(20).fill('POST')
    assert.deepEqual(result, compare)
  })

  test('always have payload', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.post().payload)
    const invalid = result.some((i) => typeof i !== 'string' || !i)
    assert.isFalse(invalid)
  })
})

test.group('put()', () => {
  test('always returns "PUT"', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.put().method)
    const compare = new Array(20).fill('PUT')
    assert.deepEqual(result, compare)
  })

  test('always have payload', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.put().payload)
    const invalid = result.some((i) => typeof i !== 'string' || !i)
    assert.isFalse(invalid)
  })
})

test.group('delete()', () => {
  test('always returns "DELETE"', ({ assert }) => {
    const http = new Http()
    const result = new Array(20).fill(0).map(() => http.request.delete().method)
    const compare = new Array(20).fill('DELETE')
    assert.deepEqual(result, compare)
  })
})

test.group('method()', () => {
  test('returns a string', ({ assert }) => {
    const http = new Http()
    const result = http.request.method()
    assert.typeOf(result, 'string')
  })

  test('returns passed operation', ({ assert }) => {
    const http = new Http()
    const result = http.request.method({ operation: 'Xterm' })
    assert.equal(result, 'Xterm')
  })

  test('returns one of the passed pool', ({ assert }) => {
    const http = new Http()
    const result = http.request.method({ pool: ['Xterm'] })
    assert.equal(result, 'Xterm')
  })

  test('returns payload only operation', ({ assert }) => {
    const http = new Http()
    const result = http.request.method({ withPayload: true })
    assert.include(http.request.payloadOperations, result)
  })

  test('returns non-payload only operation', ({ assert }) => {
    const http = new Http()
    const result = http.request.method({ withPayload: false })
    assert.include(http.request.nonPayloadOperations, result)
  })

  test('returns any operation', ({ assert }) => {
    const http = new Http()
    const result = http.request.method()
    assert.include(http.request.nonPayloadOperations.concat(http.request.payloadOperations), result)
  })
})
