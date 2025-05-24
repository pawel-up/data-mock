export interface DataMockLocale {
  /**
   * The name of the locale
   */
  title: string
  /**
   * Language syntax.
   */
  syntax?: LocaleSyntax
  /**
   * Date time values.
   */
  time?: LocaleTime
  /**
   * Internet values.
   */
  internet?: LocaleInternet
  /**
   * Person related values.
   */
  person?: LocalePerson
  word?: LocaleWord
}

export interface LocaleSyntax {
  /**
   * The pool of consonants to use when generating words and syllables.
   */
  consonants?: string
  /**
   * The pool of vowels to use when generating words and syllables.
   */
  vowels?: string
}

export interface LocaleTime {
  /**
   * The names of months
   */
  month?: LocaleMonth
  /**
   * The names of days
   */
  weekday?: LocaleWeekday
}

export interface LocaleMonth {
  names: string[]
  abbr: string[]
}

export interface LocaleWeekday {
  names: string[]
  abbr: string[]
}

export interface LocaleEmail {
  free: string[]
  example: string[]
}

export interface LocaleDomain {
  suffix: string[]
}

export interface LocaleInternet {
  email: LocaleEmail
  domain: LocaleDomain
  avatar: string[]
}

export interface LocalePerson {
  gender?: LocaleGender
  firstName?: LocaleFirstName
  /**
   * Optional. If not set it uses `firstName` dictionary.
   */
  middleName?: LocaleFirstName
  lastName?: LocaleGenderPool
  suffix?: LocaleGenderPool
  prefix?: LocaleGenderPool
  title?: LocalePersonTitle
  /**
   * The templates to use to generate full names.
   */
  templates?: string[]
}

export interface LocaleFirstName {
  female: string[]
  male: string[]
}

export interface LocaleGenderPool {
  female?: string[]
  male?: string[]
  /**
   * This must be set when female and male is not set.
   */
  general?: string[]
}

export interface LocaleGender {
  binary: string[]
  pool: string[]
}

export interface LocalePersonTitle {
  descriptor?: string[]
  level?: string[]
  job?: string[]
}

export interface LocaleWord {
  adjective?: string[]
  adverb?: string[]
  conjunction?: string[]
  interjection?: string[]
  noun?: string[]
  preposition?: string[]
  verb?: string[]
}
