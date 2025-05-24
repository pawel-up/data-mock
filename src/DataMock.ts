import enLocale from '../locales/en/index.js'
import { Types } from './lib/Types.js'
import { Lorem } from './lib/Lorem.js'
import { Person } from './lib/Person.js'
import { Internet } from './lib/Internet.js'
import { Random } from './lib/Random.js'
import { Time } from './lib/Time.js'
import { Word } from './lib/Word.js'
import Http from './lib/Http.js'
import { Software } from './lib/Software.js'
import { Svg } from './lib/Svg.js'
import { IDataMockInit } from './Types.js'
import { DataMockLocale } from '../locales/Types.js'

export const localeValue = Symbol('localeValue')

export class DataMock {
  [localeValue]: DataMockLocale
  /**
   * Base types generator.
   */
  types: Types

  /**
   * Person things generator.
   */
  person: Person

  /**
   * Internet things generator.
   */
  internet: Internet

  /**
   * Text generator.
   */
  lorem: Lorem

  /**
   * Random things.
   */
  random: Random

  /**
   * Random time.
   */
  time: Time

  /**
   * Words picker.
   */
  word: Word

  /**
   * HTTP generator
   */
  http: Http

  /**
   * Software related generator.
   */
  software: Software
  /**
   * SVG images and shapes generator.
   */
  svg: Svg

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[localeValue] = init.locale || enLocale
    this.types = new Types(init.seed)
    this.person = new Person({ ...init, locale: this[localeValue] })
    this.internet = new Internet({ ...init, locale: this[localeValue] })
    this.lorem = new Lorem({ ...init, locale: this[localeValue] })
    this.random = new Random()
    this.time = new Time({ ...init, locale: this[localeValue] })
    this.word = new Word({ ...init, locale: this[localeValue] })
    this.http = new Http({ ...init, locale: this[localeValue] })
    this.software = new Software({ ...init, locale: this[localeValue] })
    this.svg = new Svg({ ...init, locale: this[localeValue] })
  }

  seed(value?: number): void {
    this.types.seed(value)
    this.person.seed(value)
    this.internet.seed(value)
    this.lorem.seed(value)
    this.random.seed(value)
    this.time.seed(value)
    this.word.seed(value)
    this.http.seed(value)
    this.software.seed(value)
    this.svg.seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale: DataMockLocale = enLocale): void {
    this[localeValue] = locale
    this.person.locale(locale)
    this.word.locale(locale)
    this.http.locale(locale)
    this.internet.locale(locale)
    this.lorem.locale(locale)
    this.svg.locale(locale)
    this.time.locale(locale)
  }
}
