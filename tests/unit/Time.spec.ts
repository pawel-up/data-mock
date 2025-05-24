import { test } from '@japa/runner'
import sinon from 'sinon'
import { Time, typesValue, localeValue } from '../../src/lib/Time.js'
import { Types } from '../../src/lib/Types.js'
import enLocale from '../../locales/en/index.js'
import { DataMockLocale } from '../../locales/Types.js'

test.group('Time', (group) => {
  let sandbox: sinon.SinonSandbox

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('constructor initializes types and locale', ({ assert }) => {
    const time = new Time()
    assert.instanceOf(time[typesValue], Types)
    assert.deepEqual(time[localeValue], enLocale)

    const customLocale: DataMockLocale = { title: 'custom' }
    const timeWithLocale = new Time({ locale: customLocale })
    assert.deepEqual(timeWithLocale[localeValue], customLocale)
  })

  test('seed() calls seed on types instance', ({ assert }) => {
    const time = new Time()
    const typesSeedSpy = sandbox.spy(time[typesValue], 'seed')
    const seedValue = 12345

    time.seed(seedValue)
    assert.isTrue(typesSeedSpy.calledOnceWithExactly(seedValue))

    time.seed()
    assert.isTrue(typesSeedSpy.calledWithExactly(undefined))
  })

  test('locale() sets the internal locale', ({ assert }) => {
    const time = new Time()
    const customLocale: DataMockLocale = { title: 'custom-time-locale' }

    time.locale(customLocale)
    assert.deepEqual(time[localeValue], customLocale)

    time.locale()
    assert.deepEqual(time[localeValue], enLocale)
  })

  test('date() calls types.datetime()', ({ assert }) => {
    const time = new Time()
    const datetimeStub = sandbox.stub(time[typesValue], 'datetime').returns(new Date(2023, 0, 1))
    const options = { min: 1000, max: 2000 }

    const resultDate = time.date(options)
    assert.isTrue(datetimeStub.calledOnceWithExactly(options))
    assert.deepEqual(resultDate, new Date(2023, 0, 1))

    time.date()
    assert.isTrue(datetimeStub.calledWithExactly(undefined))
  })

  test('amPm() returns "am" or "pm"', ({ assert }) => {
    const time = new Time()
    const booleanStub = sandbox.stub(time[typesValue], 'boolean')

    booleanStub.returns(true)
    assert.equal(time.amPm(), 'am')

    booleanStub.returns(false)
    assert.equal(time.amPm(), 'pm')
  })

  test('timestamp() returns a valid timestamp', ({ assert }) => {
    const time = new Time()
    const fixedDate = new Date(2023, 5, 15, 10, 30, 0)
    sandbox.stub(time[typesValue], 'datetime').returns(fixedDate)

    const ts = time.timestamp()
    assert.equal(ts, fixedDate.getTime())
  })

  test('hour() generates valid hour values', ({ assert }) => {
    const time = new Time()
    const numberStub = sandbox.stub(time[typesValue], 'number')

    numberStub.returns(5)
    assert.equal(time.hour(), 5) // Default 12-hour
    assert.isTrue(numberStub.calledWithExactly({ min: 1, max: 12 }))

    numberStub.resetHistory()
    numberStub.returns(15)
    assert.equal(time.hour({ twentyFour: true }), 15)
    assert.isTrue(numberStub.calledWithExactly({ min: 0, max: 23 }))

    numberStub.resetHistory()
    numberStub.returns(10)
    assert.equal(time.hour({ min: 8, max: 11 }), 10)
    assert.isTrue(numberStub.calledWithExactly({ min: 8, max: 11 }))

    assert.throws(() => time.hour({ min: -1 }), /Provided value -1 for min is less than 0/)
    assert.throws(() => time.hour({ max: 13 }), /Provided value 13 for max is greater than 12/)
    assert.throws(() => time.hour({ twentyFour: true, max: 24 }), /Provided value 24 for max is greater than 23/)
    assert.throws(() => time.hour({ min: 5, max: 4 }), /The min value \(5\) cannot be greater than max value \(4\)/)
  })

  test('minute() generates valid minute values', ({ assert }) => {
    const time = new Time()
    const numberStub = sandbox.stub(time[typesValue], 'number')

    numberStub.returns(30)
    assert.equal(time.minute(), 30)
    assert.isTrue(numberStub.calledWithExactly({ min: 0, max: 59 }))

    numberStub.resetHistory()
    numberStub.returns(15)
    assert.equal(time.minute({ min: 10, max: 20 }), 15)
    assert.isTrue(numberStub.calledWithExactly({ min: 10, max: 20 }))

    assert.throws(() => time.minute({ min: -1 }), /Provided value -1 for min is less than 0/)
    assert.throws(() => time.minute({ max: 60 }), /Provided value 60 for max is greater than 59/)
    assert.throws(
      () => time.minute({ min: 30, max: 29 }),
      /The min value \(30\) cannot be greater than max value \(29\)/
    )
  })

  test('millisecond() returns a number between 0 and 999', ({ assert }) => {
    const time = new Time()
    const numberStub = sandbox.stub(time[typesValue], 'number')
    numberStub.returns(500)
    assert.equal(time.millisecond(), 500)
    assert.isTrue(numberStub.calledOnceWithExactly({ max: 999 }))
  })

  test('second() returns a number between 0 and 59', ({ assert }) => {
    const time = new Time()
    const numberStub = sandbox.stub(time[typesValue], 'number')
    numberStub.returns(45)
    assert.equal(time.second(), 45)
    assert.isTrue(numberStub.calledOnceWithExactly({ max: 59 }))
  })

  test('month() generates valid month numbers (1-based)', ({ assert }) => {
    const time = new Time()
    const numberStub = sandbox.stub(time[typesValue], 'number')

    numberStub.returns(6) // June
    assert.equal(time.month(), 6)
    assert.isTrue(numberStub.calledWithExactly({ min: 1, max: 12 }))

    numberStub.resetHistory()
    numberStub.returns(3) // March
    assert.equal(time.month({ min: 2, max: 4 }), 3)
    assert.isTrue(numberStub.calledWithExactly({ min: 2, max: 4 }))

    assert.throws(() => time.month({ min: 0 }), /Provided value 0 for min is less than 1/)
    assert.throws(() => time.month({ max: 13 }), /Provided value 13 for max is greater than 12/)
    assert.throws(() => time.month({ min: 7, max: 6 }), /The min value \(7\) cannot be greater than max value \(6\)/)
  })

  test('monthName() returns correct month name', ({ assert }) => {
    const time = new Time()
    sandbox.stub(time, 'month').returns(3) // March

    assert.equal(time.monthName(), 'March')
    assert.equal(time.monthName({ abbr: true }), 'Mar')

    const customLocale: DataMockLocale = {
      title: 'custom',
      time: { month: { names: ['M1', 'M2', 'M3'], abbr: ['m1', 'm2', 'm3'] } },
    }
    time.locale(customLocale)
    assert.equal(time.monthName(), 'M3')
    assert.equal(time.monthName({ abbr: true }), 'm3')
  })

  test('months() returns list of month names', ({ assert }) => {
    const time = new Time()
    assert.deepEqual(time.months(), enLocale.time!.month!.names)
    assert.deepEqual(time.months(true), enLocale.time!.month!.abbr)

    const customNames = ['CustomJan', 'CustomFeb']
    const customAbbr = ['CJ', 'CF']
    const customLocale: DataMockLocale = {
      title: 'custom',
      time: { month: { names: customNames, abbr: customAbbr } },
    }
    time.locale(customLocale)
    assert.deepEqual(time.months(), customNames)
    assert.deepEqual(time.months(true), customAbbr)

    // Fallback
    const incompleteLocale: DataMockLocale = { title: 'incomplete', time: {} }
    time.locale(incompleteLocale)
    assert.deepEqual(time.months(), enLocale.time!.month!.names)

    const incompleteLocale2: DataMockLocale = { title: 'incomplete', time: { month: { names: [], abbr: [] } } }
    time.locale(incompleteLocale2)
    assert.deepEqual(time.months(), enLocale.time!.month!.names)
    assert.deepEqual(time.months(true), enLocale.time!.month!.abbr) // Assuming `time.month.abbr` is `[]`

    // To correctly test fallback, the structure must be missing
    const localeMissingMonth: DataMockLocale = { title: 'missingMonth', time: { weekday: enLocale.time!.weekday } }
    time.locale(localeMissingMonth)
    assert.deepEqual(time.months(), enLocale.time!.month!.names)
    assert.deepEqual(time.months(true), enLocale.time!.month!.abbr)
  })

  test('weekdays() returns list of weekday names', ({ assert }) => {
    const time = new Time()
    assert.deepEqual(time.weekdays(), enLocale.time!.weekday!.names)
    assert.deepEqual(time.weekdays(true), enLocale.time!.weekday!.abbr)

    const customNames = ['CustomMon', 'CustomTue']
    const customAbbr = ['CM', 'CT']
    const customLocale: DataMockLocale = {
      title: 'custom',
      time: { weekday: { names: customNames, abbr: customAbbr } },
    }
    time.locale(customLocale)
    assert.deepEqual(time.weekdays(), customNames)
    assert.deepEqual(time.weekdays(true), customAbbr)

    // Fallback
    const incompleteLocale: DataMockLocale = { title: 'incomplete', time: {} }
    time.locale(incompleteLocale)
    assert.deepEqual(time.weekdays(), enLocale.time!.weekday!.names)

    const localeMissingWeekday: DataMockLocale = { title: 'missingWeekday', time: { month: enLocale.time!.month } }
    time.locale(localeMissingWeekday)
    assert.deepEqual(time.weekdays(), enLocale.time!.weekday!.names)
    assert.deepEqual(time.weekdays(true), enLocale.time!.weekday!.abbr)
  })

  test('weekday() generates valid weekday numbers (1-based)', ({ assert }) => {
    const time = new Time()
    const numberStub = sandbox.stub(time[typesValue], 'number')

    numberStub.returns(3) // Wednesday
    assert.equal(time.weekday(), 3)
    assert.isTrue(numberStub.calledWithExactly({ min: 1, max: 7 }))

    numberStub.resetHistory()
    numberStub.returns(5) // Friday
    assert.equal(time.weekday({ min: 4, max: 6 }), 5)
    assert.isTrue(numberStub.calledWithExactly({ min: 4, max: 6 }))

    assert.throws(() => time.weekday({ min: 0 }), /Provided value 0 for min is less than 1/)
    assert.throws(() => time.weekday({ max: 8 }), /Provided value 8 for max is greater than 7/)
    assert.throws(() => time.weekday({ min: 5, max: 4 }), /The min value \(5\) cannot be greater than max value \(4\)/)
  })

  test('weekdayName() returns correct weekday name', ({ assert }) => {
    const time = new Time()
    sandbox.stub(time, 'weekday').returns(1) // Monday in enLocale

    assert.equal(time.weekdayName(), 'Sunday')
    assert.equal(time.weekdayName({ abbr: true }), 'Sun')

    const customLocale: DataMockLocale = {
      title: 'custom',
      time: { weekday: { names: ['W1', 'W2'], abbr: ['w1', 'w2'] } },
    }
    time.locale(customLocale)
    assert.equal(time.weekdayName(), 'W1')
    assert.equal(time.weekdayName({ abbr: true }), 'w1')
  })

  test('midnight() returns correct midnight timestamp', ({ assert }) => {
    const time = new Time()
    const now = Date.now()
    const expectedMidnightForNow = new Date(now).setHours(0, 0, 0, 0)
    assert.equal(time.midnight(), expectedMidnightForNow)

    const specificTimestamp = new Date(2023, 4, 15, 14, 30, 0).getTime() // May 15, 2023, 14:30:00
    const expectedMidnightForSpecific = new Date(specificTimestamp).setHours(0, 0, 0, 0)
    assert.equal(time.midnight(specificTimestamp), expectedMidnightForSpecific)
  })

  test('dateOnly() returns date in YYYY-MM-DD format', ({ assert }) => {
    const time = new Time()
    const fixedDate = new Date(2023, 0, 5, 10, 20, 30) // Jan 5, 2023
    const dateStub = sandbox.stub(time, 'date').returns(fixedDate)

    assert.equal(time.dateOnly(), '2023-01-05')

    const anotherDate = new Date(2024, 11, 15) // Dec 15, 2024
    dateStub.restore()
    sandbox.stub(time, 'date').returns(anotherDate)
    assert.equal(time.dateOnly(), '2024-12-15')
  })

  test('timeOnly() returns time in HH:mm:ss format', ({ assert }) => {
    const time = new Time()
    const fixedDate = new Date(2023, 0, 5, 7, 8, 9)
    const dateStub = sandbox.stub(time, 'date').returns(fixedDate)

    assert.equal(time.timeOnly(), '07:08:09')

    const anotherDate = new Date(2024, 11, 15, 22, 33, 44)
    dateStub.restore()
    sandbox.stub(time, 'date').returns(anotherDate)
    assert.equal(time.timeOnly(), '22:33:44')
  })

  test('dateTime() returns formatted date-time string', ({ assert }) => {
    const time = new Time()
    // Test with a date that has single digit month/day/hour/minute/second/ms for padding checks
    // UTC: 2023-03-05T08:09:07.005Z
    const fixedDate = new Date(Date.UTC(2023, 2, 5, 8, 9, 7, 5)) // March 5, 2023, 08:09:07.005 UTC
    const dateStub = sandbox.stub(time, 'date').returns(fixedDate)

    // Default RFC3339
    assert.equal(time.dateTime(), '2023-03-05T08:09:07.005Z')
    assert.isTrue(dateStub.calledOnceWithExactly(undefined))

    // RFC3339 explicitly
    dateStub.resetHistory()
    const options = { min: Date.UTC(2000, 0, 1), max: Date.UTC(2001, 0, 1) }
    assert.equal(time.dateTime('rfc3339', options), '2023-03-05T08:09:07.005Z')
    assert.isTrue(dateStub.calledOnceWithExactly(options))

    // RFC2616 (toUTCString)
    dateStub.resetHistory()
    assert.equal(time.dateTime('rfc2616'), fixedDate.toUTCString())
    assert.isTrue(dateStub.calledOnceWithExactly(undefined))

    // Test with another date for toUTCString
    const anotherFixedDate = new Date(Date.UTC(2024, 10, 20, 15, 30, 45, 500)) // Nov 20, 2024, 15:30:45.500 UTC
    dateStub.restore()
    sandbox.stub(time, 'date').returns(anotherFixedDate)

    assert.equal(time.dateTime('rfc3339'), '2024-11-20T15:30:45.500Z')
    assert.equal(time.dateTime('rfc2616'), anotherFixedDate.toUTCString())

    // Test unknown format (though current code returns empty string, it's good to have a placeholder if logic changes)
    // @ts-expect-error Testing invalid format
    assert.equal(time.dateTime('unknown-format'), '')
  })

  test('dateTimeOnly() returns date-time in YYYY-MM-DDTHH:mm:ss format (local time)', ({ assert }) => {
    const time = new Time()
    // Use a local date for this, as getFullYear, getMonth etc. are local time based
    const fixedLocalDate = new Date(2023, 0, 5, 7, 8, 9) // Jan 5, 2023, 07:08:09 Local Time
    const dateStub = sandbox.stub(time, 'date').returns(fixedLocalDate)

    assert.equal(time.dateTimeOnly(), '2023-01-05T07:08:09')

    const anotherLocalDate = new Date(2024, 11, 20, 22, 33, 44) // Dec 20, 2024, 22:33:44 Local Time
    dateStub.restore()
    sandbox.stub(time, 'date').returns(anotherLocalDate)
    assert.equal(time.dateTimeOnly(), '2024-12-20T22:33:44')
  })

  // Specific locale fallback tests for months/weekdays if not covered by general locale test
  test('months() falls back to enLocale if custom locale.time or locale.time.month is missing', ({ assert }) => {
    const time = new Time()

    const localeWithoutTime: DataMockLocale = { title: 'no-time' }
    time.locale(localeWithoutTime)
    assert.deepEqual(time.months(), enLocale.time!.month!.names)
    assert.deepEqual(time.months(true), enLocale.time!.month!.abbr)

    const localeWithoutMonth: DataMockLocale = { title: 'no-month', time: { weekday: enLocale.time!.weekday } }
    time.locale(localeWithoutMonth)
    assert.deepEqual(time.months(), enLocale.time!.month!.names)
    assert.deepEqual(time.months(true), enLocale.time!.month!.abbr)
  })

  test('weekdays() falls back to enLocale if custom locale.time or locale.time.weekday is missing', ({ assert }) => {
    const time = new Time()

    const localeWithoutTime: DataMockLocale = { title: 'no-time' }
    time.locale(localeWithoutTime)
    assert.deepEqual(time.weekdays(), enLocale.time!.weekday!.names)
    assert.deepEqual(time.weekdays(true), enLocale.time!.weekday!.abbr)

    const localeWithoutWeekday: DataMockLocale = { title: 'no-weekday', time: { month: enLocale.time!.month } }
    time.locale(localeWithoutWeekday)
    assert.deepEqual(time.weekdays(), enLocale.time!.weekday!.names)
    assert.deepEqual(time.weekdays(true), enLocale.time!.weekday!.abbr)
  })

  // Test edge case for monthName/weekdayName with out-of-bounds index from month()/weekday() if possible
  // (though month/weekday methods already constrain their output)
  test('monthName() handles month index correctly', ({ assert }) => {
    const time = new Time()
    // month() is stubbed to return a value within [1,12] by its own tests.
    // This test ensures monthName correctly uses that 1-based index.
    const monthStub = sandbox.stub(time, 'month')

    monthStub.returns(1) // January
    assert.equal(time.monthName(), 'January')

    monthStub.returns(12) // December
    assert.equal(time.monthName(), 'December')
  })

  test('weekdayName() handles weekday index correctly', ({ assert }) => {
    const time = new Time()
    // weekday() is stubbed to return a value within [1,7] by its own tests.
    // This test ensures weekdayName correctly uses that 1-based index.
    const weekdayStub = sandbox.stub(time, 'weekday')

    // The locale uses the US convention where Sunday is 1 and Saturday is 7
    weekdayStub.returns(1) // Sunday
    assert.equal(time.weekdayName(), 'Sunday')

    weekdayStub.returns(7) // Saturday
    assert.equal(time.weekdayName(), 'Saturday')
  })
})
