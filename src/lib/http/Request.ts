import { Internet } from '../Internet.js'
import { Random } from '../Random.js'
import HttpHeadersGenerator from './Headers.js'
import HttpPayloadGenerator from './Payload.js'
import { IDataMockInit, IHttpRequestInit, IHttpRequest, IHttpOperationInit, IHttpPayloadInit } from '../../Types.js'
import { DataMockLocale } from '../../../locales/Types.js'

export default class RequestGenerator {
  get payloadOperations(): string[] {
    return ['POST', 'PUT', 'DELETE', 'OPTIONS']
  }

  get nonPayloadOperations(): string[] {
    return ['GET', 'HEAD']
  }

  protected _internet: Internet
  protected _random: Random
  protected _headers: HttpHeadersGenerator
  protected _payload: HttpPayloadGenerator

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this._internet = new Internet(init)
    this._random = new Random(init.seed)

    this._headers = new HttpHeadersGenerator(init)
    this._payload = new HttpPayloadGenerator(init)
  }

  seed(value?: number): void {
    this._internet.seed(value)
    this._random.seed(value)
    this._headers.seed(value)
    this._payload.seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this._headers.locale(locale)
    this._payload.locale(locale)
    this._internet.locale(locale)
  }

  /**
   * @returns Generates HTTP request,
   */
  request(init: IHttpRequestInit = {}): IHttpRequest {
    const payloadInit = init.payload || undefined

    const withPayload = this._payload.isPayload(payloadInit)
    const method = this.method({ ...init.method, withPayload })
    const contentType = this._headers.contentType(payloadInit as IHttpPayloadInit)
    const headers = this._headers.headers('request', {
      mime: contentType,
    })
    const result: IHttpRequest = {
      url: this._internet.uri(),
      method,
      headers,
    }
    if (contentType) {
      result.payload = this._payload.payload(contentType)
    }
    return result
  }

  /**
   * Creates a random GET request.
   * @param {IHttpRequestInit=} [init={}]
   */
  get(init: IHttpRequestInit = {}): IHttpRequest {
    const opts: IHttpRequestInit = { ...init }
    opts.method = { ...(opts.method || {}), operation: 'GET' }
    opts.payload = { ...(opts.payload || {}), noPayload: true }
    return this.request(opts)
  }

  /**
   * Creates a random POST request.
   */
  post(init: IHttpRequestInit = {}): IHttpRequest {
    const opts: IHttpRequestInit = { ...init }
    opts.method = { ...(opts.method || {}), operation: 'POST' }
    opts.payload = { ...(opts.payload || {}), force: true }
    return this.request(opts)
  }

  /**
   * Creates a random PUT request.
   */
  put(init: IHttpRequestInit = {}): IHttpRequest {
    const opts: IHttpRequestInit = { ...init }
    opts.method = { ...(opts.method || {}), operation: 'PUT' }
    opts.payload = { ...(opts.payload || {}), force: true }
    return this.request(opts)
  }

  /**
   * Creates a random DELETE request.
   */
  delete(init: IHttpRequestInit = {}): IHttpRequest {
    const opts: IHttpRequestInit = { ...init }
    opts.method = { ...(opts.method || {}), operation: 'DELETE' }
    return this.request(opts)
  }

  method(init: IHttpOperationInit = {}): string {
    if (init.operation) {
      return init.operation
    }
    if (init.pool) {
      return this._random.pickOne(init.pool)
    }
    if (typeof init.withPayload === 'boolean') {
      const pool = init.withPayload ? this.payloadOperations : this.nonPayloadOperations
      return this._random.pickOne(pool)
    }
    return this._random.pickOne(this.payloadOperations.concat(this.nonPayloadOperations))
  }
}
