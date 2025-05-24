import { DataMockLocale } from '../locales/Types.js'

export interface IDataMockInit {
  /**
   * The locale to use. By default it loads the `en` locale.
   */
  locale?: DataMockLocale
  seed?: number
}

export interface ITypeNumberInit {
  /**
   * The minimal value to generate (inclusive).
   */
  min?: number
  /**
   * The maximal value to generate (inclusive).
   */
  max?: number
  /**
   * The precision of the generated number.
   */
  precision?: number
}

export interface ITypeDateTimeInit {
  /**
   * The minimal timestamp to generate (inclusive).
   */
  min?: number
  /**
   * The maximal timestamp to generate (inclusive).
   */
  max?: number
}

export interface ITypeBooleanInit {
  /**
   * The likelihood of receiving a true or false value back.
   */
  likelihood?: number
}

export interface ITypeFalsyInit<T = unknown> {
  /**
   * The pool of falsy values to pick from.
   */
  pool?: T[]
}

export interface ITypeCharacterInit {
  /**
   * The casing of the character.
   */
  casing?: 'lower' | 'upper'
  /**
   * The pool of characters to pick from. When set it ignores `alpha`, `numeric`, and `symbols`.
   */
  pool?: string
  /**
   * Whether to include alpha characters in the pool.
   */
  alpha?: boolean
  /**
   * Whether to include numeric characters in the pool.
   */
  numeric?: boolean
  /**
   * Whether to include symbol characters in the pool.
   */
  symbols?: boolean
}

export interface ITypeHashInit {
  /**
   * The casing of the character.
   */
  casing?: 'lower' | 'upper'
  /**
   * The number of characters in the hash.
   */
  length?: number
}

export interface Range {
  min?: number
  max?: number
}

export interface ITypeVersionInit {
  /**
   * The format of the version string.
   * @default symVer
   */
  format?: 'symVer' | 'major' | 'majorMinor'
  /**
   * The range of the major version or the value to use.
   */
  major?: Range | number
  /**
   * The range of the minor version or the value to use.
   */
  minor?: Range | number
  /**
   * The range of the patch version or the value to use.
   */
  patch?: Range | number
}

export interface ILoremSyllableInit {
  /**
   * The number of characters in the word.
   */
  length?: number
  /**
   * Whether to capitalize the text.
   */
  capitalize?: boolean
}

export interface ILoremWordInit extends ILoremSyllableInit {
  /**
   * The number of syllables in the word.
   * Cannot be combined with `length`.
   */
  syllables?: number
}

export interface ILoremSentenceInit {
  /**
   * The number of words in the sentence.
   */
  words?: number
  /**
   * The punctuation mark at the end of the sentence.
   * When set to `false` it does not add the punctuation mark.
   */
  punctuation?: string | boolean
}

export interface ILoremSentencesInit {
  /**
   * The number of sentences in the result.
   */
  size?: number
}

export interface ILoremParagraphInit {
  /**
   * The number of sentences in the result.
   */
  sentences?: number
  /**
   * Whether to separate the sentences with a line break or a space.
   * Default to space.
   */
  lineBreak?: boolean
}

export interface ILoremParagraphsInit {
  /**
   * The number of paragraph in the result.
   */
  size?: number
  /**
   * The separator to use. Default to `\r\n`.
   */
  separator?: string
}

export interface ITimeHourInit {
  /**
   * Whether to use 24hr clock.
   */
  twentyFour?: boolean
  /**
   * The minimum hour
   */
  min?: number
  /**
   * The maximum hour
   */
  max?: number
}

export interface ITimeMinuteInit {
  /**
   * The minimum minute
   */
  min?: number
  /**
   * The maximum minute
   */
  max?: number
}

export interface ITimeMonthInit {
  /**
   * The minimum month, 1-based [1, 12]
   */
  min?: number
  /**
   * The maximum month, 1-based [1, 12]
   */
  max?: number
}

export interface ITimeMonthNameInit extends ITimeMonthInit {
  /**
   * Whether to returns abbreviation rather than the full name.
   */
  abbr?: boolean
}

export interface ITimeWeekdayInit {
  /**
   * The minimum day, 1-based [1, 7]
   */
  min?: number
  /**
   * The maximum day, 1-based [1, 7]
   */
  max?: number
}

export interface ITimeWeekdayNameInit extends ITimeWeekdayInit {
  /**
   * Whether to returns abbreviation rather than the full name.
   */
  abbr?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IInternetUsernameInit extends IPersonName {}

export interface IInternetEmailInit extends IInternetUsernameInit {
  /**
   * Provider name.
   */
  provider?: string
}

export interface IPersonName {
  /**
   * User's first name
   */
  firstName?: string
  /**
   * User's last name
   */
  lastName?: string
}

export interface IPersonNameInit extends IPersonName {
  gender?: Gender
}

export type Gender = 'male' | 'female'

export interface IHttpPayloadInit {
  /**
   * If set the request will not have payload
   */
  noPayload?: boolean
  /**
   * The request always has a payload. The `noPayload` property takes precedence over this setting.
   */
  force?: boolean
  /**
   * The content type to generate the body for.
   * Has no effect when `noPayload` is set.
   */
  contentType?: string
}

export interface IHttpOperationInit {
  /**
   * The list of operations to list from.
   */
  pool?: string[]
  /**
   * When set it will pick operation name from the pool of operations that can carry a payload or not.
   * When not sat at all it will pick a random operation.
   */
  withPayload?: boolean
  /**
   * When set it returns this value as the operation name (HTTP method).
   */
  operation?: string
}

export interface IHttpHeadersInit {
  /**
   * THe pool of header names to use.
   */
  pool?: string[]
  /**
   * The number of headers to generate. Do not mix with `min` and `max`.
   */
  length?: number
  /**
   * The minimal number of headers.
   * @default 0
   */
  min?: number
  /**
   * The maximum number of headers.
   * @default 10
   */
  max?: number
  /**
   * The content type value to add.
   */
  mime?: string
  /**
   * The name of the headers group to include.
   */
  group?: 'general' | 'caching' | 'conditional' | 'content' | 'cookies' | 'cors'
  /**
   * The list of headers may contain a header with the generated multiple values.
   * Each value counts towards the size limit.
   * When this is set this generates the unique number of headers with single values.
   * This does not apply to some content related headers which always have single values.
   */
  noMulti?: boolean
}

export interface IHttpRequestInit {
  headers?: IHttpHeadersInit
  payload?: IHttpPayloadInit
  method?: IHttpOperationInit
}

export interface IHttpRequest {
  /**
   * The generated request URL.
   */
  url: string
  /**
   * The generated request method.
   */
  method: string
  /**
   * The generated list of HTTP headers.
   */
  headers?: string
  /**
   * The generated request message.
   */
  payload?: string
}

export interface IHarTiming {
  blocked: number
  connect: number
  receive: number
  send: number
  wait: number
  dns: number
  ssl?: number
}

export interface IHarTimingInit {
  ssl?: boolean
}

export interface IHttpResponseInit {
  statusGroup?: number
  headers?: IHttpHeadersInit
  payload?: IHttpPayloadInit
}

export interface IHttpResponseData<T = unknown> {
  status: number
  statusText: string
  headers: string
  payload?: T
}

export interface IHttpResponseRedirectStatusInit {
  /**
   * The redirection code. Otherwise a random pick is used
   */
  code?: number
  /**
   * The status message to use.
   */
  status?: string
}

export interface IHttpResponseStatusResult {
  /**
   * The redirection code.
   */
  code: number
  /**
   * The status message.
   */
  status: string
}

export interface ISvgShapeInit {
  /**
   * Shapes stroke.
   * @default to 2.
   */
  stroke?: number
  /**
   * The image opacity.
   * @default 1.0
   */
  opacity?: number
}

export interface ISvgImageInit extends ISvgShapeInit {
  /**
   * The image width.
   * @default to 256.
   */
  width?: number
  /**
   * The image height.
   * @default to 256.
   */
  height?: number
  /**
   * The number of shapes to generate.
   * When this is set then the `maxShapes` is ignored.
   */
  shapes?: number
  /**
   * When `shapes` is not set then this is used to generate a random
   * value of shapes between 1 and `maxShapes`.
   * @default 16
   */
  maxShapes?: number
}

export interface IFormDataTextPartInit {
  /**
   * The mime type of the text part when adding a text part.
   */
  textMime?: string
  /**
   * Makes sure the generated text part is always a text.
   * This also ignores the `textMime` value.
   */
  clearText?: boolean
}

export interface IFormDataPartInit extends IFormDataTextPartInit {
  /**
   * Whether all parts are File parts
   */
  filePart?: boolean
  /**
   * Whether all parts are Text parts
   */
  textPart?: boolean
}

export interface IFormDataInit extends IFormDataPartInit {
  /**
   * The number of pars to add to the form.
   */
  parts?: number
}
