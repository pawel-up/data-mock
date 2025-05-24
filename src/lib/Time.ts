import { Types } from './Types.js'
import enLocale from '../../locales/en/index.js'
import {
  IDataMockInit,
  ITypeDateTimeInit,
  ITimeHourInit,
  ITimeMinuteInit,
  ITimeMonthInit,
  ITimeMonthNameInit,
  ITimeWeekdayInit,
} from '../Types.js'
import type { DataMockLocale, LocaleMonth, LocaleWeekday } from '../../locales/Types.js'

export const typesValue = Symbol('typesValue')
export const localeValue = Symbol('localeValue')

/**
 * Generates date/time related values.
 */
export class Time {
  [typesValue]: Types;
  [localeValue]: DataMockLocale
  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[typesValue] = new Types(init.seed)
    this[localeValue] = init.locale || enLocale
  }

  seed(value?: number): void {
    this[typesValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this[localeValue] = locale || enLocale
  }

  /**
   * @link {Types.datetime()}
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A random date in a range.
   */
  date(init?: ITypeDateTimeInit): Date {
    return this[typesValue].datetime(init)
  }

  /**
   * @returns Randomly selected `am` or `pm` value.
   */
  amPm(): string {
    return this[typesValue].boolean() ? 'am' : 'pm'
  }

  /**
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A timestamp for the generated date.
   */
  timestamp(init?: ITypeDateTimeInit): number {
    const d = this[typesValue].datetime(init)
    return d.getTime()
  }

  /**
   * Note, in 24hr clock the generated value for an hour that is less than 10 will be missing zero in the fist position.
   * @returns The value for an hour.
   */
  hour(init: ITimeHourInit = {}): number {
    const opts = { ...init }
    if (typeof opts.min !== 'number') {
      opts.min = opts.twentyFour ? 0 : 1
    }
    if (typeof opts.max !== 'number') {
      opts.max = opts.twentyFour ? 23 : 12
    }
    if (opts.min < 0) {
      throw new RangeError(`Provided value ${opts.min} for min is less than 0.`)
    }
    if ((opts.max > 23 && opts.twentyFour) || (opts.max > 12 && !opts.twentyFour)) {
      throw new RangeError(`Provided value ${opts.max} for max is greater than ${opts.twentyFour ? 23 : 12}.`)
    }
    if (opts.min > opts.max) {
      throw new RangeError(`The min value (${opts.min}) cannot be greater than max value (${opts.max}).`)
    }
    return this[typesValue].number({ min: opts.min, max: opts.max })
  }

  /**
   * Note, the generated value that is less than 10 will be missing zero in the fist position.
   * @returns The value for a minute.
   */
  minute(init: ITimeMinuteInit = {}): number {
    const { min = 0, max = 59 } = init
    if (min < 0) {
      throw new RangeError(`Provided value ${min} for min is less than 0.`)
    }
    if (max > 59) {
      throw new RangeError(`Provided value ${max} for max is greater than 59.`)
    }
    if (min > max) {
      throw new RangeError(`The min value (${min}) cannot be greater than max value (${max}).`)
    }
    return this[typesValue].number({ min, max })
  }

  /**
   * @return Random value for milliseconds.
   */
  millisecond(): number {
    return this[typesValue].number({ max: 999 })
  }

  /**
   * @return Random value for seconds.
   */
  second(): number {
    return this[typesValue].number({ max: 59 })
  }

  /**
   * @returns The number of the month, 1-based.
   */
  month(init: ITimeMonthInit = {}): number {
    const { min = 1, max = 12 } = init
    if (min < 1) {
      throw new RangeError(`Provided value ${min} for min is less than 1.`)
    }
    if (max > 12) {
      throw new RangeError(`Provided value ${max} for max is greater than 12.`)
    }
    if (min > max) {
      throw new RangeError(`The min value (${min}) cannot be greater than max value (${max}).`)
    }
    return this[typesValue].number({ min, max })
  }

  /**
   * @returns Name of the month.
   */
  monthName(init: ITimeMonthNameInit = {}): string {
    const index = this.month(init)
    const items = this.months(init.abbr)
    return items[index - 1]
  }

  /**
   * @param abbr Whether to returns abbreviated values.
   * @returns The list of month names.
   */
  months(abbr = false): string[] {
    const { time } = this[localeValue]
    let dictionary: LocaleMonth
    if (time && time.month && time.month.abbr && time.month.abbr.length > 0) {
      dictionary = time.month
    } else {
      dictionary = enLocale.time!.month!
    }
    return abbr ? dictionary.abbr : dictionary.names
  }

  /**
   * @param abbr Whether to returns abbreviated values.
   * @returns The list of week day names.
   */
  weekdays(abbr = false): string[] {
    const { time } = this[localeValue]
    let dictionary: LocaleWeekday
    if (time && time.weekday && time.weekday.abbr && time.weekday.abbr.length > 0) {
      dictionary = time.weekday
    } else {
      dictionary = enLocale.time!.weekday!
    }
    return abbr ? dictionary.abbr : dictionary.names
  }

  /**
   * @returns The number of the weekday, 1-based.
   */
  weekday(init: ITimeWeekdayInit = {}): number {
    const { min = 1, max = 7 } = init
    if (min < 1) {
      throw new RangeError(`Provided value ${min} for min is less than 1.`)
    }
    if (max > 7) {
      throw new RangeError(`Provided value ${max} for max is greater than 7.`)
    }
    if (min > max) {
      throw new RangeError(`The min value (${min}) cannot be greater than max value (${max}).`)
    }
    return this[typesValue].number({ min, max })
  }

  /**
   * @returns The name of the weekday. Note, `en` locale starts the week on Monday.
   */
  weekdayName(init: ITimeMonthNameInit = {}): string {
    const index = this.weekday(init)
    const items = this.weekdays(init.abbr)
    return items[index - 1]
  }

  /**
   * Sets a midnight on the timestamp.
   * @param time The timestamp to use. When not set it computes the midnight of today.
   * @returns The timestamp of the midnight of the given time.
   */
  midnight(time = Date.now()): number {
    const now = new Date(time)
    now.setHours(0, 0, 0, 0)
    return now.getTime()
  }

  /**
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A random date in the range and `YYYY-MM-DD` format.
   */
  dateOnly(init?: ITypeDateTimeInit): string {
    const d = this.date(init)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A random time in the range and `HH-mm-ss` format.
   */
  timeOnly(init?: ITypeDateTimeInit): string {
    const d = this.date(init)
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  /**
   * @param format The data time format
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A random date time in the range and format specified by the `format` argument.
   */
  dateTime(format: 'rfc3339' | 'rfc2616' = 'rfc3339', init?: ITypeDateTimeInit): string {
    const d = this.date(init)
    if (format === 'rfc2616') {
      return d.toUTCString()
    }
    if (format === 'rfc3339') {
      const year = d.getUTCFullYear()
      const month = (d.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = d.getUTCDate().toString().padStart(2, '0')
      const hours = d.getUTCHours().toString().padStart(2, '0')
      const minutes = d.getUTCMinutes().toString().padStart(2, '0')
      const seconds = d.getUTCSeconds().toString().padStart(2, '0')
      const milliseconds = d.getUTCMilliseconds().toString().padStart(3, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
    }
    return ''
  }

  /**
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A random date time in the range and `YYYY-MM-DDTHH-mm-ss` format.
   */
  dateTimeOnly(init?: ITypeDateTimeInit): string {
    const d = this.date(init)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }
}
