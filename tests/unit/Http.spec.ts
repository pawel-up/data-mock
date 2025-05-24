import { test } from '@japa/runner'
import Http from '../../src/lib/Http.js'
import { DataMockLocale } from '../../locales/Types.js'
import sinon from 'sinon'

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

test.group('Http.seed()', () => {
  test('calls seed on all child generators', ({ assert }) => {
    const http = new Http()
    const seedValue = 12345

    const headersSpy = sinon.spy(http.headers, 'seed')
    const payloadSpy = sinon.spy(http.payload, 'seed')
    const responseSpy = sinon.spy(http.response, 'seed')
    const formDataSpy = sinon.spy(http.formData, 'seed')
    const requestSpy = sinon.spy(http.request, 'seed')

    http.seed(seedValue)

    assert.isTrue(headersSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(payloadSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(responseSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(formDataSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(requestSpy.calledOnceWithExactly(seedValue))

    headersSpy.restore()
    payloadSpy.restore()
    responseSpy.restore()
    formDataSpy.restore()
    requestSpy.restore()
  })

  test('calls seed on all child generators with undefined', ({ assert }) => {
    const http = new Http()

    const spies = [
      sinon.spy(http.headers, 'seed'),
      sinon.spy(http.payload, 'seed'),
      sinon.spy(http.response, 'seed'),
      sinon.spy(http.formData, 'seed'),
      sinon.spy(http.request, 'seed'),
    ]

    http.seed() // Call with no arguments
    spies.forEach((spy) => assert.isTrue(spy.calledOnceWithExactly(undefined)))
    spies.forEach((spy) => spy.restore())
  })
})

test.group('Http.locale()', () => {
  test('calls locale on all child generators with a locale object', ({ assert }) => {
    const http = new Http()
    const mockLocale: DataMockLocale = { title: 'test-locale' }

    const headersSpy = sinon.spy(http.headers, 'locale')
    const payloadSpy = sinon.spy(http.payload, 'locale')
    const responseSpy = sinon.spy(http.response, 'locale')
    // formData does not have a locale method, so we don't spy on it.
    const requestSpy = sinon.spy(http.request, 'locale')

    http.locale(mockLocale)

    assert.isTrue(headersSpy.calledOnceWithExactly(mockLocale))
    assert.isTrue(payloadSpy.calledOnceWithExactly(mockLocale))
    assert.isTrue(responseSpy.calledOnceWithExactly(mockLocale))
    assert.isTrue(requestSpy.calledOnceWithExactly(mockLocale))

    headersSpy.restore()
    payloadSpy.restore()
    responseSpy.restore()
    requestSpy.restore()
  })

  test('calls locale on all child generators with undefined', ({ assert }) => {
    const http = new Http()

    const spies = [
      sinon.spy(http.headers, 'locale'),
      sinon.spy(http.payload, 'locale'),
      sinon.spy(http.response, 'locale'),
      sinon.spy(http.request, 'locale'),
    ]

    http.locale() // Call with no arguments

    spies.forEach((spy) => {
      assert.isTrue(spy.calledOnceWithExactly(undefined))
      spy.restore()
    })
  })
})
