import { test } from '@japa/runner'
import sinon from 'sinon'
import Http from '../../../src/lib/Http.js'
import { DataMockLocale } from '../../../locales/Types.js'

test.group('Http.formData', () => {
  test('filePart() adds a part', ({ assert }) => {
    const http = new Http()
    const fd = new FormData()
    http.formData.filePart(fd)
    let addedName: string | undefined
    let addedFile: File | undefined
    let size = 0
    for (const [name, value] of fd.entries()) {
      size += 1
      addedName = name
      addedFile = value as File
    }
    assert.equal(size, 1, 'has one file')
    assert.typeOf(addedName, 'string', 'has file name')
    assert.typeOf(addedFile, 'file', 'has the file')
    assert.isAbove(addedFile!.size, 0, 'the file has a content')
    assert.isNotEmpty(addedFile!.name, 'the file has the name')
  })

  test('textPart() adds a clear text part', ({ assert }) => {
    const http = new Http()
    const fd = new FormData()
    http.formData.textPart(fd, { clearText: true })
    let addedName: string | undefined
    let addedText: string | undefined
    let size = 0
    for (const [name, value] of fd.entries()) {
      size += 1
      addedName = name
      addedText = value as string
    }
    assert.equal(size, 1, 'has one file')
    assert.typeOf(addedName, 'string', 'has file name')
    assert.typeOf(addedText, 'string', 'has the contents')
  })

  test('textPart() adds a blob text part', ({ assert }) => {
    const http = new Http()
    const fd = new FormData()
    http.formData.textPart(fd, { textMime: 'application/json' })
    let addedName: string | undefined
    let addedValue: Blob | undefined
    let size = 0
    for (const [name, value] of fd.entries()) {
      size += 1
      addedName = name
      addedValue = value as Blob
    }
    assert.equal(size, 1, 'has one file')
    assert.typeOf(addedName, 'string', 'has file name')
    assert.typeOf(addedValue, 'file', 'has the contents')
  })

  test('form() returns the form', ({ assert }) => {
    const http = new Http()
    const result = http.formData.form()
    assert.typeOf(result, 'FormData')
  })

  test('form() adds parts', ({ assert }) => {
    const http = new Http()
    const fd = http.formData.form()
    let size = 0
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of fd.entries()) {
      size += 1
    }
    assert.isAbove(size, 0)
  })

  test('form() adds file parts only', ({ assert }) => {
    const http = new Http()
    const fd = http.formData.form({ filePart: true, parts: 5 })
    for (const [, file] of fd.entries()) {
      assert.typeOf(file, 'File')
    }
  })

  test('form() adds text parts only', ({ assert }) => {
    const http = new Http()
    const fd = http.formData.form({ parts: 5, textPart: true, clearText: true })
    for (const [, file] of fd.entries()) {
      assert.typeOf(file, 'string')
    }
  })
})

test.group('Http.formData.locale()', (group) => {
  let sandbox: sinon.SinonSandbox

  group.each.setup(() => {
    sandbox = sinon.createSandbox()
  })

  group.each.teardown(() => {
    sandbox.restore()
  })

  test('calls locale on child generators with a locale object', ({ assert }) => {
    const http = new Http()
    const formDataGenerator = http.formData
    const mockLocale: DataMockLocale = { title: 'test-fd-locale' }

    const loremSpy = sandbox.spy(formDataGenerator['_lorem'], 'locale')
    const payloadSpy = sandbox.spy(formDataGenerator['_payload'], 'locale')

    formDataGenerator.locale(mockLocale)

    assert.isTrue(loremSpy.calledOnceWithExactly(mockLocale))
    assert.isTrue(payloadSpy.calledOnceWithExactly(mockLocale))
  })

  test('calls locale on child generators with undefined', ({ assert }) => {
    const http = new Http()
    const formDataGenerator = http.formData
    const loremSpy = sandbox.spy(formDataGenerator['_lorem'], 'locale')
    const payloadSpy = sandbox.spy(formDataGenerator['_payload'], 'locale')
    formDataGenerator.locale() // Call with no arguments
    assert.isTrue(loremSpy.calledOnceWithExactly(undefined))
    assert.isTrue(payloadSpy.calledOnceWithExactly(undefined))
  })
})
