import { test } from '@japa/runner'
import Http from '../../../src/lib/Http.js'

test.group('Http.response.response()', () => {
  test('has the status property by default', ({ assert }) => {
    const http = new Http()
    const result = http.response.response()
    assert.typeOf(result.status, 'number')
  })

  test('has the statusText property by default', ({ assert }) => {
    const http = new Http()
    const result = http.response.response()
    assert.typeOf(result.statusText, 'string')
  })

  test('has the headers property by default', ({ assert }) => {
    const http = new Http()
    const result = http.response.response()
    assert.typeOf(result.headers, 'string')
  })

  test('ignores the payload when in options', ({ assert }) => {
    const http = new Http()
    const result = http.response.response({ payload: { noPayload: true } })
    assert.isUndefined(result.payload)
  })

  test('has the payload when forced', ({ assert }) => {
    const http = new Http()
    const result = http.response.response({ payload: { force: true } })
    assert.ok(result.payload)
  })

  test('has the specific response group', ({ assert }) => {
    const http = new Http()
    let result = http.response.response({ statusGroup: 2 })
    assert.isAbove(result.status, 199)
    assert.isBelow(result.status, 300)
    result = http.response.response({ statusGroup: 3 })
    assert.isAbove(result.status, 299)
    assert.isBelow(result.status, 400)
  })
})

test.group('Http.response.redirectStatus()', () => {
  test('returns a valid status code', ({ assert }) => {
    const http = new Http()
    const result = http.response.redirectStatus()
    assert.typeOf(result.code, 'number', 'code is a number')
    assert.include(http.response.redirectCodes, result.code, 'code is a redirect code')
  })

  test('uses the passed code', ({ assert }) => {
    const http = new Http()
    const result = http.response.redirectStatus({ code: 999 })
    assert.equal(result.code, 999)
  })

  test('returns the status', ({ assert }) => {
    const http = new Http()
    const result = http.response.redirectStatus()
    assert.typeOf(result.status, 'string', 'status is a string')
  })

  test('returns the passed status', ({ assert }) => {
    const http = new Http()
    const result = http.response.redirectStatus({ status: 'test' })
    assert.equal(result.status, 'test')
  })
})
