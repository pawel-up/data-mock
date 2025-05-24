import { test } from '@japa/runner'
import { Types } from '../../src/index.js'

test.group('Types.number()', () => {
  test('generates a number', ({ assert }) => {
    const types = new Types()
    const result = types.number()
    assert.typeOf(result, 'number')
  })

  test('respects the "max" option', ({ assert }) => {
    const types = new Types()
    const result = types.number({ max: 5 })
    assert.isBelow(result, 6)
  })

  test('uses number argument as max', ({ assert }) => {
    const types = new Types()
    const result = types.number(5)
    assert.isBelow(result, 6)
  })

  test('respects the "min" option', ({ assert }) => {
    const types = new Types()
    const result = types.number({ min: 5 })
    assert.isAbove(result, 4)
  })

  test('respects the range', ({ assert }) => {
    const types = new Types()
    const opts = { min: 11, max: 22 }
    for (let i = 0; i < 100; i++) {
      const result = types.number(opts)
      assert.ok(result >= opts.min)
      assert.ok(result <= opts.max)
    }
  })

  test('respects the "precision" option', ({ assert }) => {
    const types = new Types()
    const opts = { min: 0, max: 1.5, precision: 0.5 }
    let results = new Array(1024).fill(0).map(() => types.number(opts))
    results = results.reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), [] as number[])
    results.sort()
    assert.equal(results[0], 0, 'has 0')
    assert.include(results, 0.5, 'has 0.5')
    assert.include(results, 1.0, 'has 1.0')
    assert.equal(results[results.length - 1], 1.5, 'has 1.5')
  })
})

test.group('Types.float()', () => {
  test('uses the default precision', ({ assert }) => {
    const types = new Types()
    const number = types.float()
    assert.strictEqual(number, Number(number.toFixed(2)))
  })

  test('respects the precision value', ({ assert }) => {
    const types = new Types()
    const number = types.float(0.001)
    assert.strictEqual(number, Number(number.toFixed(3)))
  })

  test('respects the max option', ({ assert }) => {
    const types = new Types()
    const opts = { max: 10 }
    assert.ok(types.float(opts) <= opts.max)
  })

  test('respects the min option', ({ assert }) => {
    const types = new Types()
    const opts = { max: 0 }
    assert.ok(types.float(opts) === 0)
  })

  test('includes negative minimum', ({ assert }) => {
    const types = new Types()
    const opts = { min: -100, max: 0 }
    assert.ok(types.float(opts) <= opts.max)
  })

  test('returns a random number between a range', ({ assert }) => {
    const types = new Types()
    const options = { min: 22, max: 33 }
    for (let i = 0; i < 5; i++) {
      const result = types.float(options)
      assert.ok(result >= options.min)
      assert.ok(result <= options.max)
    }
  })

  test('respects the "precision" option', ({ assert }) => {
    const types = new Types()
    const opts = { min: 0, max: 1.5, precision: 0.5 }
    let results = new Array(1024).fill(0).map(() => types.float(opts))
    results = results.reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), [] as number[])
    results.sort()
    assert.equal(results[0], 0, 'has 0')
    assert.include(results, 0.5, 'has 0.5')
    assert.include(results, 1.0, 'has 1.0')
    assert.equal(results[results.length - 1], 1.5, 'has 1.5')
  })
})

test.group('Types.datetime()', () => {
  test('returns a date object', ({ assert }) => {
    const types = new Types()
    const result = types.datetime()
    assert.typeOf(result.getTime(), 'number', 'has getTime()')
    assert.isFalse(Number.isNaN(result.getTime()), 'is not NaN')
  })

  test('respects the max time', ({ assert }) => {
    const types = new Types()
    const max = new Date().getTime()
    const result = types.datetime({ max }).getTime()
    assert.isBelow(result, max)
  })

  test('respects the max as a init argument', ({ assert }) => {
    const types = new Types()
    const max = new Date().getTime()
    const result = types.datetime(max).getTime()
    assert.isBelow(result, max)
  })

  test('respects the min time', ({ assert }) => {
    const types = new Types()
    const min = new Date().getTime()
    const result = types.datetime({ min }).getTime()
    assert.isAbove(result, min)
  })
})

test.group('Types.string()', () => {
  test('generates a random string', ({ assert }) => {
    const types = new Types()
    const result = types.string()
    assert.typeOf(result, 'string', 'is a string')
    assert.lengthOf(result, 10, 'has 10 characters')
  })

  test('respects the seed value', ({ assert }) => {
    const types = new Types()
    types.seed(100)
    const result = types.string()
    assert.equal(result, 'ciOVWbrHAI')
  })

  test('respects the size argument', ({ assert }) => {
    const types = new Types()
    const result = types.string(20)
    assert.lengthOf(result, 20)
  })

  test('respects the pool argument', ({ assert }) => {
    const types = new Types()
    const result = types.string(50, 'abc')
    assert.match(result, /[abc]/)
  })
})

test.group('Types.character()', () => {
  test('returns a single character', ({ assert }) => {
    const types = new Types()
    const result = types.character()
    assert.typeOf(result, 'string', 'returns a string')
    assert.lengthOf(result, 1, 'has a single character')
  })

  test('returns alpha character only', ({ assert }) => {
    const types = new Types()
    for (let i = 0; i < 1024; i++) {
      const result = types.character({ alpha: true })
      assert.match(result, /[A-Za-z]/)
    }
  })

  test('returns lowercase alpha character only', ({ assert }) => {
    const types = new Types()
    for (let i = 0; i < 1024; i++) {
      const result = types.character({ alpha: true, casing: 'lower' })
      assert.match(result, /[a-z]/)
    }
  })

  test('returns uppercase alpha character only', ({ assert }) => {
    const types = new Types()
    for (let i = 0; i < 1024; i++) {
      const result = types.character({ alpha: true, casing: 'upper' })
      assert.match(result, /[A-Z]/)
    }
  })

  test('returns numeric character only', ({ assert }) => {
    const types = new Types()
    for (let i = 0; i < 1024; i++) {
      const result = types.character({ numeric: true })
      assert.match(result, /[0-9]/)
    }
  })

  test('returns symbol character only', ({ assert }) => {
    const types = new Types()
    for (let i = 0; i < 1024; i++) {
      const result = types.character({ symbols: true })
      assert.match(result, /[!@#$%^&*()[\]]/)
    }
  })

  test('returns symbol and alpha character only', ({ assert }) => {
    const types = new Types()
    const results = new Array(1024).fill(0).map(() => types.character({ symbols: true, alpha: true }))
    const hasAlpha = results.some((i) => i.match(/[A-Za-z]/))
    const hasSymbol = results.some((i) => i.match(/[!@#$%^&*()[\]]/))
    assert.isTrue(hasAlpha, 'has alpha character')
    assert.isTrue(hasSymbol, 'has symbol character')
  })

  test('returns numeric and alpha character only', ({ assert }) => {
    const types = new Types()
    const results = new Array(1024).fill(0).map(() => types.character({ numeric: true, alpha: true }))
    const hasAlpha = results.some((i) => i.match(/[A-Za-z]/))
    const hasNumeric = results.some((i) => i.match(/[0-9]/))
    assert.isTrue(hasAlpha, 'has alpha character')
    assert.isTrue(hasNumeric, 'has numeric character')
  })
})

test.group('Types.uuid()', () => {
  test('generates a valid UUID', ({ assert }) => {
    const types = new Types()
    const result = types.uuid()
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    assert.ok(pattern.test(result))
  })
})

test.group('Types.hexaDecimal()', () => {
  test('returns a single hex character', ({ assert }) => {
    const types = new Types()
    const hex = types.hexaDecimal()
    assert.ok(hex.match(/^(0x)[0-9a-f]{1}$/i))
  })

  test('generates a random hex string', ({ assert }) => {
    const types = new Types()
    const hex = types.hexaDecimal(5)
    assert.ok(hex.match(/^(0x)[0-9a-f]+$/i))
  })
})

test.group('Types.hash()', () => {
  test('uses the default pool', ({ assert }) => {
    const types = new Types()
    const results = new Array(50).fill(0).map(() => types.hash())
    const invalid = results.some((i) => !i.match(/[0-9a-f]/))
    assert.isFalse(invalid, 'all results are valid')
  })

  test('uses the upper case pool', ({ assert }) => {
    const types = new Types()
    const results = new Array(50).fill(0).map(() => types.hash({ casing: 'upper' }))
    const invalid = results.some((i) => !i.match(/[0-9A-F]/))
    assert.isFalse(invalid, 'all results are valid')
  })

  test('uses the default size', ({ assert }) => {
    const types = new Types()
    const result = types.hash()
    assert.lengthOf(result, 40)
  })

  test('uses the passed length', ({ assert }) => {
    const types = new Types()
    const result = types.hash({ length: 8 })
    assert.lengthOf(result, 8)
  })
})

test.group('Types.boolean()', () => {
  test('returns a boolean value', ({ assert }) => {
    const types = new Types()
    const result = types.boolean()
    assert.strictEqual(typeof result, 'boolean')
  })

  test('respects the likelihood argument (30%)', ({ assert }) => {
    const types = new Types()
    let trueCount = 0
    new Array(1000).fill(0).forEach(() => {
      if (types.boolean({ likelihood: 30 })) {
        trueCount++
      }
    })
    assert.isAbove(trueCount, 200)
    assert.isBelow(trueCount, 400)
  })

  test('respects the likelihood argument (99%)', ({ assert }) => {
    const types = new Types()
    let trueCount = 0
    new Array(1000).fill(0).forEach(() => {
      if (types.boolean({ likelihood: 99 })) {
        trueCount++
      }
    })
    assert.isAbove(trueCount, 900)
  })

  test('throws when likelihood below 0', ({ assert }) => {
    const types = new Types()
    assert.throws(() => {
      types.boolean({ likelihood: -1 })
    })
  })

  test('throws when likelihood above 100', ({ assert }) => {
    const types = new Types()
    assert.throws(() => {
      types.boolean({ likelihood: 101 })
    })
  })
})

test.group('Types.falsy()', () => {
  test('returns a falsy value', ({ assert }) => {
    const types = new Types()
    const values = new Array(100).fill(0).map(() => !!types.falsy())
    const compare = new Array(100).fill(false)
    assert.deepEqual(values, compare)
  })
})
