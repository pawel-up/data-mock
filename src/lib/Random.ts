import { MersenneTwister } from './MersenneTwister.js'
import * as BasicTypes from './BasicTypes.js'

export const mtValue = Symbol('mtValue')
// const defaultPool = ['a', 'b', 'c', 'd', 'e', 'f'];

export class Random {
  [mtValue]: MersenneTwister

  constructor(seed?: number) {
    this[mtValue] = MersenneTwister.fromSeed(seed)
  }

  seed(value?: number): void {
    this[mtValue] = MersenneTwister.fromSeed(value)
  }

  /**
   * Picks an number of random elements in a random order from an array.
   * @param source The source array. When not set a hexadecimal string part is used.
   * @param count The size of the returned set.
   */
  pick<T>(source: T[], count?: number): T[] {
    let size = count
    if (typeof size !== 'number') {
      size = BasicTypes.number(this[mtValue], { min: 1, max: source.length })
    } else if (size > source.length) {
      size = source.length
    } else if (size < 0) {
      size = 0
    }

    const copy = [...source]
    let i = copy.length
    const min = i - size
    let temp: T
    let index: number

    while (i-- > min) {
      index = Math.floor((i + 1) * BasicTypes.float(this[mtValue], { min: 0, max: 0.99 }))
      temp = copy[index]
      copy[index] = copy[i]
      copy[i] = temp
    }

    return copy.slice(min)
  }

  /**
   * Picks an random element from the source array.
   *
   * @param source The source array. When not set a hexadecimal string part is used.
   */
  pickOne<T>(source: T[]): T {
    const n = BasicTypes.number(this[mtValue], { max: source.length - 1 })
    return source[n]
  }
}
