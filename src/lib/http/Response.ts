import { Lorem } from '../Lorem.js'
import { Random } from '../Random.js'
import { Types } from '../Types.js'
import HttpHeadersGenerator from './Headers.js'
import HttpPayloadGenerator from './Payload.js'
import {
  IDataMockInit,
  IHttpResponseInit,
  IHttpResponseData,
  IHttpResponseRedirectStatusInit,
  IHttpResponseStatusResult,
  IHttpPayloadInit,
} from '../../Types.js'
import { DataMockLocale } from '../../../locales/Types.js'

export const typesValue = Symbol('typesValue')
export const headersValue = Symbol('headersValue')
export const payloadValue = Symbol('payloadValue')
export const loremValue = Symbol('loremValue')
export const randomValue = Symbol('randomValue')

/**
 * Generates HTTP response data.
 */
export default class ResponseGenerator {
  [headersValue]: HttpHeadersGenerator;
  [payloadValue]: HttpPayloadGenerator;
  [loremValue]: Lorem;
  [typesValue]: Types;
  [randomValue]: Random

  /**
   * @returns The list of status code for a redirect.
   */
  get redirectCodes(): number[] {
    return [301, 302, 303, 307, 308]
  }

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[headersValue] = new HttpHeadersGenerator(init)
    this[payloadValue] = new HttpPayloadGenerator(init)
    this[loremValue] = new Lorem(init)
    this[typesValue] = new Types(init.seed)
    this[randomValue] = new Random(init.seed)
  }

  seed(value?: number): void {
    this[headersValue].seed(value)
    this[payloadValue].seed(value)
    this[typesValue].seed(value)
    this[loremValue].seed(value)
    this[randomValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this[headersValue].locale(locale)
    this[payloadValue].locale(locale)
    this[loremValue].locale(locale)
  }

  /**
   * Generates an HTTP response.
   */
  response(init: IHttpResponseInit = {}): IHttpResponseData {
    const types = this[typesValue]
    const mime = this[headersValue].contentType(init.payload as IHttpPayloadInit)
    const body = this[payloadValue].payload({ ...(init.payload || {}), contentType: mime })
    const headers = this[headersValue].headers('response', mime)
    const statusGroup = init.statusGroup ? init.statusGroup : types.number({ min: 2, max: 5 })
    const sCode = types.number({ min: 0, max: 99 }).toString()
    const code = Number(`${statusGroup}${sCode.padStart(2, '0')}`)
    const status = this[loremValue].word()
    const result: IHttpResponseData = {
      status: code,
      statusText: status,
      headers,
    }
    if (body) {
      result.payload = body
    }
    return result
  }

  /**
   * @param opts Generate data options
   */
  redirectStatus(opts: IHttpResponseRedirectStatusInit = {}): IHttpResponseStatusResult {
    const code = typeof opts.code === 'number' ? opts.code : this[randomValue].pickOne(this.redirectCodes)
    const messages: Record<number, string> = {
      301: 'Moved Permanently',
      302: 'Found',
      303: 'See Other',
      307: 'Temporary Redirect',
      308: 'Permanent Redirect',
    }
    const status = opts.status ? opts.status : messages[code]
    return {
      code,
      status,
    }
  }
}
