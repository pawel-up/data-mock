import { Types } from '../Types.js'
import { Lorem } from '../Lorem.js'
import HttpPayloadGenerator from './Payload.js'
import { IDataMockInit, IFormDataTextPartInit, IFormDataPartInit, IFormDataInit } from '../../Types.js'
import { DataMockLocale } from '../../../locales/Types.js'

/**
 * Generator of a FormData.
 *
 * Note, this is only available in a browser.
 */
export default class FormDataGenerator {
  protected _types: Types
  protected _lorem: Lorem
  protected _payload: HttpPayloadGenerator

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this._types = new Types(init.seed)
    this._lorem = new Lorem(init)
    this._payload = new HttpPayloadGenerator(init)
  }

  seed(value?: number): void {
    this._types.seed(value)
    this._lorem.seed(value)
    this._payload.seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this._lorem.locale(locale)
    this._payload.locale(locale)
  }

  /**
   * Generates random data as a FormData.
   */
  form(init: IFormDataInit = {}): FormData {
    const { parts = 10 } = init
    const size = this._types.number({ min: 1, max: parts })
    const result = new FormData()
    for (let i = 0; i < size; i++) {
      this.part(result, init)
    }
    return result
  }

  /**
   * Adds a random part to the FormData.
   *
   * @param form The FormData object to add the part to.
   * @param init Optional configuration.
   */
  part(form: FormData, init: IFormDataPartInit = {}): void {
    const { filePart = false, textPart = false } = init
    if (filePart) {
      this.filePart(form)
    } else if (textPart) {
      this.textPart(form, init)
    } else if (this._types.boolean()) {
      this.textPart(form, init)
    } else {
      this.filePart(form)
    }
  }

  /**
   * Adds a random text part to the FormData object.
   * When `textMime` is set then the part is a text added as a Blob with the corresponding mime.
   * When not set then it adds a clear text.
   *
   * @param form The FormData object
   * @param init Optional configuration.
   */
  textPart(form: FormData, init: IFormDataTextPartInit = {}): void {
    const { textMime, clearText } = init
    const name = this._lorem.word()
    if (!clearText && textMime) {
      const body = this._payload.payload(textMime)
      const blob = new Blob([body], { type: textMime })
      form.set(name, blob)
    } else {
      form.set(name, this._lorem.paragraph())
    }
  }

  /**
   * Adds a random File part to the FormData object.
   * @param form The FormData object
   */
  filePart(form: FormData): void {
    const name = this._lorem.word()
    const file = this._lorem.word() + '.txt'
    const body = this._payload.payload()
    const blob = new File([body], file, { type: 'text/plain' })
    form.set(name, blob, file)
  }
}
