import { Internet } from './Internet.js'
import { Types } from './Types.js'
import { IDataMockInit, ISvgImageInit, ISvgShapeInit } from '../Types.js'
import { DataMockLocale } from '../../locales/Types.js'

/**
 * SVG image generator
 */
export class Svg {
  private _internet: Internet
  private _types: Types

  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this._internet = new Internet(init)
    this._types = new Types(init.seed)
  }

  seed(value?: number): void {
    this._internet.seed(value)
    this._types.seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this._internet.locale(locale)
  }

  image(init: ISvgImageInit = {}): string {
    const { width = 256, height = 256 } = init
    const background = this._internet.color()
    const size = this._getShapesCount(init)

    let result = '<?xml version="1.0"?>'
    result += `<svg width="${width}" height="${height}">`
    result += `<rect height="${height}" width="${width}" fill="${background}"/>`
    const shapes = new Array(size).fill(0).map(() => this.shape(width, height, init))
    result += shapes.join('')
    result += '</svg>'
    return result
  }

  protected _getShapesCount(init: ISvgImageInit): number {
    const { shapes, maxShapes = 16 } = init
    if (typeof shapes === 'number') {
      return shapes
    }
    return this._types.number({ min: 1, max: maxShapes })
  }

  /**
   * Generates a random SVG shape.
   *
   * @param maxWidth The image width which is the shape's max width
   * @param maxHeight The image height which is the shape's max height
   * @param init Other configuration options.
   * @returns
   */
  shape(maxWidth: number, maxHeight: number, init: ISvgShapeInit = {}): string {
    const { opacity = 1, stroke = 2 } = init
    const type = this._types.number({ min: 0, max: 3 })
    let result = ''

    if (type === 0) {
      const width = this._types.number({ min: 1, max: maxWidth / 2 })
      const height = this._types.number({ min: 1, max: maxWidth / 2 })
      const x = this._types.number({ min: 1, max: maxWidth })
      const y = this._types.number({ min: 1, max: maxHeight })
      result = `<rect x="${x}" y="${y}" width="${width}" height="${height}"`
    } else if (type === 1) {
      const x = this._types.number({ min: 1, max: maxWidth })
      const y = this._types.number({ min: 1, max: maxHeight })
      const radiusMaxSize = Math.min(maxWidth, maxHeight) / 4
      const r = this._types.number({ min: 1, max: radiusMaxSize })
      result = `<circle cx="${x}" cy="${y}" r="${r}"`
    } else if (type === 2) {
      const x = this._types.number({ min: 1, max: maxWidth })
      const y = this._types.number({ min: 1, max: maxHeight })
      const rx = this._types.number({ min: 1, max: maxWidth / 2 })
      const ry = this._types.number({ min: 1, max: maxHeight / 2 })
      result = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"`
    } else {
      result = `<polyline points="`
      const size = this._types.number({ min: 1, max: this._types.number({ min: 0, max: 6 }) + 3 })
      const points: string[] = []
      for (let i = 0; i < size; i++) {
        const x = this._types.number({ min: 1, max: maxWidth })
        const y = this._types.number({ min: 1, max: maxHeight })
        points.push(`${x} ${y}`)
      }
      result += points.join(', ')
      result += '"'
    }

    const color = this._internet.color()
    if (this._types.number({ min: 0, max: 2 }) === 0 && type !== 3) {
      result += ` fill="${color}" fill-opacity="${opacity}"/>`
    } else {
      result += ` fill="none" stroke-width="${stroke}"`
      result += ` stroke="${color}" stroke-opacity="${opacity}"/>`
    }
    return result
  }
}
