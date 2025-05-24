import { test } from '@japa/runner'
import {
  slug,
  strToBuffer,
  bufferToBase64,
  base64ToBuffer,
  NUMBERS,
  CHARS_LOWER,
  CHARS_UPPER,
  HEX_POOL,
} from '../../src/lib/Utils.js'

test.group('Utils.slug()', () => {
  test('replaces spaces with hyphens', ({ assert }) => {
    assert.equal(slug('hello world'), 'hello-world')
  })

  test('removes special characters', ({ assert }) => {
    assert.equal(slug('hello!@#$%^&*()_+world'), 'hello_world')
  })

  test('handles empty string', ({ assert }) => {
    assert.equal(slug(''), '')
  })

  test('handles already valid slug', ({ assert }) => {
    assert.equal(slug('already-a-slug'), 'already-a-slug')
  })

  test('handles mixed case (does not lowercase)', ({ assert }) => {
    assert.equal(slug('Hello World'), 'Hello-World')
  })

  test('handles non-ASCII characters (Japanese)', ({ assert }) => {
    assert.equal(slug('こんにちは 世界'), 'こんにちは-世界')
  })

  test('handles string with dots and hyphens', ({ assert }) => {
    assert.equal(slug('version-1.2.3'), 'version-1.2.3')
  })
})

test.group('Utils.strToBuffer()', () => {
  test('converts ASCII string to Uint8Array', ({ assert }) => {
    const result = strToBuffer('abc')
    assert.instanceOf(result, Uint8Array)
    assert.deepEqual(result, new Uint8Array([97, 98, 99]))
  })

  test('handles empty string', ({ assert }) => {
    const result = strToBuffer('')
    assert.instanceOf(result, Uint8Array)
    assert.lengthOf(result, 0)
  })
})

test.group('Utils.bufferToBase64()', () => {
  test('converts Uint8Array to base64 string', ({ assert }) => {
    const buffer = new Uint8Array([104, 101, 108, 108, 111]) // "hello"
    assert.equal(bufferToBase64(buffer.buffer), 'aGVsbG8=')
  })

  test('handles empty Uint8Array', ({ assert }) => {
    const buffer = new Uint8Array([])
    assert.equal(bufferToBase64(buffer.buffer), '')
  })
})

test.group('Utils.base64ToBuffer()', () => {
  test('converts base64 string to Uint8Array', ({ assert }) => {
    const base64Str = 'aGVsbG8=' // "hello"
    const result = base64ToBuffer(base64Str)
    assert.instanceOf(result, Uint8Array)
    assert.deepEqual(result, new Uint8Array([104, 101, 108, 108, 111]))
  })

  test('handles empty base64 string', ({ assert }) => {
    const result = base64ToBuffer('')
    assert.instanceOf(result, Uint8Array)
    assert.lengthOf(result, 0)
  })
})

test.group('Utils.constants', () => {
  test('NUMBERS is correct', ({ assert }) => {
    assert.equal(NUMBERS, '0123456789')
  })

  test('CHARS_LOWER is correct', ({ assert }) => {
    assert.equal(CHARS_LOWER, 'abcdefghijklmnopqrstuvwxyz')
  })

  test('CHARS_UPPER is correct', ({ assert }) => {
    assert.equal(CHARS_UPPER, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    assert.equal(CHARS_UPPER, CHARS_LOWER.toUpperCase())
  })

  test('HEX_POOL is correct', ({ assert }) => {
    assert.equal(HEX_POOL, '0123456789abcdef')
  })
})

test.group('Utils combined strToBuffer and bufferToBase64', () => {
  test('strToBuffer -> bufferToBase64 -> base64ToBuffer restores original string', ({ assert }) => {
    const originalString = 'Hello World! 123 $%^'
    const buffer = strToBuffer(originalString)
    const base64 = bufferToBase64(buffer.buffer)
    const restoredBuffer = base64ToBuffer(base64)
    const restoredString = String.fromCharCode(...restoredBuffer)
    assert.equal(restoredString, originalString)
  })
})
