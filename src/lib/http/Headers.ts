import { Random } from '../Random.js'
import { Types } from '../Types.js'
import { HeadersSchema, IHeadersSchema, GenerateInit } from './HeadersSchema.js'
import { Time } from '../Time.js'
import { Lorem } from '../Lorem.js'
import { Internet } from '../Internet.js'
import { IDataMockInit, IHttpHeadersInit, IHttpPayloadInit } from '../../Types.js'
import { DataMockLocale } from '../../../locales/Types.js'

export const randomValue = Symbol('randomValue')
export const internetValue = Symbol('internetValue')
export const typesValue = Symbol('typesValue')
export const timeValue = Symbol('timeValue')
export const loremValue = Symbol('loremValue')
export const getInit = Symbol('getInit')
export const collectHeaders = Symbol('collectHeaders')

const singularHeaders = [
  'content-type',
  `content-length`,
  `content-encoding`,
  `transfer-encoding`,
  'origin',
  'etag',
  'last-modified',
  'expires',
  'age',
  'connection',
  'date',
]

export default class HttpHeadersGenerator {
  [randomValue]: Random;
  [typesValue]: Types;
  [timeValue]: Time;
  [loremValue]: Lorem;
  [internetValue]: Internet

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[randomValue] = new Random(init.seed)
    this[typesValue] = new Types(init.seed)
    this[timeValue] = new Time(init)
    this[loremValue] = new Lorem(init)
    this[internetValue] = new Internet(init)
  }

  seed(value?: number): void {
    this[randomValue].seed(value)
    this[typesValue].seed(value)
    this[timeValue].seed(value)
    this[loremValue].seed(value)
    this[internetValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this[loremValue].locale(locale)
    this[internetValue].locale(locale)
  }

  [getInit](): GenerateInit {
    return {
      time: this[timeValue],
      random: this[randomValue],
      types: this[typesValue],
      lorem: this[loremValue],
      internet: this[internetValue],
    }
  }

  /**
   * Generates a content type header for the given payload options.
   */
  contentType(init: IHttpPayloadInit): string | undefined

  /**
   * Generates a random content type header
   */
  contentType(): string

  contentType(init?: IHttpPayloadInit): string | undefined {
    if (init === undefined) {
      return this._pickContentType()
    }
    if (init.noPayload) {
      return undefined
    }
    if (init.contentType) {
      return init.contentType
    }
    return this._pickContentType()
  }

  _pickContentType(): string {
    return HeadersSchema['content-type'].generate(this[getInit]())
  }

  /**
   * Note, the returned value may contain duplicates. In such case the generated list of headers
   * is the same as size but a header can have multiple values.
   *
   * Note, invalid configuration may lead to an infinity loop. This may happen when pool is set with the size
   * that exceed pool size and the pool contains headers that have only singular values.
   *
   * @param type Either `request` or `response`
   * @param size The number of requests to return.
   * @param group The name of the headers group
   * @param pool The pool of header names to choose from.
   * @returns The list of header names from the `HeadersSchema` object to use.
   */
  [collectHeaders](
    type: 'request' | 'response',
    size: number,
    group?: string,
    pool: string[] = [],
    noMulti = false
  ): string[] {
    let candidateKeys = Object.keys(HeadersSchema).filter((name) => {
      if (!HeadersSchema[name][type]) {
        return false
      }
      if (group) {
        const hGroup = HeadersSchema[name].group
        if (!hGroup) {
          return false
        }
        const groups = hGroup.split(',').map((i) => i.trim())
        return groups.includes(group)
      }
      return true
    })

    if (pool && pool.length > 0) {
      candidateKeys = candidateKeys.filter((name) => pool.includes(name))
    }

    if (candidateKeys.length === 0) {
      throw new Error(`Invalid configuration. Unable to produce headers candidates.`)
    }
    let keeper = 0
    const maxLoop = size * 10
    const result: string[] = []
    while (result.length < size) {
      keeper++
      if (maxLoop && keeper > maxLoop) {
        throw new Error(`Invalid configuration. Unable to produce a list of headers.`)
      }
      const name = this[randomValue].pickOne(candidateKeys)
      if (noMulti && result.includes(name)) {
        continue
      }
      if (singularHeaders.includes(name) && result.includes(name)) {
        continue
      }
      result.push(name)
    }
    return result
  }

  /**
   * Generates a list of request or response headers.
   * @param type Either `request` or `response`
   */
  headers(type: 'request' | 'response', init: IHttpHeadersInit = {}): string {
    const { group, length, max = 10, min = 0, mime, pool, noMulti } = init

    const addContentType = !!mime
    const size = typeof length === 'number' ? length : this[typesValue].number({ min, max })

    const names = this[collectHeaders](type, size, group, pool, noMulti)
    if (addContentType && names.includes('content-type')) {
      const index = names.indexOf('content-type')
      names.splice(index, 1)
    }

    const headersMap: Record<string, string> = {}
    const generatorOptions = this[getInit]()
    names.forEach((name) => {
      const info: IHeadersSchema = HeadersSchema[name]
      const value = info.generate(generatorOptions)
      if (headersMap[name]) {
        const separator = name === 'cookie' ? ';' : ','
        headersMap[name] += `${separator} ${value}`
      } else {
        headersMap[name] = value
      }
    })
    let result = Object.keys(headersMap)
      .map((key) => `${key}: ${headersMap[key]}`)
      .join('\n')
    if (addContentType) {
      if (result) {
        result += `\n`
      }
      result += `content-type: ${mime}`
    }
    return result
  }

  /**
   * @returns A value for the `location` header
   */
  link(): string {
    return HeadersSchema.link.generate(this[getInit]())
  }
}
