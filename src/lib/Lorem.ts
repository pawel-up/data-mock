import { Types } from './Types.js'
import { Random } from './Random.js'
import enLocale from '../../locales/en/index.js'
import { slug } from './Utils.js'
import {
  IDataMockInit,
  ILoremWordInit,
  ILoremSyllableInit,
  ILoremSentenceInit,
  ILoremSentencesInit,
  ILoremParagraphInit,
  ILoremParagraphsInit,
} from '../Types.js'
import { DataMockLocale } from '../../locales/Types.js'

export const randomValue = Symbol('randomValue')
export const typesValue = Symbol('typesValue')
export const localeValue = Symbol('localeValue')

/**
 * A library that specializes in generating string values.
 */
export class Lorem {
  [typesValue]: Types;
  [randomValue]: Random;
  [localeValue]: DataMockLocale
  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[typesValue] = new Types(init.seed)
    this[randomValue] = new Random(init.seed)
    this[localeValue] = init.locale || enLocale
  }

  seed(value?: number): void {
    this[randomValue].seed(value)
    this[typesValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this[localeValue] = locale || enLocale
  }

  word(init: ILoremWordInit = {}): string {
    const opts = { ...init }
    if (typeof opts.syllables === 'number' && typeof opts.length === 'number') {
      throw new RangeError(`Cannot specify both "syllables" and "length".`)
    }
    let result = ''

    if (typeof opts.length === 'number') {
      do {
        result += this.syllable()
      } while (result.length < opts.length)
      result = result.substring(0, opts.length)
    } else {
      const syllables = opts.syllables || this[typesValue].number({ min: 1, max: 3 })
      for (let i = 0; i < syllables; i++) {
        result += this.syllable()
      }
    }
    if (opts.capitalize) {
      result = this.capitalize(result)
    }
    return result
  }

  /**
   * @param input The word to capitalize.
   * @returns Capitalized word.
   */
  capitalize(input: string): string {
    return input.charAt(0).toUpperCase() + input.substr(1)
  }

  /**
   * @returns A space separated list of words.
   */
  words(length = 3): string {
    const result = new Array(length).fill('').map(() => this.word())
    return result.join(' ')
  }

  /**
   * @returns A sentence of words separated with a space.
   */
  sentence(init: ILoremSentenceInit = {}): string {
    const opts: ILoremSentenceInit = { ...init }
    const { words = this[typesValue].number({ min: 12, max: 18 }) } = opts
    let result = new Array(words)
      .fill('')
      .map(() => this.word())
      .join(' ')
    result = this.capitalize(result)
    let { punctuation } = opts
    if (punctuation !== false && !/^[.?;!:]$/.test(String(punctuation))) {
      punctuation = '.'
    }
    if (punctuation) {
      result += punctuation
    }
    return result
  }

  /**
   * @returns Generates sentences.
   */
  sentences(init: ILoremSentencesInit | number = {}): string {
    let opts: ILoremSentencesInit = {}
    if (typeof init === 'number') {
      opts.size = init
    } else {
      opts = { ...init }
    }
    const { size = this[typesValue].number({ min: 2, max: 6 }) } = opts
    const sentences = new Array(size).fill('').map(() => this.sentence())
    return sentences.join(' ')
  }

  /**
   * @param count The number of words in the slug.
   */
  slug(count?: number): string {
    const words = this.words(count)
    return slug(words)
  }

  /**
   * @param init When number then it is a number of sentences in the paragraph.
   * @returns A paragraph of sentences.
   */
  paragraph(init: ILoremParagraphInit | number = {}): string {
    let opts: ILoremParagraphInit = {}
    if (typeof init === 'number') {
      opts.sentences = init
    } else {
      opts = { ...init }
    }
    const { lineBreak, sentences = this[typesValue].number({ min: 3, max: 7 }) } = opts
    const items = new Array(sentences).fill('').map(() => this.sentence())
    return items.join(lineBreak === true ? '\r\n' : ' ')
  }

  /**
   * @returns A number of paragraphs.
   */
  paragraphs(init: ILoremParagraphsInit | number = {}): string {
    let opts: ILoremParagraphsInit = {}
    if (typeof init === 'number') {
      opts.size = init
    } else {
      opts = { ...init }
    }
    const { separator = '\r\n', size = this[typesValue].number({ min: 1, max: 7 }) } = opts
    const items = new Array(size).fill('').map(() => this.paragraph())
    return items.join(separator)
  }

  /**
   * @returns A syllable or a number of syllables.
   */
  syllable(init: ILoremSyllableInit = {}): string {
    const { syntax } = this[localeValue]

    const opts: ILoremSyllableInit = { ...init }
    const length = opts.length || this[typesValue].number({ min: 2, max: 3 })
    const consonants = (syntax && syntax.consonants) || (enLocale.syntax!.consonants as string)
    const vowels = (syntax && syntax.vowels) || (enLocale.syntax!.vowels as string)
    const all = consonants + vowels
    let result = ''
    let chr: string | undefined
    for (let i = 0; i < length; i++) {
      if (i === 0) {
        // First character can be anything
        chr = this[typesValue].character({ pool: all })
      } else if (chr && vowels.includes(chr)) {
        // Last character was a vowel, now we want a consonant
        chr = this[typesValue].character({ pool: consonants })
      } else {
        // Last character was a consonant, now we want a vowel
        chr = this[typesValue].character({ pool: vowels })
      }
      result += chr
    }
    if (opts.capitalize) {
      result = this.capitalize(result)
    }
    return result
  }

  /**
   * @returns A random text based on a random lorem method
   */
  lorem(): string {
    const methods = ['word', 'words', 'sentence', 'sentences', 'paragraph', 'paragraphs']
    const method = this[randomValue].pickOne(methods) as
      | 'word'
      | 'words'
      | 'sentence'
      | 'sentences'
      | 'paragraph'
      | 'paragraphs'
    return this[method]()
  }
}
