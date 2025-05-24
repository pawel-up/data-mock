import { test } from '@japa/runner'
import { XMLValidator, XMLParser } from 'fast-xml-parser'
import { Svg } from '../../src/lib/Svg.js'

test.group('Svg.image()', () => {
  test('returns a string', ({ assert }) => {
    const generator = new Svg()
    const result = generator.image()
    assert.typeOf(result, 'string')
  })

  test('returns a valid XML', ({ assert }) => {
    const generator = new Svg()
    const xml = generator.image()
    const result = XMLValidator.validate(xml)
    assert.isTrue(result)
  })

  test('has the svg header', ({ assert }) => {
    const generator = new Svg()
    const result = generator.image()
    assert.include(result, '<?xml version="1.0"?>')
  })

  test('has the default width as height', ({ assert }) => {
    const generator = new Svg()
    const result = generator.image()
    assert.include(result, '<svg width="256" height="256">')
  })

  test('has the passed width as height', ({ assert }) => {
    const generator = new Svg()
    const result = generator.image({ width: 100, height: 200 })
    assert.include(result, '<svg width="100" height="200">')
  })

  test('creates the background', ({ assert }) => {
    const generator = new Svg()
    const src = generator.image()
    assert.isTrue(XMLValidator.validate(src), 'is valid XML')
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@',
      preserveOrder: true,
      // attributesGroupName: '@',
    })
    const json = parser.parse(src)
    const [, content] = json
    const [rect] = content.svg

    assert.ok(rect, 'has the rectangle')
    assert.equal(rect[':@']['@width'], '256', 'has the image width')
    assert.equal(rect[':@']['@height'], '256', 'has the image height')
    assert.isNotEmpty(rect[':@']['@fill'], 'has the fill')
    assert.include(rect[':@']['@fill'], '#', 'has the fill')
  })

  test('creates defined number of shapes', ({ assert }) => {
    const generator = new Svg()
    const src = generator.image({ shapes: 6 })
    assert.isTrue(XMLValidator.validate(src), 'is valid XML')
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@',
      preserveOrder: true,
      // attributesGroupName: '@',
    })
    const json = parser.parse(src)
    const [, content] = json
    assert.lengthOf(content.svg, 7, 'the SVG has all shapes')
  })
})
