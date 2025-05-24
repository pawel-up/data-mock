import { test } from '@japa/runner'
import sinon from 'sinon'
import Http from '../../../src/lib/Http.js'

test.group('Http.payload.isPayload()', () => {
  test('Returns a boolean', ({ assert }) => {
    const http = new Http()
    const result = http.payload.isPayload()
    assert.typeOf(result, 'boolean')
  })

  test('Always returns false for noPayload', ({ assert }) => {
    const http = new Http()
    const result = http.payload.isPayload({ noPayload: true })
    assert.isFalse(result)
  })

  test('Always returns true for forcePayload', ({ assert }) => {
    const http = new Http()
    const result = http.payload.isPayload({ force: true })
    assert.isTrue(result)
  })
})

test.group('Http.payload.urlEncoded()', () => {
  test('returns a string', ({ assert }) => {
    const http = new Http()
    const result = http.payload.urlEncoded()
    assert.typeOf(result, 'string')
  })

  test('has at least one value', ({ assert }) => {
    const http = new Http()
    const result = http.payload.urlEncoded()
    assert.notEqual(result.indexOf('='), -1)
  })
})

test.group('Http.payload.json()', () => {
  test('Returns a string', ({ assert }) => {
    const http = new Http()
    const result = http.payload.json()
    assert.typeOf(result, 'string')
  })

  test('Is valid JSON', ({ assert }) => {
    const http = new Http()
    const result = http.payload.json()
    const data = JSON.parse(result)
    assert.typeOf(data, 'object')
  })
})

test.group('Http.payload.xml()', () => {
  test('Returns a string', ({ assert }) => {
    const http = new Http()
    const result = http.payload.xml()
    assert.typeOf(result, 'string')
  })
})

test.group('Http.payload.payload()', () => {
  test('returns a string when no content type', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload()
    assert.typeOf(result, 'string')
  })

  test('generates JSON data', ({ assert }) => {
    const http = new Http()
    const spy = sinon.spy(http.payload, 'json')
    http.payload.payload('application/json')
    assert.isTrue(spy.called)
    spy.restore()
  })

  test('returns a string for application/json', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload('application/json')
    assert.typeOf(result, 'string')
  })

  test('generates xml data', ({ assert }) => {
    const http = new Http()
    const spy = sinon.spy(http.payload, 'xml')
    http.payload.payload('application/xml')
    assert.isTrue(spy.called)
    spy.restore()
  })

  test('returns a string for application/xml', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload('application/xml')
    assert.typeOf(result, 'string')
  })

  test('generates url encoded data', ({ assert }) => {
    const http = new Http()
    const spy = sinon.spy(http.payload, 'urlEncoded')
    http.payload.payload('application/x-www-form-urlencoded')
    assert.isTrue(spy.called)
    spy.restore()
  })

  test('returns a string for application/x-www-form-urlencoded', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload('application/x-www-form-urlencoded')
    assert.typeOf(result, 'string')
  })

  test('returns a string for image/svg+xml', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload('image/svg+xml')
    assert.include(result, '<?xml version="1.0"?>')
  })

  test('returns a string for other types', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload('text/plain')
    assert.typeOf(result, 'string')
  })

  test('returns random string for other types type', ({ assert }) => {
    const http = new Http()
    const result = http.payload.payload('unknown')
    assert.isAbove(result.length, 1)
  })
})

test.group('Http.payload.supportsPayload()', () => {
  const supported = ['application/x-www-form-urlencoded', 'application/json', 'application/xml', 'image/svg+xml']
  for (const mime of supported) {
    test(`returns true for ${mime}`, ({ assert }) => {
      const http = new Http()
      const result = http.payload.supportsPayload(mime)
      assert.isTrue(result)
    })
  }

  test('returns true for no mime', ({ assert }) => {
    const http = new Http()
    const result = http.payload.supportsPayload()
    assert.isTrue(result)
  })

  test('returns false for unsupported mime', ({ assert }) => {
    const http = new Http()
    const result = http.payload.supportsPayload('other')
    assert.isFalse(result)
  })
})

test.group('Http.payload.svg()', () => {
  test('returns an xml', ({ assert }) => {
    const http = new Http()
    const result = http.payload.svg()
    assert.include(result, '<?xml version="1.0"?>')
  })
})
