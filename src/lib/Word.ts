import { Random } from './Random.js'
import enLocale from '../../locales/en/index.js'
import { IDataMockInit } from '../Types.js'
import { DataMockLocale } from '../../locales/Types.js'

function getListItem(random: Random, list: string[], size?: number): string {
  let items = list
  if (typeof size === 'number') {
    items = items.filter((i) => i.length === size)
  }
  if (!items.length) {
    items = list
  }
  return random.pickOne(items)
}

export const randomValue = Symbol('randomValue')
export const localeValue = Symbol('localeValue')

/**
 * A library that specializes in picking words from locale dictionary.
 */
export class Word {
  [randomValue]: Random;
  [localeValue]: DataMockLocale

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[randomValue] = new Random(init.seed)
    this[localeValue] = init.locale || enLocale
  }

  seed(value?: number): void {
    this[randomValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this[localeValue] = locale || enLocale
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked adjective.
   */
  adjective(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.adjective) || enLocale.word!.adjective!
    return getListItem(this[randomValue], list, size)
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked adverb.
   */
  adverb(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.adverb) || enLocale.word!.adverb!
    return getListItem(this[randomValue], list, size)
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked conjunction.
   */
  conjunction(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.conjunction) || enLocale.word!.conjunction!
    return getListItem(this[randomValue], list, size)
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked interjection.
   */
  interjection(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.interjection) || enLocale.word!.interjection!
    return getListItem(this[randomValue], list, size)
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked noun.
   */
  noun(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.noun) || enLocale.word!.noun!
    return getListItem(this[randomValue], list, size)
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked preposition.
   */
  preposition(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.preposition) || enLocale.word!.preposition!
    return getListItem(this[randomValue], list, size)
  }

  /**
   * @param size The length of the word. When not found it uses the whole pool defined in the lang dictionary.
   * @returns A randomly picked verb.
   */
  verb(size?: number): string {
    const { word } = this[localeValue]
    const list = (word && word.verb) || enLocale.word!.verb!
    return getListItem(this[randomValue], list, size)
  }
}
