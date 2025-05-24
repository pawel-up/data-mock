import { test } from '@japa/runner'
import { Software } from '../../src/lib/Software.js'

test.group('Software.version()', () => {
  test('returns a string', ({ assert }) => {
    const software = new Software()
    const result = software.version()
    assert.typeOf(result, 'string')
  })

  test('returns a default semVer version', ({ assert }) => {
    const software = new Software()
    const result = software.version()
    const parts = result.split('.')
    assert.lengthOf(parts, 3, 'has major, minor, and patch parts')
    const major = Number(parts[0])
    const minor = Number(parts[1])
    const patch = Number(parts[2])
    assert.isFalse(Number.isNaN(major), 'major is a number')
    assert.isFalse(Number.isNaN(minor), 'minor is a number')
    assert.isFalse(Number.isNaN(patch), 'patch is a number')
    assert.isAbove(major, -1, 'major is >= 0')
    assert.isBelow(major, 101, 'major is <= 100')
    assert.isAbove(minor, -1, 'minor is >= 0')
    assert.isBelow(minor, 101, 'minor is <= 100')
    assert.isAbove(patch, -1, 'patch is >= 0')
    assert.isBelow(patch, 101, 'patch is <= 100')
  })

  test('returns a major version only', ({ assert }) => {
    const software = new Software()
    const result = software.version({ format: 'major' })
    const parts = result.split('.')
    assert.lengthOf(parts, 1, 'has major part only')
    const major = Number(result)
    assert.isFalse(Number.isNaN(major), 'major is a number')
    assert.isAbove(major, -1, 'major is >= 0')
    assert.isBelow(major, 101, 'major is <= 100')
  })

  test('returns a major and minor only version', ({ assert }) => {
    const software = new Software()
    const result = software.version({ format: 'majorMinor' })
    const parts = result.split('.')
    assert.lengthOf(parts, 2, 'has major and minor parts')
    const major = Number(parts[0])
    const minor = Number(parts[1])
    assert.isFalse(Number.isNaN(major), 'major is a number')
    assert.isFalse(Number.isNaN(minor), 'minor is a number')
    assert.isAbove(major, -1, 'major is >= 0')
    assert.isBelow(major, 101, 'major is <= 100')
    assert.isAbove(minor, -1, 'minor is >= 0')
    assert.isBelow(minor, 101, 'minor is <= 100')
  })

  test('throws for unknown format', ({ assert }) => {
    const software = new Software()
    assert.throws(() => {
      // @ts-expect-error Testing unknown format
      software.version({ format: 'other' })
    })
  })
})

test.group('Software.majorVersion()', () => {
  test('returns a string', ({ assert }) => {
    const software = new Software()
    const result = software.majorVersion()
    assert.typeOf(result, 'string')
  })

  test('returns the passed version', ({ assert }) => {
    const software = new Software()
    const result = software.majorVersion({ major: 100 })
    assert.equal(result, '100')
  })

  test('respects the min value', ({ assert }) => {
    const software = new Software()
    let min = Number.POSITIVE_INFINITY
    for (let i = 0; i < 50; i++) {
      const result = Number(software.majorVersion({ major: { min: 25 } }))
      if (result < min) {
        min = result
      }
    }
    assert.isAbove(min, 24)
  })

  test('respects the max value', ({ assert }) => {
    const software = new Software()
    let max = Number.NEGATIVE_INFINITY
    for (let i = 0; i < 50; i++) {
      const result = Number(software.majorVersion({ major: { max: 25 } }))
      if (result > max) {
        max = result
      }
    }
    assert.isBelow(max, 26)
  })
})

test.group('Software.majorMinorVersion()', () => {
  test('returns a string with 2 versions', ({ assert }) => {
    const software = new Software()
    const result = software.majorMinorVersion()
    assert.typeOf(result, 'string')
    const parts = result.split('.')
    assert.lengthOf(parts, 2, 'has 2 version')
  })

  test('returns the passed major version', ({ assert }) => {
    const software = new Software()
    const result = software.majorMinorVersion({ major: 100 })
    assert.equal(result.split('.')[0], '100')
  })

  test('returns the passed minor version', ({ assert }) => {
    const software = new Software()
    const result = software.majorMinorVersion({ minor: 100 })
    assert.equal(result.split('.')[1], '100')
  })

  test('respects the minor min value', ({ assert }) => {
    const software = new Software()
    let min = Number.POSITIVE_INFINITY
    for (let i = 0; i < 50; i++) {
      const version = software.majorMinorVersion({ minor: { min: 25 } })
      const result = Number(version.split('.')[1])
      if (result < min) {
        min = result
      }
    }
    assert.isAbove(min, 24)
  })

  test('respects the minor max value', ({ assert }) => {
    const software = new Software()
    let max = Number.NEGATIVE_INFINITY
    for (let i = 0; i < 50; i++) {
      const version = software.majorMinorVersion({ minor: { max: 25 } })
      const result = Number(version.split('.')[1])
      if (result > max) {
        max = result
      }
    }
    assert.isBelow(max, 26)
  })
})

test.group('Software.symVersion()', () => {
  test('returns a string with 3 versions', ({ assert }) => {
    const software = new Software()
    const result = software.symVersion()
    assert.typeOf(result, 'string')
    const parts = result.split('.')
    assert.lengthOf(parts, 3, 'has 3 version')
  })

  test('returns the passed major version', ({ assert }) => {
    const software = new Software()
    const result = software.symVersion({ major: 100 })
    assert.equal(result.split('.')[0], '100')
  })

  test('returns the passed minor version', ({ assert }) => {
    const software = new Software()
    const result = software.symVersion({ minor: 100 })
    assert.equal(result.split('.')[1], '100')
  })

  test('returns the passed patch version', ({ assert }) => {
    const software = new Software()
    const result = software.symVersion({ patch: 100 })
    assert.equal(result.split('.')[2], '100')
  })

  test('respects the patch min value', ({ assert }) => {
    const software = new Software()
    let min = Number.POSITIVE_INFINITY
    for (let i = 0; i < 50; i++) {
      const version = software.symVersion({ patch: { min: 25 } })
      const result = Number(version.split('.')[2])
      if (result < min) {
        min = result
      }
    }
    assert.isAbove(min, 24)
  })

  test('respects the patch max value', ({ assert }) => {
    const software = new Software()
    let max = Number.NEGATIVE_INFINITY
    for (let i = 0; i < 50; i++) {
      const version = software.symVersion({ patch: { max: 25 } })
      const result = Number(version.split('.')[2])
      if (result > max) {
        max = result
      }
    }
    assert.isBelow(max, 26)
  })
})

test.group('Software.preVersion()', () => {
  test('returns a string with 3 versions', ({ assert }) => {
    const software = new Software()
    const result = software.preVersion()
    assert.typeOf(result, 'string')
    const parts = result.split('.')
    assert.lengthOf(parts, 3, 'has 3 version')
  })

  test('has the pre-release suffix', ({ assert }) => {
    const software = new Software()
    const result = software.preVersion()
    const suffix = result.split('-')[1]
    assert.include(['pre', 'alpha', 'beta', 'dev'], suffix)
  })
})
