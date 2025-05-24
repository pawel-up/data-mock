import { test } from '@japa/runner'
import sinon from 'sinon'
import { Internet, randomValue, typesValue, localeValue, wordValue, personValue } from '../../src/lib/Internet.js'
import enLocale from '../../locales/en/index.js'
import { DataMockLocale } from '../../locales/Types.js'
import { Random } from '../../src/lib/Random.js'
import { Types } from '../../src/lib/Types.js'
import { Person } from '../../src/lib/Person.js'
import { Word } from '../../src/lib/Word.js'

const internetLocaleKey = enLocale.internet!

test.group('Internet', (group) => {
  let sandbox: sinon.SinonSandbox

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('constructor initializes child generators and locale', ({ assert }) => {
    const internet = new Internet()
    assert.instanceOf(internet[randomValue], Random)
    assert.instanceOf(internet[typesValue], Types)
    assert.instanceOf(internet[personValue], Person)
    assert.instanceOf(internet[wordValue], Word)
    assert.deepEqual(internet[localeValue], enLocale)

    const customLocale: DataMockLocale = { title: 'custom' }
    const internetWithLocale = new Internet({ locale: customLocale })
    assert.deepEqual(internetWithLocale[localeValue], customLocale)
  })

  test('seed() calls seed on child generators', ({ assert }) => {
    const internet = new Internet()
    const seedValue = 12345

    const randomSpy = sandbox.spy(internet[randomValue], 'seed')
    const typesSpy = sandbox.spy(internet[typesValue], 'seed')
    const personSpy = sandbox.spy(internet[personValue], 'seed')
    const wordSpy = sandbox.spy(internet[wordValue], 'seed')

    internet.seed(seedValue)

    assert.isTrue(randomSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(typesSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(personSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(wordSpy.calledOnceWithExactly(seedValue))

    internet.seed() // Test with undefined
    assert.isTrue(randomSpy.calledWithExactly(undefined))
    assert.isTrue(typesSpy.calledWithExactly(undefined))
    assert.isTrue(personSpy.calledWithExactly(undefined))
    assert.isTrue(wordSpy.calledWithExactly(undefined))
  })

  test('locale() calls locale on child generators and updates internal locale', ({ assert }) => {
    const internet = new Internet()
    const customLocale: DataMockLocale = { title: 'custom-locale' }

    const personSpy = sandbox.spy(internet[personValue], 'locale')
    const wordSpy = sandbox.spy(internet[wordValue], 'locale')

    internet.locale(customLocale)

    assert.isTrue(personSpy.calledOnceWithExactly(customLocale))
    assert.isTrue(wordSpy.calledOnceWithExactly(customLocale))
    assert.deepEqual(internet[localeValue], customLocale)

    internet.locale() // Test with undefined
    assert.isTrue(personSpy.calledWithExactly(enLocale))
    assert.isTrue(wordSpy.calledWithExactly(enLocale))
    assert.deepEqual(internet[localeValue], enLocale)
  })

  test('avatar() returns a valid avatar URL', ({ assert }) => {
    const internet = new Internet()
    const avatarUrl = internet.avatar()
    assert.typeOf(avatarUrl, 'string')
    assert.isTrue(avatarUrl.startsWith('https://cdn.fakercloud.com/avatars/'))
    const picName = avatarUrl.substring('https://cdn.fakercloud.com/avatars/'.length)
    assert.include(internetLocaleKey.avatar, picName)
  })

  test('avatar() uses custom locale', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      internet: { avatar: ['custom.jpg'], email: { free: [], example: [] }, domain: { suffix: [] } },
    }
    const internet = new Internet({ locale: customLocale })
    assert.equal(internet.avatar(), 'https://cdn.fakercloud.com/avatars/custom.jpg')
  })

  test('email() generates a valid email string', ({ assert }) => {
    const internet = new Internet()
    const email = internet.email()
    assert.typeOf(email, 'string')
    assert.include(email, '@')
    const parts = email.split('@')
    assert.isTrue(parts[0].length > 0)
    assert.isTrue(parts[1].length > 0)
    assert.isFalse(email.includes(' '))
    assert.isFalse(email.includes("'"))
  })

  test('email() uses provided provider', ({ assert }) => {
    const internet = new Internet()
    const email = internet.email({ provider: 'custom.com' })
    assert.isTrue(email.endsWith('@custom.com'))
  })

  test('email() uses free provider from locale', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      internet: { email: { free: ['myfree.org'], example: [] }, domain: { suffix: [] }, avatar: [] },
    }
    const internet = new Internet({ locale: customLocale })
    const email = internet.email()
    assert.isTrue(email.endsWith('@myfree.org'))
  })

  test('email() uses provided firstName and lastName', ({ assert }) => {
    const internet = new Internet()
    const email = internet.email({ firstName: 'John', lastName: 'Doe' })
    assert.isTrue(email.startsWith('john') || email.startsWith('johndoe')) // Depends on random format
  })

  test('exampleEmail() generates an email with an example domain', ({ assert }) => {
    const internet = new Internet()
    const email = internet.exampleEmail()
    assert.typeOf(email, 'string')
    const domain = email.split('@')[1]
    assert.include(internetLocaleKey.email.example, domain)
  })

  test('exampleEmail() uses custom locale', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      internet: { email: { example: ['example.test'], free: [] }, domain: { suffix: [] }, avatar: [] },
    }
    const internet = new Internet({ locale: customLocale })
    const email = internet.exampleEmail()
    assert.isTrue(email.endsWith('@example.test'))
  })

  test('userName() generates a username string', ({ assert }) => {
    const internet = new Internet()
    const username = internet.userName()
    assert.typeOf(username, 'string')
    assert.isTrue(username.length > 0)
    assert.isFalse(username.includes(' '))
    assert.isFalse(username.includes("'"))
  })

  test('userName() uses provided firstName and lastName', ({ assert }) => {
    const internet = new Internet()
    const username = internet.userName({ firstName: 'Jane', lastName: 'Smith' })
    // Example: jane, jane.smith, jane_smith, jane99, jane.smith33 etc.
    assert.isTrue(username.toLowerCase().includes('jane'))
    if (username.includes('.') || username.includes('_')) {
      assert.isTrue(username.toLowerCase().includes('smith'))
    }
  })

  test('protocol() returns http or https', ({ assert }) => {
    const internet = new Internet()
    const protocols = new Set()
    for (let i = 0; i < 20; i++) {
      protocols.add(internet.protocol())
    }
    assert.properties(protocols, ['http', 'https'])
    assert.equal(protocols.size, 2)
  })

  test('httpMethod() returns a valid HTTP method string', ({ assert }) => {
    const internet = new Internet()
    const method = internet.httpMethod()
    assert.typeOf(method, 'string')
    const allMethods = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'GET', 'HEAD']
    assert.include(allMethods, method)
  })

  test('httpMethod(true) returns a method that supports payload', ({ assert }) => {
    const internet = new Internet()
    const payloadMethods = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    for (let i = 0; i < 20; i++) {
      const method = internet.httpMethod(true)
      assert.include(payloadMethods, method)
    }
  })

  test('httpMethod(false) returns a method that does not support payload', ({ assert }) => {
    const internet = new Internet()
    const nonPayloadMethods = ['GET', 'HEAD']
    for (let i = 0; i < 20; i++) {
      const method = internet.httpMethod(false)
      assert.include(nonPayloadMethods, method)
    }
  })

  test('uri() generates a valid URI string', ({ assert }) => {
    const internet = new Internet()
    const uri = internet.uri()
    assert.typeOf(uri, 'string')
    assert.isTrue(uri.startsWith('http://') || uri.startsWith('https://'))
    const domainPart = uri.split('//')[1]
    assert.include(domainPart, '.')
  })

  test('domain() generates a valid domain string', ({ assert }) => {
    const internet = new Internet()
    const domain = internet.domain()
    assert.typeOf(domain, 'string')
    assert.include(domain, '.')
    const parts = domain.split('.')
    assert.isTrue(parts[0].length > 0)
    assert.isTrue(parts[1].length > 0)
  })

  test('domainName() generates a valid domain name string', ({ assert }) => {
    const internet = new Internet()
    const domainName = internet.domainName()
    assert.typeOf(domainName, 'string')
    assert.isTrue(domainName.length > 0)
    assert.equal(domainName, domainName.toLowerCase())
    assert.match(domainName, /^[a-z0-9-]+$/) // Slug-like
  })

  test('domainSuffix() returns a valid domain suffix string', ({ assert }) => {
    const internet = new Internet()
    const suffix = internet.domainSuffix()
    assert.typeOf(suffix, 'string')
    assert.include(internetLocaleKey.domain.suffix, suffix)
  })

  test('domainSuffix() uses custom locale', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      internet: { domain: { suffix: ['test'] }, email: { free: [], example: [] }, avatar: [] },
    }
    const internet = new Internet({ locale: customLocale })
    assert.equal(internet.domainSuffix(), 'test')
  })

  test('ip() generates a valid IPv4 address string', ({ assert }) => {
    const internet = new Internet()
    const ip = internet.ip()
    assert.typeOf(ip, 'string')
    const parts = ip.split('.')
    assert.lengthOf(parts, 4)
    parts.forEach((part) => {
      const num = parseInt(part, 10)
      assert.isFalse(isNaN(num))
      assert.isAtLeast(num, 0)
      assert.isAtMost(num, 255)
    })
  })

  test('ipv6() generates a valid IPv6 address string', ({ assert }) => {
    const internet = new Internet()
    const ipv6 = internet.ipv6()
    assert.typeOf(ipv6, 'string')
    const parts = ipv6.split(':')
    assert.lengthOf(parts, 8)
    parts.forEach((part) => {
      assert.lengthOf(part, 4)
      assert.match(part, /^[0-9a-f]{4}$/i)
    })
  })

  test('port() generates a valid port number', ({ assert }) => {
    const internet = new Internet()
    for (let i = 0; i < 50; i++) {
      const port = internet.port()
      assert.typeOf(port, 'number')
      assert.isAtLeast(port, 0)
      assert.isAtMost(port, 65535)
    }
  })

  test('color() generates a valid hex color string', ({ assert }) => {
    const internet = new Internet()
    const color = internet.color()
    assert.typeOf(color, 'string')
    assert.match(color, /^#[0-9a-f]{6}$/i)
  })

  test('color() respects base red, green, blue values', ({ assert }) => {
    const internet = new Internet()
    // Mock types.number to control its output for predictable color generation
    const typesNumberStub = sandbox.stub(internet[typesValue], 'number')

    // Test with base red
    typesNumberStub.onCall(0).returns(50) // for red
    typesNumberStub.onCall(1).returns(100) // for green
    typesNumberStub.onCall(2).returns(150) // for blue
    let color = internet.color(200, 0, 0) // Base red is 200
    let expectedRed = Math.floor((50 + 200) / 2).toString(16) // (50+200)/2 = 125 -> "7d"
    if (expectedRed.length === 1) expectedRed = `0${expectedRed}`
    let expectedGreen = Math.floor((100 + 0) / 2).toString(16) // (100+0)/2 = 50 -> "32"
    if (expectedGreen.length === 1) expectedGreen = `0${expectedGreen}`
    let expectedBlue = Math.floor((150 + 0) / 2).toString(16) // (150+0)/2 = 75 -> "4b"
    if (expectedBlue.length === 1) expectedBlue = `0${expectedBlue}`
    assert.equal(color, `#${expectedRed}${expectedGreen}${expectedBlue}`)

    // Test with all base values
    typesNumberStub.onCall(3).returns(10) // r
    typesNumberStub.onCall(4).returns(20) // g
    typesNumberStub.onCall(5).returns(30) // b
    color = internet.color(100, 150, 200)
    expectedRed = Math.floor((10 + 100) / 2).toString(16) // 55 -> 37
    if (expectedRed.length === 1) expectedRed = `0${expectedRed}`
    expectedGreen = Math.floor((20 + 150) / 2).toString(16) // 85 -> 55
    if (expectedGreen.length === 1) expectedGreen = `0${expectedGreen}`
    expectedBlue = Math.floor((30 + 200) / 2).toString(16) // 115 -> 73
    if (expectedBlue.length === 1) expectedBlue = `0${expectedBlue}`
    assert.equal(color, `#${expectedRed}${expectedGreen}${expectedBlue}`)
  })

  test('browser() returns a browser name', ({ assert }) => {
    const internet = new Internet()
    const browser = internet.browser()
    const knownBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Internet Explorer', 'Opera', 'SeaMonkey']
    assert.typeOf(browser, 'string')
    assert.include(knownBrowsers, browser)
  })

  // Edge case tests for locale fallbacks
  test('avatar() falls back to enLocale if custom locale has no avatar', ({ assert }) => {
    // @ts-expect-error Testing missing values
    const customLocale: DataMockLocale = { title: 'custom', internet: {} } // No avatar key
    const internet = new Internet({ locale: customLocale })
    const avatarUrl = internet.avatar()
    const picName = avatarUrl.substring('https://cdn.fakercloud.com/avatars/'.length)
    assert.include(enLocale.internet!.avatar, picName)

    // @ts-expect-error Testing missing values
    const customLocaleEmpty: DataMockLocale = { title: 'custom', internet: { avatar: [] } } // Empty avatar array
    const internet2 = new Internet({ locale: customLocaleEmpty })
    const avatarUrl2 = internet2.avatar()
    const picName2 = avatarUrl2.substring('https://cdn.fakercloud.com/avatars/'.length)
    assert.include(enLocale.internet!.avatar, picName2)
  })

  test('email() falls back to enLocale for free providers if custom locale is incomplete', ({ assert }) => {
    // @ts-expect-error Testing missing values
    const customLocale: DataMockLocale = { title: 'custom', internet: { email: {} } } // No free key
    const internet = new Internet({ locale: customLocale })
    const email = internet.email()
    const domain = email.split('@')[1]
    assert.include(enLocale.internet!.email.free, domain)

    // @ts-expect-error Testing missing values
    const customLocaleEmpty: DataMockLocale = { title: 'custom', internet: { email: { free: [] } } } // Empty free array
    const internet2 = new Internet({ locale: customLocaleEmpty })
    const email2 = internet2.email()
    const domain2 = email2.split('@')[1]
    assert.include(enLocale.internet!.email.free, domain2)
  })

  test('exampleEmail() falls back to enLocale for example providers if custom locale is incomplete', ({ assert }) => {
    // @ts-expect-error Testing missing values
    const customLocale: DataMockLocale = { title: 'custom', internet: { email: {} } } // No example key
    const internet = new Internet({ locale: customLocale })
    const email = internet.exampleEmail()
    const domain = email.split('@')[1]
    assert.include(enLocale.internet!.email.example, domain)

    // @ts-expect-error Testing missing values
    const customLocaleEmpty: DataMockLocale = { title: 'custom', internet: { email: { example: [] } } }
    const internet2 = new Internet({ locale: customLocaleEmpty })
    const email2 = internet2.exampleEmail()
    const domain2 = email2.split('@')[1]
    assert.include(enLocale.internet!.email.example, domain2)
  })

  test('domainSuffix() falls back to enLocale if custom locale is incomplete', ({ assert }) => {
    // @ts-expect-error Testing missing values
    const customLocale: DataMockLocale = { title: 'custom', internet: { domain: {} } } // No suffix key
    const internet = new Internet({ locale: customLocale })
    const suffix = internet.domainSuffix()
    assert.include(enLocale.internet!.domain.suffix, suffix)

    // @ts-expect-error Testing missing values
    const customLocaleEmpty: DataMockLocale = { title: 'custom', internet: { domain: { suffix: [] } } }
    const internet2 = new Internet({ locale: customLocaleEmpty })
    const suffix2 = internet2.domainSuffix()
    assert.include(enLocale.internet!.domain.suffix, suffix2)
  })
})
