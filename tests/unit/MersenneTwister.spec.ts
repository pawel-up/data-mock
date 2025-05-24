import { test } from '@japa/runner'
import sinon from 'sinon'
import { MersenneTwister, nValue, mtiValue, mtValue, instancesValue } from '../../src/lib/MersenneTwister.js'

test.group('MersenneTwister', (group) => {
  let sandbox: sinon.SinonSandbox

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
    // Clear static instances before each test to ensure isolation for fromSeed tests
    MersenneTwister[instancesValue].clear()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('constructor initializes with a given seed', ({ assert }) => {
    const seed = 12345
    const mt = new MersenneTwister(seed)
    assert.isAbove(mt[mtiValue], 0) // Check if initGenRand was called
    // A more specific check could be to verify mt[0] if its calculation is simple
    // For now, just check that mti is set, implying initialization.
    assert.notEqual(mt[mtiValue], mt[nValue] + 1)
  })

  test('constructor initializes with a default seed if none provided', ({ assert }) => {
    const defaultSeed = 54321
    const stub = sandbox.stub(MersenneTwister, 'seedFn').returns(defaultSeed)
    const mt = new MersenneTwister()
    stub.restore()
    assert.isTrue(stub.calledOnce)
    assert.notEqual(mt[mtiValue], mt[nValue] + 1)
  })

  test('fromSeed() creates a new instance for a new seed', ({ assert }) => {
    const seed1 = 111
    const mt1 = MersenneTwister.fromSeed(seed1)
    assert.instanceOf(mt1, MersenneTwister)
    assert.isTrue(MersenneTwister[instancesValue].has(seed1))
    assert.strictEqual(MersenneTwister[instancesValue].get(seed1), mt1)
  })

  test('fromSeed() returns an existing instance for the same seed', ({ assert }) => {
    const seed1 = 222
    const mt1 = MersenneTwister.fromSeed(seed1)
    const mt2 = MersenneTwister.fromSeed(seed1)
    assert.strictEqual(mt1, mt2)
    assert.equal(MersenneTwister[instancesValue].size, 1)
  })

  test('fromSeed() uses a default seed if none provided', ({ assert }) => {
    const defaultSeed = 999
    const stub = sandbox.stub(MersenneTwister, 'seedFn').returns(defaultSeed)
    const mt = MersenneTwister.fromSeed()
    stub.restore()
    assert.isTrue(stub.calledOnce)
    assert.isTrue(MersenneTwister[instancesValue].has(defaultSeed))
    assert.strictEqual(MersenneTwister[instancesValue].get(defaultSeed), mt)
  })

  test('initGenRand() initializes mt array and mti', ({ assert }) => {
    const mt = new MersenneTwister(0) // Use a known simple seed for easier state check if needed
    const seed = 123
    mt.initGenRand(seed)
    assert.equal(mt[mtValue][0], seed >>> 0)
    assert.equal(mt[mtiValue], mt[nValue]) // mti is N after loop
    for (let i = 1; i < mt[nValue]; i++) {
      assert.isNumber(mt[mtValue][i])
    }
  })

  test('initByArray() initializes mt array', ({ assert }) => {
    const mt = new MersenneTwister()
    const key = [1, 2, 3, 4]
    const length = key.length
    mt.initByArray(key, length)
    assert.notEqual(mt[mtiValue], mt[nValue] + 1) // Should be initialized
    // Check if the first element is the MSB set one as per the algorithm
    assert.equal(mt[mtValue][0], 0x80000000)
  })

  test('int32() returns a 32-bit integer', ({ assert }) => {
    const mt = new MersenneTwister(1)
    for (let i = 0; i < 10; i++) {
      const r = mt.int32()
      assert.isNumber(r)
      assert.isAtLeast(r, 0)
      assert.isAtMost(r, 0xffffffff)
    }
  })

  test('int32() calls initGenRand if not initialized', ({ assert }) => {
    const mt = new MersenneTwister(1)
    mt[mtiValue] = mt[nValue] + 1 // Force uninitialized state
    const initSpy = sandbox.spy(mt, 'initGenRand')
    mt.int32()
    assert.isTrue(initSpy.calledOnceWith(5489)) // Default seed
  })

  test('int31() returns a 31-bit integer', ({ assert }) => {
    const mt = new MersenneTwister(2)
    for (let i = 0; i < 10; i++) {
      const r = mt.int31()
      assert.isNumber(r)
      assert.isAtLeast(r, 0)
      assert.isAtMost(r, 0x7fffffff)
    }
  })

  test('real1() returns a random number in [0,1]', ({ assert }) => {
    const mt = new MersenneTwister(3)
    for (let i = 0; i < 10; i++) {
      const r = mt.real1()
      assert.isNumber(r)
      assert.isAtLeast(r, 0.0)
      assert.isAtMost(r, 1.0)
    }
  })

  test('real2() returns a random number in [0,1)', ({ assert }) => {
    const mt = new MersenneTwister(4)
    for (let i = 0; i < 10; i++) {
      const r = mt.real2()
      assert.isNumber(r)
      assert.isAtLeast(r, 0.0)
      assert.isBelow(r, 1.0)
    }
  })

  test('real3() returns a random number in (0,1)', ({ assert }) => {
    const mt = new MersenneTwister(5)
    for (let i = 0; i < 10; i++) {
      const r = mt.real3()
      assert.isNumber(r)
      assert.isAbove(r, 0.0)
      assert.isBelow(r, 1.0)
    }
  })

  test('res53() returns a random number with 53-bit resolution in [0,1)', ({ assert }) => {
    const mt = new MersenneTwister(6)
    for (let i = 0; i < 10; i++) {
      const r = mt.res53()
      assert.isNumber(r)
      assert.isAtLeast(r, 0.0)
      assert.isBelow(r, 1.0)
    }
  })

  test('random() returns an integer in default range [0, 32768)', ({ assert }) => {
    const mt = new MersenneTwister(7)
    for (let i = 0; i < 50; i++) {
      const r = mt.random()
      assert.isNumber(r)
      assert.isTrue(Number.isInteger(r))
      assert.isAtLeast(r, 0)
      assert.isBelow(r, 32768)
    }
  })

  test('random() returns an integer with specified max', ({ assert }) => {
    const mt = new MersenneTwister(8)
    const max = 100
    for (let i = 0; i < 50; i++) {
      const r = mt.random(max)
      assert.isNumber(r)
      assert.isTrue(Number.isInteger(r))
      assert.isAtLeast(r, 0)
      assert.isBelow(r, max)
    }
  })

  test('random() returns an integer with specified min and max', ({ assert }) => {
    const mt = new MersenneTwister(9)
    const min = 50
    const max = 150
    for (let i = 0; i < 100; i++) {
      const r = mt.random(max, min)
      assert.isNumber(r)
      assert.isTrue(Number.isInteger(r))
      assert.isAtLeast(r, min)
      assert.isBelow(r, max)
    }
  })

  test('random() handles min === max by returning min', ({ assert }) => {
    const mt = new MersenneTwister(10)
    const val = 75
    const r = mt.random(val, val)
    assert.equal(r, val)
  })

  test('random() handles min > max by returning min (current behavior)', ({ assert }) => {
    // Math.floor(this.real2() * (max - min) + min)
    // If max - min is negative, real2() * (negative) is negative or zero.
    // Adding min means result is <= min.
    // Math.floor will push it down.
    // Example: real2()=0.5, max=10, min=20 -> 0.5 * -10 + 20 = -5 + 20 = 15.
    // Example: real2()=0.0, max=10, min=20 -> 0.0 * -10 + 20 = 20.
    // Example: real2()=0.9, max=10, min=20 -> 0.9 * -10 + 20 = -9 + 20 = 11.
    // So the result will be between (max) and (min).
    const mt = new MersenneTwister(11)
    const min = 20
    const max = 10
    for (let i = 0; i < 50; i++) {
      const r = mt.random(max, min)
      assert.isNumber(r)
      assert.isTrue(Number.isInteger(r))
      assert.isAtLeast(r, max) // because max - min is negative
      assert.isAtMost(r, min)
    }
  })

  test('same seed produces the same sequence of numbers', ({ assert }) => {
    const seed = 777
    const mt1 = new MersenneTwister(seed)
    const mt2 = new MersenneTwister(seed)

    const seq1: number[] = []
    const seq2: number[] = []

    for (let i = 0; i < 20; i++) {
      seq1.push(mt1.int32())
      seq1.push(mt1.real1())
      seq1.push(mt1.random(1000, 100))

      seq2.push(mt2.int32())
      seq2.push(mt2.real1())
      seq2.push(mt2.random(1000, 100))
    }
    assert.deepEqual(seq1, seq2)
  })

  test('different seeds produce different sequences', ({ assert }) => {
    const mt1 = new MersenneTwister(100)
    const mt2 = new MersenneTwister(101)

    const seq1: number[] = []
    const seq2: number[] = []

    for (let i = 0; i < 10; i++) {
      seq1.push(mt1.int32())
      seq2.push(mt2.int32())
    }
    assert.notDeepEqual(seq1, seq2)
  })

  test('produces known sequence for a specific seed (example)', ({ assert }) => {
    const seed = 1
    const mt = new MersenneTwister(seed)
    const expectedSequence = [1791095845, 4282876139, 3093770124, 4005303368, 491263]
    for (let i = 0; i < expectedSequence.length; i++) {
      assert.equal(mt.int32(), expectedSequence[i], `Mismatch at index ${i}`)
    }
  })

  test('initByArray produces known sequence (example)', ({ assert }) => {
    const initKey = [0x123, 0x234, 0x345, 0x456]
    const keyLength = initKey.length
    const mt = new MersenneTwister() // Seed doesn't matter here as initByArray will override
    mt.initByArray(initKey, keyLength)
    const expectedSequence = [1067595299, 955945823, 477289528, 4107218783, 4228976476]
    for (let i = 0; i < expectedSequence.length; i++) {
      assert.equal(mt.int32(), expectedSequence[i], `Mismatch at index ${i} after initByArray`)
    }
  })
})

test.group('MersenneTwister.seedFn()', () => {
  test('returns a number', ({ assert }) => {
    const result = MersenneTwister.seedFn()
    assert.typeOf(result, 'number')
  })

  test('returns different numbers on subsequent calls', ({ assert }) => {
    const seed1 = MersenneTwister.seedFn()
    const seed2 = MersenneTwister.seedFn()
    assert.notEqual(seed1, seed2)
  })
})
