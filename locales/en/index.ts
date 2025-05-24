import time from './time/index.js'
import syntax from './syntax/index.js'
import internet from './internet/index.js'
import person from './person/index.js'
import word from './word/index.js'
import { DataMockLocale } from '../Types.js'

const locale: DataMockLocale = Object.freeze({
  title: 'English',
  syntax,
  time,
  internet,
  person,
  word,
})

export default locale
