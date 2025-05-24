import HttpHeadersGenerator from './http/Headers.js'
import HttpPayloadGenerator from './http/Payload.js'
import ResponseGenerator from './http/Response.js'
import FormDataGenerator from './http/FormData.js'
import RequestGenerator from './http/Request.js'
import { IDataMockInit } from '../Types.js'
import { DataMockLocale } from '../../locales/Types.js'

export default class Http {
  request: RequestGenerator
  headers: HttpHeadersGenerator
  payload: HttpPayloadGenerator
  response: ResponseGenerator
  formData: FormDataGenerator

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this.headers = new HttpHeadersGenerator(init)
    this.payload = new HttpPayloadGenerator(init)
    this.response = new ResponseGenerator(init)
    this.formData = new FormDataGenerator(init)
    this.request = new RequestGenerator(init)
  }

  seed(value?: number): void {
    this.headers.seed(value)
    this.payload.seed(value)
    this.response.seed(value)
    this.formData.seed(value)
    this.request.seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this.headers.locale(locale)
    this.payload.locale(locale)
    this.response.locale(locale)
    this.request.locale(locale)
  }
}
