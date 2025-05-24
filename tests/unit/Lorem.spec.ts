import { test } from '@japa/runner'
import sinon from 'sinon'
import { Lorem, typesValue, randomValue, localeValue } from '../../src/lib/Lorem.js'
import { Types } from '../../src/lib/Types.js'
import { Random } from '../../src/lib/Random.js'
import enLocale from '../../locales/en/index.js'
import { DataMockLocale } from '../../locales/Types.js'

test.group('Lorem', (group) => {
  let sandbox: sinon.SinonSandbox
  let lorem: Lorem

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
    lorem = new Lorem()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('constructor initializes types, random, and locale', ({ assert }) => {
    assert.instanceOf(lorem[typesValue], Types)
    assert.instanceOf(lorem[randomValue], Random)
    assert.deepEqual(lorem[localeValue], enLocale)

    const customLocale: DataMockLocale = { title: 'custom' }
    const loremWithLocale = new Lorem({ locale: customLocale })
    assert.deepEqual(loremWithLocale[localeValue], customLocale)
  })

  test('seed() calls seed on child generators', ({ assert }) => {
    const randomSeedSpy = sandbox.spy(lorem[randomValue], 'seed')
    const typesSeedSpy = sandbox.spy(lorem[typesValue], 'seed')
    const seedValue = 12345

    lorem.seed(seedValue)
    assert.isTrue(randomSeedSpy.calledOnceWithExactly(seedValue))
    assert.isTrue(typesSeedSpy.calledOnceWithExactly(seedValue))

    lorem.seed() // Test with undefined
    assert.isTrue(randomSeedSpy.calledWithExactly(undefined))
    assert.isTrue(typesSeedSpy.calledWithExactly(undefined))
  })

  test('locale() sets the internal locale', ({ assert }) => {
    const customLocale: DataMockLocale = { title: 'custom-lorem-locale' }
    lorem.locale(customLocale)
    assert.deepEqual(lorem[localeValue], customLocale)

    lorem.locale() // Test with undefined, should reset to enLocale
    assert.deepEqual(lorem[localeValue], enLocale)
  })

  test('word() generates a word', ({ assert }) => {
    const syllableStub = sandbox.stub(lorem, 'syllable')
    syllableStub.onCall(0).returns('lo')
    syllableStub.onCall(1).returns('rem')
    syllableStub.onCall(2).returns('ip')
    sandbox.stub(lorem[typesValue], 'number').returns(2) // for syllables count

    const word = lorem.word()
    assert.equal(word, 'lorem') // lo + rem
    assert.isTrue(syllableStub.calledTwice)
  })

  test('word() with length option', ({ assert }) => {
    const syllableStub = sandbox.stub(lorem, 'syllable').returns('syl')
    const word = lorem.word({ length: 5 })
    assert.equal(word, 'sylsy') // syl + syl -> substring(0,5)
    assert.isTrue(syllableStub.calledTwice) // Called until length is met
  })

  test('word() with syllables option', ({ assert }) => {
    const syllableStub = sandbox.stub(lorem, 'syllable').returns('ab')
    const word = lorem.word({ syllables: 3 })
    assert.equal(word, 'ababab')
    assert.isTrue(syllableStub.calledThrice)
  })

  test('word() with capitalize option', ({ assert }) => {
    sandbox.stub(lorem, 'syllable').returns('test')
    sandbox.stub(lorem[typesValue], 'number').returns(1) // 1 syllable
    const word = lorem.word({ capitalize: true })
    assert.equal(word, 'Test')
  })

  test('word() throws if both syllables and length are specified', ({ assert }) => {
    assert.throws(() => lorem.word({ syllables: 2, length: 5 }), /Cannot specify both "syllables" and "length"/)
  })

  test('capitalize() capitalizes a string', ({ assert }) => {
    assert.equal(lorem.capitalize('hello'), 'Hello')
    assert.equal(lorem.capitalize(''), '')
    assert.equal(lorem.capitalize('W'), 'W')
  })

  test('words() generates a space-separated list of words', ({ assert }) => {
    const wordStub = sandbox.stub(lorem, 'word')
    wordStub.onCall(0).returns('one')
    wordStub.onCall(1).returns('two')
    wordStub.onCall(2).returns('three')

    assert.equal(lorem.words(3), 'one two three')
    assert.isTrue(wordStub.calledThrice)

    wordStub.resetHistory()
    wordStub.returns('default')
    lorem.words() // Default length 3
    assert.isTrue(wordStub.calledThrice)
  })

  test('sentence() generates a sentence', ({ assert }) => {
    sandbox.stub(lorem[typesValue], 'number').returns(3) // for word count
    const wordStub = sandbox.stub(lorem, 'word').returns('word')

    const sentence = lorem.sentence()
    assert.equal(sentence, 'Word word word.') // Capitalized, 3 words, default punctuation '.'
    assert.isTrue(wordStub.calledThrice)
  })

  test('sentence() with custom word count and punctuation', ({ assert }) => {
    const wordStub = sandbox.stub(lorem, 'word').returns('test')
    const sentence = lorem.sentence({ words: 2, punctuation: '!' })
    assert.equal(sentence, 'Test test!')
    assert.isTrue(wordStub.calledTwice)
  })

  test('sentence() with punctuation set to false', ({ assert }) => {
    sandbox.stub(lorem[typesValue], 'number').returns(1)
    sandbox.stub(lorem, 'word').returns('word')
    const sentence = lorem.sentence({ punctuation: false })
    assert.equal(sentence, 'Word')
  })

  test('sentence() with invalid punctuation defaults to "."', ({ assert }) => {
    sandbox.stub(lorem[typesValue], 'number').returns(1)
    sandbox.stub(lorem, 'word').returns('word')
    const sentence = lorem.sentence({ punctuation: 'invalid' })
    assert.equal(sentence, 'Word.')
  })

  test('sentences() generates multiple sentences', ({ assert }) => {
    const sentenceStub = sandbox.stub(lorem, 'sentence')
    sentenceStub.onCall(0).returns('First.')
    sentenceStub.onCall(1).returns('Second.')

    // Test with number argument
    assert.equal(lorem.sentences(2), 'First. Second.')
    assert.isTrue(sentenceStub.calledTwice)

    sentenceStub.resetHistory()
    sentenceStub.returns('Default.')
    sandbox.stub(lorem[typesValue], 'number').returns(1) // for sentence count in default
    lorem.sentences() // Default size
    assert.isTrue(sentenceStub.calledOnce)
  })

  test('sentences() with options object', ({ assert }) => {
    const sentenceStub = sandbox.stub(lorem, 'sentence').returns('Sentence.')
    lorem.sentences({ size: 1 })
    assert.isTrue(sentenceStub.calledOnce)
  })

  test('slug() generates a slug', ({ assert }) => {
    const stub = sandbox.stub(lorem, 'words').returns('hello world example')

    const result = lorem.slug(3)
    assert.equal(result, 'hello-world-example')
    assert.isTrue(stub.calledOnceWith(3))
  })

  test('paragraph() generates a paragraph', ({ assert }) => {
    const sentenceStub = sandbox.stub(lorem, 'sentence')
    sentenceStub.onCall(0).returns('Sentence one.')
    sentenceStub.onCall(1).returns('Sentence two.')
    sandbox.stub(lorem[typesValue], 'number').returns(2) // for sentence count

    // Test with number argument
    assert.equal(lorem.paragraph(2), 'Sentence one. Sentence two.')
    assert.isTrue(sentenceStub.calledTwice)

    sentenceStub.resetHistory()
    sentenceStub.returns('Default sentence.')
    lorem.paragraph() // Default sentences
    assert.isTrue(sentenceStub.calledTwice) // because types.number was stubbed to 2
  })

  test('paragraph() with lineBreak option', ({ assert }) => {
    sandbox.stub(lorem, 'sentence').returns('A sentence.')
    sandbox.stub(lorem[typesValue], 'number').returns(2)
    const result = lorem.paragraph({ sentences: 2, lineBreak: true })
    assert.equal(result, 'A sentence.\r\nA sentence.')
  })

  test('paragraphs() generates multiple paragraphs', ({ assert }) => {
    const paragraphStub = sandbox.stub(lorem, 'paragraph')
    paragraphStub.onCall(0).returns('Paragraph 1')
    paragraphStub.onCall(1).returns('Paragraph 2')

    // Test with number argument
    assert.equal(lorem.paragraphs(2), 'Paragraph 1\r\nParagraph 2') // Default separator \r\n
    assert.isTrue(paragraphStub.calledTwice)

    paragraphStub.reset()
    paragraphStub.returns('Default para.')
    sandbox.stub(lorem[typesValue], 'number').returns(1) // for paragraph count in default
    lorem.paragraphs() // Default size
    assert.isTrue(paragraphStub.calledOnce)
  })

  test('paragraphs() with custom separator', ({ assert }) => {
    sandbox.stub(lorem, 'paragraph').returns('P')
    sandbox.stub(lorem[typesValue], 'number').returns(2) // for size
    const result = lorem.paragraphs({ size: 2, separator: '---' })
    assert.equal(result, 'P---P')
  })

  test('syllable() generates a syllable', ({ assert }) => {
    // Mock types.character to control output
    const charStub = sandbox.stub(lorem[typesValue], 'character')
    charStub.onCall(0).returns('b') // consonant
    charStub.onCall(1).returns('a') // vowel
    charStub.onCall(2).returns('t') // consonant
    sandbox.stub(lorem[typesValue], 'number').returns(3) // for length

    const syllable = lorem.syllable()
    assert.equal(syllable, 'bat')
    assert.isTrue(charStub.calledThrice)
    assert.isTrue(
      charStub.getCall(0).calledWithExactly({ pool: enLocale.syntax!.consonants! + enLocale.syntax!.vowels })
    )
    assert.isTrue(charStub.getCall(1).calledWithExactly({ pool: enLocale.syntax!.vowels }))
    assert.isTrue(charStub.getCall(2).calledWithExactly({ pool: enLocale.syntax!.consonants }))
  })

  test('syllable() with custom length and capitalization', ({ assert }) => {
    const charStub = sandbox.stub(lorem[typesValue], 'character')
    charStub.onCall(0).returns('x')
    charStub.onCall(1).returns('y')
    const syllable = lorem.syllable({ length: 2, capitalize: true })
    assert.equal(syllable, 'Xy')
  })

  test('syllable() uses custom locale syntax', ({ assert }) => {
    const customLocale: DataMockLocale = {
      title: 'custom',
      syntax: { consonants: 'xyz', vowels: '123' },
    }
    lorem.locale(customLocale)
    const charStub = sandbox.stub(lorem[typesValue], 'character')
    charStub.onCall(0).returns('x')
    charStub.onCall(1).returns('1')
    sandbox.stub(lorem[typesValue], 'number').returns(2) // length

    const syllable = lorem.syllable()
    assert.equal(syllable, 'x1')
    assert.isTrue(charStub.getCall(0).calledWithExactly({ pool: 'xyz123' }))
    assert.isTrue(charStub.getCall(1).calledWithExactly({ pool: '123' }))
  })

  test('syllable() falls back to enLocale if custom locale syntax is incomplete', ({ assert }) => {
    const customLocale: DataMockLocale = { title: 'custom', syntax: {} } // Missing consonants/vowels
    lorem.locale(customLocale)
    const charStub = sandbox.stub(lorem[typesValue], 'character').returns('a')
    sandbox.stub(lorem[typesValue], 'number').returns(1) // length

    lorem.syllable()
    assert.isTrue(
      charStub.getCall(0).calledWithExactly({ pool: enLocale.syntax!.consonants! + enLocale.syntax!.vowels })
    )

    const customLocale2: DataMockLocale = { title: 'custom', syntax: { consonants: 'b' } } // Missing vowels
    lorem.locale(customLocale2)
    charStub.resetHistory()
    lorem.syllable()
    // First char can be from combined pool, second will try to pick from vowels (which will be enLocale.vowels)
    assert.isTrue(charStub.getCall(0).calledWithExactly({ pool: 'b' + enLocale.syntax!.vowels }))
  })

  test('lorem() calls a random lorem method', ({ assert }) => {
    const pickOneStub = sandbox.stub(lorem[randomValue], 'pickOne')
    const wordStub = sandbox.stub(lorem, 'word').returns('testword')

    pickOneStub.returns('word')
    assert.equal(lorem.lorem(), 'testword')
    assert.isTrue(wordStub.calledOnce)

    const sentenceStub = sandbox.stub(lorem, 'sentence').returns('Test sentence.')
    pickOneStub.returns('sentence')
    assert.equal(lorem.lorem(), 'Test sentence.')
    assert.isTrue(sentenceStub.calledOnce)
  })
})
