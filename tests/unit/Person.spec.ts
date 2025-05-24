import { test } from '@japa/runner'
import sinon from 'sinon'
import { Person, randomValue, typesValue, localeValue } from '../../src/lib/Person.js'
import { Types } from '../../src/lib/Types.js'
import { Random } from '../../src/lib/Random.js'
import enLocale from '../../locales/en/index.js'
import { DataMockLocale } from '../../locales/Types.js'

test.group('Person', (group) => {
  let sandbox: sinon.SinonSandbox
  let person: Person

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
    person = new Person()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('constructor initializes types, random, and locale', ({ assert }) => {
    assert.instanceOf(person[typesValue], Types)
    assert.instanceOf(person[randomValue], Random)
    assert.deepEqual(person[localeValue], enLocale)

    const customLocale: DataMockLocale = { title: 'custom' }
    const personWithLocale = new Person({ locale: customLocale })
    assert.deepEqual(personWithLocale[localeValue], customLocale)
  })
})

test.group('Person.firstName()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const result = person.firstName()
    assert.typeOf(result, 'string')
  })

  test('returns a male name', ({ assert }) => {
    const person = new Person()
    const result = person.firstName('male')
    assert.include(enLocale.person!.firstName!.male, result)
  })

  test('returns a female name', ({ assert }) => {
    const person = new Person()
    const result = person.firstName('female')
    assert.include(enLocale.person!.firstName!.female, result)
  })

  test('returns a name of random gender if no gender specified', ({ assert }) => {
    const randomPickOneStub = sinon.stub(person[randomValue], 'pickOne')
    randomPickOneStub.onFirstCall().returns('male') // For gender selection
    randomPickOneStub.onSecondCall().returns(enLocale.person!.firstName!.male[0]) // For name selection

    const result = person.firstName()
    assert.equal(result, enLocale.person!.firstName!.male[0])
    assert.isTrue(randomPickOneStub.calledWith(['male', 'female']))
  })

  test('ignores invalid gender value', ({ assert }) => {
    const randomPickOneStub = sinon.stub(person[randomValue], 'pickOne')
    randomPickOneStub.onFirstCall().returns('female') // For gender selection (fallback)
    randomPickOneStub.onSecondCall().returns(enLocale.person!.firstName!.female[0]) // For name selection

    // @ts-expect-error Testing invalid values
    const result = person.firstName('females')
    assert.typeOf(result, 'string')
    assert.equal(result, enLocale.person!.firstName!.female[0])
    assert.isTrue(randomPickOneStub.calledWith(['male', 'female']))
  })

  test('uses custom locale for first names', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { firstName: { male: ['CustomMaleName'], female: ['CustomFemaleName'] } },
    }
    person.locale(customLocale)
    assert.equal(person.firstName('male'), 'CustomMaleName')
    assert.equal(person.firstName('female'), 'CustomFemaleName')
  })

  test('falls back to enLocale if custom locale is incomplete for first names', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      // @ts-expect-error Testing incomplete locale
      person: { firstName: { male: ['CustomMaleName'] } }, // Female names missing
    }
    person.locale(customLocale)
    const result = person.firstName('female')
    assert.include(enLocale.person!.firstName!.female, result)
  })
})

test.group('Person.seed()', (group) => {
  let person: Person
  let randomSeedSpy: sinon.SinonSpy
  let typesSeedSpy: sinon.SinonSpy

  group.each.setup(() => {
    person = new Person()
    randomSeedSpy = sinon.spy(person[randomValue], 'seed')
    typesSeedSpy = sinon.spy(person[typesValue], 'seed')
  })

  test('calls seed on child generators with a value', ({ assert }) => {
    const seedValue = 123
    person.seed(seedValue)
    assert.isTrue(randomSeedSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(typesSeedSpy.calledOnceWithExactly(seedValue))
  })

  test('calls seed on child generators with undefined', ({ assert }) => {
    person.seed()
    assert.isTrue(randomSeedSpy.calledOnceWithExactly(undefined))
    assert.isTrue(typesSeedSpy.calledOnceWithExactly(undefined))
  })
})

test.group('Person.lastName()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const result = person.lastName()
    assert.typeOf(result, 'string')
  })

  test('returns a male name', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        lastName: {
          male: ['Test'],
        },
      },
    })
    const result = person.lastName('male')
    assert.equal(result, 'Test')
  })

  test('returns a female name', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        lastName: {
          female: ['Test'],
        },
      },
    })
    const result = person.lastName('female')
    assert.equal(result, 'Test')
  })

  test('returns a general last name if available', ({ assert }) => {
    person.locale({
      title: 'test',
      person: {
        lastName: {
          general: ['GeneralTest'],
          male: ['MaleTest'],
          female: ['FemaleTest'],
        },
      },
    })
    const result = person.lastName() // No gender specified
    assert.equal(result, 'GeneralTest')
    const resultMale = person.lastName('male')
    assert.equal(resultMale, 'MaleTest')
  })

  test('ignores invalid gender value', ({ assert }) => {
    const randomPickOneStub = sinon.stub(person[randomValue], 'pickOne')
    randomPickOneStub.onFirstCall().returns('female') // For gender selection (fallback)
    randomPickOneStub.onSecondCall().returns(enLocale.person!.lastName!.female![0]) // For name selection

    // @ts-expect-error Testing invalid values
    const result = person.lastName('females')
    assert.typeOf(result, 'string')
    assert.include(enLocale.person!.lastName!.female!, result)
  })

  test('uses custom locale for last names', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { lastName: { male: ['CustomMaleLast'], female: ['CustomFemaleLast'] } },
    }
    person.locale(customLocale)
    assert.equal(person.lastName('male'), 'CustomMaleLast')
    assert.equal(person.lastName('female'), 'CustomFemaleLast')
  })

  test('falls back to enLocale if custom locale is incomplete for last names', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { lastName: { male: ['CustomMaleLast'] } }, // Female names missing
    }
    person.locale(customLocale)
    const result = person.lastName('female')
    assert.include(enLocale.person!.lastName!.female, result)
  })

  test('returns a name of random gender if no gender and no general names', ({ assert }) => {
    const result = person.lastName() // enLocale has no general last names
    assert.isTrue(
      enLocale.person!.lastName!.male!.includes(result) || enLocale.person!.lastName!.female!.includes(result)
    )
  })
})

test.group('Person.middleName()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const person = new Person()
    const result = person.middleName()
    assert.typeOf(result, 'string')
  })

  test('returns a male name', ({ assert }) => {
    const person = new Person()
    const result = person.middleName('male')
    assert.include(enLocale.person!.firstName!.male, result)
  })

  test('returns a female name', ({ assert }) => {
    const person = new Person()
    const result = person.middleName('female')
    assert.include(enLocale.person!.firstName!.female, result)
  })

  test('ignores invalid gender value', ({ assert }) => {
    const randomPickOneStub = sinon.stub(person[randomValue], 'pickOne')
    randomPickOneStub.onFirstCall().returns('male') // For gender selection (fallback)
    randomPickOneStub.onSecondCall().returns(enLocale.person!.firstName!.male[0]) // For name selection

    // @ts-expect-error Testing invalid values
    const result = person.middleName('females')
    assert.typeOf(result, 'string')
    assert.equal(result, enLocale.person!.firstName!.male[0])
  })

  test('uses custom locale middleName if available', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      // @ts-expect-error Testing incomplete locale
      person: { middleName: { male: ['CustomMiddleMale'] } },
    }
    person.locale(customLocale)
    assert.equal(person.middleName('male'), 'CustomMiddleMale')
  })

  test('uses custom locale firstName if middleName is not available in custom locale', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      // @ts-expect-error Testing incomplete locale
      person: { firstName: { female: ['CustomFirstFemale'] } }, // No middleName
    }
    person.locale(customLocale)
    assert.equal(person.middleName('female'), 'CustomFirstFemale')
  })

  test('falls back to enLocale firstName if custom locale has neither middleName nor firstName', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: {}, // Empty person object
    }
    person.locale(customLocale)
    const result = person.middleName('male')
    assert.include(enLocale.person!.firstName!.male, result)
  })
})

test.group('Person.name()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const result = person.name()
    assert.typeOf(result, 'string')
    const parts = result.split(' ')
    assert.isAtLeast(parts.length, 2) // At least first and last name
  })

  test('generates a full name with random parts', ({ assert }) => {
    const result = person.name()
    // Check that it contains parts that look like names/prefixes/suffixes
    assert.match(result, /^[A-Za-z.'-]+(?: [A-Za-z.'-]+)+$/)
  })

  test('respects the first name', ({ assert }) => {
    const person = new Person()
    const result = person.name({ firstName: 'Pawel' })
    assert.include(result, 'Pawel')
  })

  test('respects the last name', ({ assert }) => {
    const person = new Person()
    const result = person.name({ lastName: 'Uchida-Psztyc' })
    assert.include(result, 'Uchida-Psztyc')
  })

  test('respects the gender for generating missing parts', ({ assert }) => {
    // Stub firstName and lastName to control their output based on gender
    const firstNameStub = sinon.stub(person, 'firstName')
    const lastNameStub = sinon.stub(person, 'lastName')

    firstNameStub.withArgs('female').returns('FemaleFirstName')
    lastNameStub.withArgs('female').returns('FemaleLastName')

    const result = person.name({ gender: 'female' })
    assert.include(result, 'FemaleFirstName')
    assert.include(result, 'FemaleLastName')
    assert.isTrue(firstNameStub.calledWith('female'))
    assert.isTrue(lastNameStub.calledWith('female'))
  })

  test('sometimes includes prefix', ({ assert }) => {
    sinon.stub(person[typesValue], 'boolean').returns(true) // Force prefix/suffix
    sinon.stub(person, 'prefix').returns('Mr.')
    const result = person.name()
    assert.include(result, 'Mr.')
  })

  test('sometimes includes suffix', ({ assert }) => {
    sinon.stub(person[typesValue], 'boolean').returns(true) // Force prefix/suffix
    sinon.stub(person, 'suffix').returns('Jr.')
    const result = person.name()
    assert.include(result, 'Jr.')
  })
})

test.group('Person.gender()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const person = new Person()
    const result = person.gender()
    assert.typeOf(result, 'string')
  })

  test('returns a binary gender', ({ assert }) => {
    const person = new Person()
    const result = person.gender(true)
    assert.include(['Male', 'Female'], result)
  })

  test('returns a gender from the full pool', ({ assert }) => {
    const result = person.gender() // or person.gender(false)
    assert.include(enLocale.person!.gender!.pool, result)
  })

  test('uses custom locale for genders', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { gender: { binary: ['BinaryCustom'], pool: ['PoolCustom'] } },
    }
    person.locale(customLocale)
    assert.equal(person.gender(true), 'BinaryCustom')
    assert.equal(person.gender(), 'PoolCustom')
  })

  test('falls back to enLocale if custom locale is incomplete for genders', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      // @ts-expect-error Testing incomplete locale
      person: { gender: { binary: ['BinaryCustom'] } }, // Pool missing
    }
    person.locale(customLocale)
    assert.include(enLocale.person!.gender!.pool, person.gender())
  })
})

test.group('Person.prefix()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const person = new Person()
    const result = person.prefix()
    assert.typeOf(result, 'string')
  })

  test('returns a general prefix', ({ assert }) => {
    const person = new Person()
    const result = person.prefix()
    assert.include(enLocale.person!.prefix!.general!, result)
  })

  test('returns a male prefix', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        prefix: {
          male: ['Test'],
        },
      },
    })
    const result = person.prefix('male')
    assert.equal(result, 'Test')
  })

  test('returns a female prefix', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        prefix: {
          female: ['Test'],
        },
      },
    })
    const result = person.prefix('female')
    assert.equal(result, 'Test')
  })

  test('uses custom locale for prefixes', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { prefix: { male: ['CustomMalePrefix'], female: ['CustomFemalePrefix'] } },
    }
    person.locale(customLocale)
    assert.equal(person.prefix('male'), 'CustomMalePrefix')
  })

  test('falls back to enLocale if custom locale is incomplete for prefixes', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { prefix: { male: ['CustomMalePrefix'] } }, // Female missing
    }
    person.locale(customLocale)
    // enLocale has general prefixes, so it will pick from there if gender-specific is missing
    const result = person.prefix('female')
    assert.include(enLocale.person!.prefix!.general!, result)
  })

  test('returns a prefix of random gender if no gender and no general prefixes in locale', ({ assert }) => {
    const noGeneralLocale: DataMockLocale = { title: 'no-general', person: { prefix: { male: ['M'], female: ['F'] } } }
    person.locale(noGeneralLocale)
    const result = person.prefix()
    assert.include(['M', 'F'], result)
  })
})

test.group('Person.suffix()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string', ({ assert }) => {
    const person = new Person()
    const result = person.suffix()
    assert.typeOf(result, 'string')
  })

  test('returns a general suffix', ({ assert }) => {
    const person = new Person()
    const result = person.suffix()
    assert.include(enLocale.person!.suffix!.general!, result)
  })

  test('returns a male suffix', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        suffix: {
          male: ['Test'],
        },
      },
    })
    const result = person.suffix('male')
    assert.equal(result, 'Test')
  })

  test('returns a female suffix', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        suffix: {
          female: ['Test'],
        },
      },
    })
    const result = person.suffix('female')
    assert.equal(result, 'Test')
  })

  test('uses custom locale for suffixes', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { suffix: { female: ['CustomFemaleSuffix'] } },
    }
    person.locale(customLocale)
    assert.equal(person.suffix('female'), 'CustomFemaleSuffix')
  })

  test('falls back to enLocale if custom locale is incomplete for suffixes', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { suffix: { female: ['CustomFemaleSuffix'] } }, // Male missing
    }
    person.locale(customLocale)
    const result = person.suffix('male')
    assert.include(enLocale.person!.suffix!.general!, result) // enLocale has general suffixes
  })
})

test.group('Person.jobDescriptor()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a default language value', ({ assert }) => {
    const person = new Person()
    const result = person.jobDescriptor()
    assert.typeOf(result, 'string')
    assert.isNotEmpty(result)
    assert.include(enLocale.person!.title!.descriptor, result)
  })

  test('returns a language value', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        title: {
          descriptor: ['Test'],
        },
      },
    })
    const result = person.jobDescriptor()
    assert.equal(result, 'Test')
  })

  test('falls back to enLocale if custom locale is incomplete for jobDescriptor', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { title: { level: ['L'], job: ['J'] } }, // descriptor missing
    }
    person.locale(customLocale)
    const result = person.jobDescriptor()
    assert.include(enLocale.person!.title!.descriptor, result)
  })
})

test.group('Person.jobArea()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a default language value', ({ assert }) => {
    const result = person.jobArea()
    assert.typeOf(result, 'string')
    assert.include(enLocale.person!.title!.level, result)
  })

  test('returns a language value', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        title: {
          level: ['Test'],
        },
      },
    })
    const result = person.jobArea()
    assert.equal(result, 'Test')
  })

  test('falls back to enLocale if custom locale is incomplete for jobArea', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { title: { descriptor: ['D'], job: ['J'] } }, // level missing
    }
    person.locale(customLocale)
    const result = person.jobArea()
    assert.include(enLocale.person!.title!.level, result)
  })
})

test.group('Person.jobType()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a default language value', ({ assert }) => {
    const result = person.jobType()
    assert.typeOf(result, 'string')
    assert.include(enLocale.person!.title!.job, result)
  })

  test('returns a language value', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        title: {
          job: ['Test'],
        },
      },
    })
    const result = person.jobType()
    assert.equal(result, 'Test')
  })

  test('falls back to enLocale if custom locale is incomplete for jobType', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      person: { title: { descriptor: ['D'], level: ['L'] } }, // job missing
    }
    person.locale(customLocale)
    const result = person.jobType()
    assert.include(enLocale.person!.title!.job, result)
  })
})

test.group('Person.jobTitle()', (group) => {
  let person: Person
  group.each.setup(() => {
    person = new Person()
  })

  test('returns a string value', ({ assert }) => {
    const result = person.jobTitle()
    assert.typeOf(result, 'string')
  })

  test('returns a language value', ({ assert }) => {
    const person = new Person()
    person.locale({
      title: 'test',
      person: {
        title: {
          descriptor: ['Dynamic'],
          level: ['Marketing'],
          job: ['Director'],
        },
      },
    })
    const result = person.jobTitle()
    assert.equal(result, 'Dynamic Marketing Director')
  })

  test('falls back for individual parts if custom locale is incomplete', ({ assert }) => {
    person.locale({
      title: 'test',
      person: {
        title: {
          descriptor: ['Dynamic'], // level and job will use enLocale
        },
      },
    })
    const result = person.jobTitle()
    assert.isTrue(result.startsWith('Dynamic '))
    assert.isTrue(result.length > 'Dynamic '.length) // ensure other parts were added
  })
})
