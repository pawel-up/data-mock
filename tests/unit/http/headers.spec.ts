import { test } from '@japa/runner'
import sinon from 'sinon'
import Http from '../../../src/lib/Http.js'
import { collectHeaders } from '../../../src/lib/http/Headers.js'

test.group('Http.headers', () => {
  test('headers() returns a request string', ({ assert }) => {
    const http = new Http()
    const result = http.headers.headers('request')
    assert.typeOf(result, 'string')
  })

  test('headers() returns a response string', ({ assert }) => {
    const http = new Http()
    const result = http.headers.headers('response')
    assert.typeOf(result, 'string')
  })

  test('headers() returns a specific request header from a group', ({ assert }) => {
    const http = new Http()
    // CORS group for request should contain 'origin'
    const result = http.headers.headers('request', { group: 'cors', length: 1, noMulti: true })
    assert.include(result, 'origin: ')
  })

  test('headers() returns a specific response header from a group', ({ assert }) => {
    const http = new Http()
    // CORS group for response should contain 'access-control-allow-origin'
    const result = http.headers.headers('response', { group: 'cors', length: 1, noMulti: true })
    assert.include(result, 'access-control-allow-origin: ')
  })

  test('headers() throws when configuration cannot produce the requested number of unique headers from a group', ({
    assert,
  }) => {
    const http = new Http()
    // 'cors' group for 'request' only has 'origin', which is singular. Requesting 2 unique headers will fail.
    assert.throws(() => {
      http.headers.headers('request', { group: 'cors', length: 2, noMulti: true })
    }, /Invalid configuration. Unable to produce a list of headers./)
  })

  test('headers() produces multiple values for a multi-value header like cookie', ({ assert }) => {
    const http = new Http()
    // Force 'cookie' header to be generated multiple times to test value concatenation
    const collectHeadersSpy = sinon.stub(http.headers, collectHeaders).returns(['cookie', 'cookie'])

    const result = http.headers.headers('request', { length: 2 }) // Length here is for the spy
    assert.include(result, 'cookie: ')
    const value = result.split(': ')[1]
    const pairs = value.split('; ')
    assert.isTrue(pairs.length >= 2, 'Should have at least two cookie pairs from two generations')

    collectHeadersSpy.restore()
  })

  test('headers() produces multiple values for a comma-separated header like accept', ({ assert }) => {
    const http = new Http()
    const collectHeadersSpy = sinon.stub(http.headers, collectHeaders).returns(['accept', 'accept'])

    const result = http.headers.headers('request', { length: 2 })
    assert.include(result, 'accept: ')
    const value = result.split(': ')[1]
    const parts = value.split(', ') // Accept values are comma-separated
    assert.isTrue(parts.length >= 2, 'Should have at least two accept values from two generations')

    collectHeadersSpy.restore()
  })

  test('headers() generates specified number of headers with "length" option', ({ assert }) => {
    const http = new Http()
    const result = http.headers.headers('request', { length: 3, noMulti: true })
    const lines = result.split('\n').filter((line) => line.trim() !== '')
    // It might be less if unique headers are exhausted from a small pool, but for general case it should be 'length'
    // For this test, assume general pool is large enough.
    assert.equal(lines.length, 3)
  })

  test('headers() with noMulti: true generates unique header names', ({ assert }) => {
    const http = new Http()
    const result = http.headers.headers('request', { length: 5, noMulti: true })
    const lines = result.split('\n').filter((line) => line.trim() !== '')
    const headerNames = lines.map((line) => line.split(':')[0].trim())
    const uniqueHeaderNames = new Set(headerNames)
    assert.equal(lines.length, uniqueHeaderNames.size)
    assert.equal(uniqueHeaderNames.size, 5)
  })

  test('headers() includes content-type from "mime" option', ({ assert }) => {
    const http = new Http()
    const mimeType = 'application/vnd.custom+json'
    const result = http.headers.headers('request', { mime: mimeType, length: 1 }) // length 1 to simplify
    assert.include(result, `content-type: ${mimeType}`)
  })

  test('headers() "mime" option overrides generated content-type and ensures one content-type', ({ assert }) => {
    const http = new Http()
    const customMime = 'application/my-type'

    // Stub [collectHeaders] to ensure 'content-type' is among the generated names
    const collectHeadersSpy = sinon.stub(http.headers, collectHeaders).returns(['content-type', 'accept'])

    const result = http.headers.headers('request', { mime: customMime, length: 2 })
    collectHeadersSpy.restore()

    const lines = result.split('\n')
    let contentTypeCount = 0
    let correctContentTypeValue = false
    lines.forEach((line) => {
      if (line.toLowerCase().startsWith('content-type:')) {
        contentTypeCount++
        if (line.toLowerCase() === `content-type: ${customMime.toLowerCase()}`) {
          correctContentTypeValue = true
        }
      }
    })
    assert.equal(contentTypeCount, 1, 'Should have exactly one content-type header')
    assert.isTrue(correctContentTypeValue, `Content-Type should be ${customMime}`)
    assert.include(result, 'accept:', 'Other headers should still be present')
  })

  test('headers() uses only headers from "pool" option', ({ assert }) => {
    const http = new Http()
    const pool = ['date', 'connection', 'accept', 'content-type']
    // Requesting length 2 with noMulti true from a pool of 2 should give exactly those 2.
    const result = http.headers.headers('request', { pool, length: 2, noMulti: true })
    const lines = result.split('\n').filter((line) => line.trim() !== '')
    assert.equal(lines.length, 2)
    lines.forEach((line) => {
      const headerName = line.split(':')[0].trim()
      assert.include(pool, headerName)
    })
  })

  test('headers() throws if "pool" is too small for "length" with noMulti: true', ({ assert }) => {
    const http = new Http()
    const pool = ['date'] // Pool of 1
    assert.throws(() => {
      http.headers.headers('request', { pool, length: 2, noMulti: true })
    }, /Invalid configuration. Unable to produce a list of headers./)
  })

  test('headers() respects "min" and "max" for number of headers', ({ assert }) => {
    const http = new Http()
    for (let i = 0; i < 20; i++) {
      const result = http.headers.headers('request', { min: 2, max: 4, noMulti: true })
      const lines = result.split('\n').filter((line) => line.trim() !== '')
      assert.isAtLeast(lines.length, 2)
      assert.isAtMost(lines.length, 4)
    }
  })

  test('headers() combines options: group, length, mime', ({ assert }) => {
    const http = new Http()
    const mimeType = 'application/test-data'
    // 'caching' group for 'response' includes 'age', 'expires', 'pragma', 'cache-control'
    const result = http.headers.headers('response', {
      group: 'caching',
      length: 2,
      mime: mimeType,
      noMulti: true,
    })
    const lines = result.split('\n').filter((line) => line.trim() !== '')
    // Expect length + 1 if content-type wasn't part of the group, or length if it was and got overridden.
    // Since 'content-type' is not in 'caching' group, we expect 2 (from length) + 1 (for mime) = 3 lines.
    assert.equal(lines.length, 3, 'Should have 2 caching headers + 1 content-type')
    assert.isTrue(lines.some((line) => line.startsWith(`content-type: ${mimeType}`)))

    const cachingHeaders = ['age', 'expires', 'pragma', 'cache-control']
    let cachingHeadersFound = 0
    lines.forEach((line) => {
      const headerName = line.split(':')[0].trim()
      if (cachingHeaders.includes(headerName)) {
        cachingHeadersFound++
      }
    })
    assert.equal(cachingHeadersFound, 2, 'Should find 2 headers from the caching group')
  })

  test('headers() with only mime option', ({ assert }) => {
    const http = new Http()
    const mimeType = 'text/plain'
    const result = http.headers.headers('request', { mime: mimeType })
    const lines = result.split('\n').filter((line) => line.trim() !== '')
    // Should have content-type and potentially other default headers
    assert.isTrue(lines.some((line) => line.startsWith(`content-type: ${mimeType}`)))
    assert.isAtLeast(lines.length, 1)
  })

  test('headers() with no options generates a default number of headers', ({ assert }) => {
    const http = new Http()
    const result = http.headers.headers('request')
    const lines = result.split('\n').filter((line) => line.trim() !== '')
    // Default is min:0, max:10. So, 0 to 10 headers.
    assert.isAtMost(lines.length, 10)
  })

  test('headers() correctly handles singular headers when noMulti is false', ({ assert }) => {
    const http = new Http()
    // Force 'date' (singular) to be "generated" twice.
    // The `headersMap` logic should ensure it appears only once.
    const collectHeadersSpy = sinon.stub(http.headers, collectHeaders).returns(['date', 'date', 'accept'])

    const result = http.headers.headers('request', { length: 3 }) // length for spy
    collectHeadersSpy.restore()

    const lines = result.split('\n').filter((line) => line.trim() !== '')
    let dateHeaderCount = 0
    lines.forEach((line) => {
      if (line.toLowerCase().startsWith('date:')) {
        dateHeaderCount++
      }
    })
    assert.equal(dateHeaderCount, 1, 'Date header should appear only once')
    assert.isTrue(
      lines.some((line) => line.toLowerCase().startsWith('accept:')),
      'Accept header should be present'
    )
  })

  test('link() returns a string', ({ assert }) => {
    const http = new Http()
    const result = http.headers.link()
    assert.typeOf(result, 'string')
  })

  test('link() has the rel', ({ assert }) => {
    const http = new Http()
    const result = http.headers.link()
    assert.include(result, 'rel="')
  })

  test('contentType() returns a string', ({ assert }) => {
    const http = new Http()
    const result = http.headers.contentType()
    assert.typeOf(result, 'string')
  })

  test('contentType() with options correctly passes to _pickContentType or returns value', ({ assert }) => {
    const http = new Http()
    assert.isUndefined(http.headers.contentType({ noPayload: true }))
    assert.equal(http.headers.contentType({ contentType: 'test/custom' }), 'test/custom')

    const pickSpy = sinon.spy(http.headers, '_pickContentType')
    http.headers.contentType({}) // No specific contentType, no noPayload
    assert.isTrue(pickSpy.calledOnce)
    pickSpy.restore()
  })
})
