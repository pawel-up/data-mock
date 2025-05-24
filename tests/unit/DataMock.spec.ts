import { test } from '@japa/runner'
import { DataMock } from '../../src/DataMock.js'
import { localeValue } from '../../src/DataMock.js'
import enLocale from '../../locales/en/index.js'
import sinon from 'sinon'

test.group('DataMock', () => {
  test('sets "types"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.types, 'object')
  })

  test('sets "person"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.person, 'object')
  })

  test('sets "internet"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.internet, 'object')
  })

  test('sets "lorem"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.lorem, 'object')
  })

  test('sets "random"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.random, 'object')
  })

  test('sets "time"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.time, 'object')
  })

  test('sets "word"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.word, 'object')
  })

  test('sets "http"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.http, 'object')
  })

  test('sets "software"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.software, 'object')
  })

  test('sets "svg"', ({ assert }) => {
    const instance = new DataMock()
    assert.typeOf(instance.svg, 'object')
  })
})

test.group('DataMock.seed()', (group) => {
  let sandbox: sinon.SinonSandbox

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('calls seed on all child generators with a seed value', ({ assert }) => {
    const dm = new DataMock()
    const seedValue = 98765

    const spies = [
      sandbox.spy(dm.types, 'seed'),
      sandbox.spy(dm.person, 'seed'),
      sandbox.spy(dm.internet, 'seed'),
      sandbox.spy(dm.lorem, 'seed'),
      sandbox.spy(dm.random, 'seed'),
      sandbox.spy(dm.time, 'seed'),
      sandbox.spy(dm.word, 'seed'),
      sandbox.spy(dm.http, 'seed'),
      sandbox.spy(dm.software, 'seed'),
      sandbox.spy(dm.svg, 'seed'),
    ]

    dm.seed(seedValue)

    spies.forEach((spy) => {
      assert.isTrue(spy.calledOnceWithExactly(seedValue))
    })
  })

  test('calls seed on all child generators with undefined', ({ assert }) => {
    const dm = new DataMock()
    const childGenerators = [
      dm.types,
      dm.person,
      dm.internet,
      dm.lorem,
      dm.random,
      dm.time,
      dm.word,
      dm.http,
      dm.software,
      dm.svg,
    ]
    const spies = childGenerators.map((gen) => sandbox.spy(gen, 'seed'))
    dm.seed() // Call with no arguments
    spies.forEach((spy) => assert.isTrue(spy.calledOnceWithExactly(undefined)))
  })
})

test.group('DataMock.locale()', (group) => {
  let sandbox: sinon.SinonSandbox

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('calls locale on relevant child generators and updates internal locale', ({ assert }) => {
    const dm = new DataMock()
    const customLocale = { title: 'custom-test-locale' }

    const personSpy = sandbox.spy(dm.person, 'locale')
    const wordSpy = sandbox.spy(dm.word, 'locale')
    const httpSpy = sandbox.spy(dm.http, 'locale')
    const internetSpy = sandbox.spy(dm.internet, 'locale')
    const loremSpy = sandbox.spy(dm.lorem, 'locale')
    const svgSpy = sandbox.spy(dm.svg, 'locale')
    const timeSpy = sandbox.spy(dm.time, 'locale')
    // dm.types, dm.random, dm.software do not have locale methods

    dm.locale(customLocale)

    assert.deepEqual(dm[localeValue], customLocale)
    assert.isTrue(personSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(wordSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(httpSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(internetSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(loremSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(svgSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(timeSpy.calledOnceWithExactly(customLocale))
  })

  test('calls locale on children with undefined and resets to enLocale when no argument is passed', ({ assert }) => {
    const dm = new DataMock()
    // First set a custom locale to ensure it changes
    dm.locale({ title: 'initial-custom' })

    const spies = [
      sandbox.spy(dm.person, 'locale'),
      sandbox.spy(dm.word, 'locale'),
      sandbox.spy(dm.http, 'locale'),
      sandbox.spy(dm.internet, 'locale'),
      sandbox.spy(dm.lorem, 'locale'),
      sandbox.spy(dm.svg, 'locale'),
      sandbox.spy(dm.time, 'locale'),
    ]

    dm.locale()
    assert.deepEqual(dm[localeValue], enLocale)
    spies.forEach((spy) => assert.isTrue(spy.calledOnceWithExactly(enLocale)))
  })
})
