import { Types } from './Types.js'
import { Random } from './Random.js'
import enLocale from '../../locales/en/index.js'
import { Person } from './Person.js'
import { HEX_POOL } from './Utils.js'
import { Word } from './Word.js'
import { IDataMockInit, IInternetEmailInit, IInternetUsernameInit } from '../Types.js'
import { DataMockLocale } from '../../locales/Types.js'

export const randomValue = Symbol('randomValue')
export const typesValue = Symbol('typesValue')
export const localeValue = Symbol('localeValue')
export const wordValue = Symbol('wordValue')
export const personValue = Symbol('personValue')

/**
 * A library that specializes in generating internet related values.
 */
export class Internet {
  [typesValue]: Types;
  [randomValue]: Random;
  [personValue]: Person;
  [wordValue]: Word;
  [localeValue]: DataMockLocale

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[typesValue] = new Types(init.seed)
    this[randomValue] = new Random(init.seed)
    this[personValue] = new Person(init)
    this[wordValue] = new Word(init)
    this[localeValue] = init.locale || enLocale
  }

  seed(value?: number): void {
    this[randomValue].seed(value)
    this[typesValue].seed(value)
    this[personValue].seed(value)
    this[wordValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale: DataMockLocale = enLocale): void {
    this[localeValue] = locale
    this[personValue].locale(locale)
    this[wordValue].locale(locale)
  }

  /**
   * @return A random URL for an avatar.
   */
  avatar(): string {
    const { internet } = this[localeValue]
    let pool: string[]
    if (internet && internet.avatar && internet.avatar.length > 0) {
      pool = internet.avatar
    } else {
      pool = enLocale.internet!.avatar
    }
    const pic = this[randomValue].pickOne(pool)
    return `https://cdn.fakercloud.com/avatars/${pic}`
  }

  /**
   * @returns generated user email
   */
  email(init: IInternetEmailInit = {}): string {
    const { internet } = this[localeValue]
    let pool: string[]
    if (internet && internet.email && internet.email.free && internet.email.free.length > 0) {
      pool = internet.email.free
    } else {
      pool = enLocale.internet!.email.free
    }
    const provider = init.provider || this[randomValue].pickOne(pool)
    const username = this.userName(init).toLowerCase()
    const result = `${username}@${provider}`
    return result
  }

  /**
   * @returns Generated email for an example domain.
   */
  exampleEmail(init: IInternetUsernameInit = {}): string {
    const { internet } = this[localeValue]
    let pool: string[]
    if (internet && internet.email && internet.email.example && internet.email.example.length > 0) {
      pool = internet.email.example
    } else {
      pool = enLocale.internet!.email.example
    }
    const provider = this[randomValue].pickOne(pool)
    return this.email({ ...init, provider })
  }

  /**
   * @returns Generated username.
   */
  userName(init: IInternetUsernameInit = {}): string {
    const { firstName = this[personValue].firstName(), lastName = this[personValue].lastName() } = init
    let result: string | undefined
    switch (this[typesValue].number(2)) {
      case 0:
        result = firstName + this[typesValue].number(99)
        break
      case 1:
        result = firstName + this[randomValue].pickOne(['.', '_']) + lastName
        break
      case 2:
        result = firstName + this[randomValue].pickOne(['.', '_']) + lastName + this[typesValue].number(99)
        break
      default:
    }
    result = String(result).toString().replace(/'/g, '')
    result = result.replace(/ /g, '')
    return result
  }

  /**
   * @returns Pick a protocol.
   */
  protocol(): string {
    const pool = ['http', 'https']
    return this[randomValue].pickOne(pool)
  }

  /**
   * @param withPayload Whether the request can have a payload (body) or not.
   * When not set it returns one of all possible.
   * @returns Pick on of a default HTTP methods.
   */
  httpMethod(withPayload?: boolean): string {
    const payload = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    const nonPayload = ['GET', 'HEAD']
    if (typeof withPayload === 'boolean') {
      const pool = withPayload ? payload : nonPayload
      return this[randomValue].pickOne(pool)
    }
    return this[randomValue].pickOne(payload.concat(nonPayload))
  }

  /**
   * @returns A random URI.
   */
  uri(): string {
    const protocol = this.protocol()
    const domain = this.domain()
    return `${protocol}://${domain}`
  }

  /**
   * @returns A random domain.
   */
  domain(): string {
    const name = this.domainName()
    const suffix = this.domainSuffix()
    return `${name}.${suffix}`
  }

  /**
   * @returns A random name for a domain.
   */
  domainName(): string {
    const adjective = this[wordValue].adjective()
    const noun = this[wordValue].noun()
    const name = `${adjective}-${noun}`
    return name.replace(/([\\~#&*{}/:<>?|"'])/gi, '').toLowerCase()
  }

  /**
   * @returns A random suffix for a domain.
   */
  domainSuffix(): string {
    const { internet } = this[localeValue]
    let pool: string[]
    if (internet && internet.domain && internet.domain.suffix && internet.domain.suffix.length > 0) {
      pool = internet.domain.suffix
    } else {
      pool = enLocale.internet!.domain.suffix
    }
    return this[randomValue].pickOne(pool)
  }

  /**
   * @returns A random IP address
   */
  ip(): string {
    const randNum = (): string => this[typesValue].number(255).toFixed(0)
    const result = []
    for (let i = 0; i < 4; i++) {
      result[i] = randNum()
    }
    return result.join('.')
  }

  /**
   * @returns A random v6 IP address
   */
  ipv6(): string {
    const pool = HEX_POOL.split('')
    const randHash = (): string => this[randomValue].pick(pool, 4).join('')
    const result = []
    for (let i = 0; i < 8; i++) {
      result[i] = randHash()
    }
    return result.join(':')
  }

  /**
   * @returns A random port number;
   */
  port(): number {
    return this[typesValue].number({ min: 0, max: 65535 })
  }

  color(red = 0, green = 0, blue = 0): string {
    // based on awesome response: http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
    const redValue = Math.floor((this[typesValue].number(256) + red) / 2)
    const greenValue = Math.floor((this[typesValue].number(256) + green) / 2)
    const blueValue = Math.floor((this[typesValue].number(256) + blue) / 2)
    let redStr = redValue.toString(16)
    if (redStr.length === 1) {
      redStr = `0${redStr}`
    }
    let greenStr = greenValue.toString(16)
    if (greenStr.length === 1) {
      greenStr = `0${greenStr}`
    }
    let blueStr = blueValue.toString(16)
    if (blueStr.length === 1) {
      blueStr = `0${blueStr}`
    }
    return `#${redStr}${greenStr}${blueStr}`
  }

  /**
   * @returns A web browser name.
   */
  browser(): string {
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Internet Explorer', 'Opera', 'SeaMonkey']
    return this[randomValue].pickOne(browsers)
  }
}
