import { Random } from './Random.js'
import { MersenneTwister } from './MersenneTwister.js'
import * as BasicTypes from './BasicTypes.js'
import { HEX_POOL } from './Utils.js'
import {
  ITypeNumberInit,
  ITypeDateTimeInit,
  ITypeBooleanInit,
  ITypeFalsyInit,
  ITypeCharacterInit,
  ITypeHashInit,
} from '../Types.js'

export const randomValue = Symbol('randomValue')
export const mtValue = Symbol('mtValue')

/**
 * A class that generates different base data types.
 */
export class Types {
  [mtValue]: MersenneTwister;
  [randomValue]: Random

  constructor(seed?: number) {
    this[mtValue] = MersenneTwister.fromSeed(seed)
    this[randomValue] = new Random(seed)
  }

  seed(value?: number): void {
    this[mtValue] = MersenneTwister.fromSeed(value)
    this[randomValue].seed(value)
  }

  /**
   * Generates a pseudo-random number.
   * @param init When passed a number it generates an integer in a range from [0, init]
   * @returns A pseudo-random number.
   */
  number(init: number | ITypeNumberInit = {}): number {
    return BasicTypes.number(this[mtValue], init)
  }

  /**
   * Generates a pseudo-random floating point number.
   * @param init When passed a number it generates an float with this precision
   * @returns number A pseudo-random floating point number.
   */
  float(init: number | ITypeNumberInit = {}): number {
    return BasicTypes.float(this[mtValue], init)
  }

  /**
   * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
   * @returns A random date in a range.
   */
  datetime(init: number | ITypeDateTimeInit = {}): Date {
    return BasicTypes.date(this[mtValue], init)
  }

  /**
   * @param size The size of the random string.
   * @param pool The set of characters to use.
   * @returns The generated random string
   */
  string(size = 10, pool?: string): string {
    return BasicTypes.string(this[mtValue], size, pool)
  }

  character(init: ITypeCharacterInit = {}): string {
    return BasicTypes.character(this[mtValue], init)
  }

  /**
   * @returns Generates a random UUID v4 (rfc4122) string.
   */
  uuid(): string {
    const tpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return tpl.replace(/[xy]/g, (current) => {
      const n = this.number({ min: 0, max: 15 })
      const value = current === 'x' ? n : (n & 0x3) | 0x8
      return value.toString(16)
    })
  }

  /**
   * Generates a random hash value.
   */
  hash(init: ITypeHashInit = {}): string {
    const { length = 40, casing = 'lower' } = init
    const pool = casing === 'upper' ? HEX_POOL.toUpperCase() : HEX_POOL
    return this.string(length, pool)
  }

  /**
   * @param init When number it is the likelihood of receiving a true or false value back.
   * @returns A random boolean value.
   */
  boolean(init: number | ITypeBooleanInit = {}): boolean {
    let opts: ITypeBooleanInit = {}
    if (typeof init === 'number') {
      opts.likelihood = init
    } else if (typeof init === 'object') {
      opts = { ...init }
    }
    if (typeof opts.likelihood === 'undefined') {
      opts.likelihood = BasicTypes.number(this[mtValue], { min: 0, max: 100 })
    }
    if (opts.likelihood < 0 || opts.likelihood > 100) {
      throw new RangeError('Invalid likelihood range. Accepted range is [0, 100].')
    }
    return this[mtValue].real2() * 100 < opts.likelihood
  }

  /**
   * Produces a falsy value.
   */
  falsy<T = false | null | 0 | typeof NaN | ''>(init: ITypeFalsyInit<T> = {}): T {
    const pool = init.pool || [false, null, 0, NaN, '']
    return this[randomValue].pickOne(pool as T[])
  }

  /**
   * @param size The size of the generated hexadecimal string
   * @returns A random hexadecimal string.
   */
  hexaDecimal(size = 1): string {
    const pool = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
    ]
    const generated = this[randomValue].pick(pool, size)
    const value = generated.join('')
    return `0x${value}`
  }
}
