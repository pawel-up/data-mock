import adjective from './adjective.js'
import adverb from './adverb.js'
import conjunction from './conjunction.js'
import interjection from './interjection.js'
import noun from './noun.js'
import preposition from './preposition.js'
import verb from './verb.js'
import { LocaleWord } from '../../Types.js'

const locale: LocaleWord = Object.freeze({
  adjective,
  adverb,
  conjunction,
  interjection,
  noun,
  preposition,
  verb,
})

export default locale
