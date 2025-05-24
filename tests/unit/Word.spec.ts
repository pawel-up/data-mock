import { test } from '@japa/runner'
import { Word } from '../../src/lib/Word.js'
import en from '../../locales/en/index.js'

test.group('Word.adjective()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.adjective()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.adjective()
    assert.include(en.word!.adjective, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        adjective: ['Test'],
      },
    })
    const result = word.adjective()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.adjective()
    assert.include(en.word!.adjective, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.adjective(6)
    assert.lengthOf(result, 6)
  })
})

test.group('Word.adverb()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.adverb()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.adverb()
    assert.include(en.word!.adverb, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        adverb: ['Test'],
      },
    })
    const result = word.adverb()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.adverb()
    assert.include(en.word!.adverb, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.adverb(6)
    assert.lengthOf(result, 6)
  })
})

test.group('Word.conjunction()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.conjunction()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.conjunction()
    assert.include(en.word!.conjunction, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        conjunction: ['Test'],
      },
    })
    const result = word.conjunction()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.conjunction()
    assert.include(en.word!.conjunction, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.conjunction(6)
    assert.lengthOf(result, 6)
  })
})

test.group('Word.interjection()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.interjection()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.interjection()
    assert.include(en.word!.interjection, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        interjection: ['Test'],
      },
    })
    const result = word.interjection()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.interjection()
    assert.include(en.word!.interjection, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.interjection(6)
    assert.lengthOf(result, 6)
  })
})

test.group('Word.noun()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.noun()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.noun()
    assert.include(en.word!.noun, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        noun: ['Test'],
      },
    })
    const result = word.noun()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.noun()
    assert.include(en.word!.noun, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.noun(6)
    assert.lengthOf(result, 6)
  })
})

test.group('Word.preposition()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.preposition()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.preposition()
    assert.include(en.word!.preposition, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        preposition: ['Test'],
      },
    })
    const result = word.preposition()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.preposition()
    assert.include(en.word!.preposition, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.preposition(6)
    assert.lengthOf(result, 6)
  })
})

test.group('Word.verb()', () => {
  test('returns a string', ({ assert }) => {
    const word = new Word()
    const result = word.verb()
    assert.typeOf(result, 'string')
  })

  test('returns a default language value', ({ assert }) => {
    const word = new Word()
    const result = word.verb()
    assert.include(en.word!.verb, result)
  })

  test('returns a language value', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {
        verb: ['Test'],
      },
    })
    const result = word.verb()
    assert.equal(result, 'Test')
  })

  test('fallbacks to the default when language does not support', ({ assert }) => {
    const word = new Word()
    word.locale({
      title: 'test',
      word: {},
    })
    const result = word.verb()
    assert.include(en.word!.verb, result)
  })

  test('returns a word with a size', ({ assert }) => {
    const word = new Word()
    const result = word.verb(6)
    assert.lengthOf(result, 6)
  })
})
