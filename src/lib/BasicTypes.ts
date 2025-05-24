import { CHARS_LOWER, CHARS_UPPER, NUMBERS } from './Utils.js'
import { MersenneTwister } from './MersenneTwister.js'
import { ITypeNumberInit, ITypeCharacterInit, ITypeDateTimeInit } from '../Types.js'

/**
 * Generates a pseudo-random number.
 * @param init When passed a number it generates an integer in a range from [0, init]
 * @returns A pseudo-random number.
 */
export function number(mt: MersenneTwister, init: number | ITypeNumberInit = {}): number {
  let opts: ITypeNumberInit = {}
  if (typeof init === 'number') {
    opts.max = init
  } else if (typeof init === 'object') {
    opts = { ...init }
  }
  if (typeof opts.min !== 'number') {
    opts.min = 0
  }
  if (typeof opts.max !== 'number') {
    opts.max = 99999
  }
  if (typeof opts.precision !== 'number') {
    opts.precision = 1
  }
  if (opts.max > 0) {
    opts.max += opts.precision
  }
  let random = Math.floor(mt.random(opts.max / opts.precision, opts.min / opts.precision))
  if (opts.precision === 1) {
    return random
  }
  random /= 1 / opts.precision
  return random
}

/**
 * Generates a pseudo-random floating point number.
 * @param init When passed a number it generates an float with this precision
 * @returns A pseudo-random floating point number.
 */
export function float(mt: MersenneTwister, init: number | ITypeNumberInit = {}): number {
  let opts: ITypeNumberInit = {}
  if (typeof init === 'number') {
    opts.precision = init
  } else if (typeof init === 'object') {
    opts = { ...init }
  }
  if (typeof opts.precision !== 'number') {
    opts.precision = 0.01
  }
  return number(mt, opts)
}

/**
 * @param size The size of the random string.
 * @param chars The set of characters to use.
 * @returns The generated random string
 */
export function string(mt: MersenneTwister, size = 10, chars?: string): string {
  let len = size
  const max = 2 ** 20
  if (len >= max) {
    len = max
  }
  const pool = typeof chars === 'string' ? chars : CHARS_UPPER + CHARS_LOWER
  const numberInit = {
    min: 0,
    max: pool.length - 1,
  }
  const generated = new Array(size).fill('').map(() => pool[number(mt, numberInit)])
  return generated.join('')
}

export function character(mt: MersenneTwister, init: ITypeCharacterInit = {}): string {
  const opts: ITypeCharacterInit = { ...init }
  let letters: string
  switch (opts.casing) {
    case 'lower':
      letters = CHARS_LOWER
      break
    case 'upper':
      letters = CHARS_UPPER
      break
    default:
      letters = CHARS_LOWER + CHARS_UPPER
  }
  if (!opts.pool) {
    opts.pool = ''
    const symbols = '!@#$%^&*()[]'
    if (opts.alpha) {
      opts.pool += letters
    }
    if (opts.numeric) {
      opts.pool += NUMBERS
    }
    if (opts.symbols) {
      opts.pool += symbols
    }
    if (!opts.pool) {
      opts.pool = `${letters}${NUMBERS}${symbols}`
    }
  }
  return opts.pool.charAt(number(mt, opts.pool.length - 1))
}

/**
 * @param init When passed a number it generates an date in a range from [since 1. Jan 1970 UTC, init]
 * @returns A random date in a range.
 */
export function date(mt: MersenneTwister, init: number | ITypeDateTimeInit = {}): Date {
  let opts: ITypeDateTimeInit = {}
  if (typeof init === 'number') {
    opts.max = init
  } else if (typeof init === 'object') {
    opts = { ...init }
  }
  const minMax = 8640000000000000
  if (typeof opts.min !== 'number' || opts.min < minMax * -1) {
    opts.min = new Date().setFullYear(1970, 1, 1)
  }
  if (typeof opts.max !== 'number' || opts.max > minMax) {
    opts.max = new Date().setFullYear(2100, 1, 1)
  }
  const random = number(mt, opts)
  return new Date(random)
}
