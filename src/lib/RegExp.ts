import { Types } from './Types.js'
import { ret, Token, types } from './rx/ret.js'
import type { IDataMockInit } from '../Types.js'

export interface RegExpOptions {
  /**
   * The maximum amount of times a repetition like `+` or `{min,}` should be repeated.
   * If the regex enforces its own maximum (e.g. `{1,3}`), that explicit maximum overrides this option
   * if it is smaller.
   * @default 10
   */
  max?: number
  /**
   * Optional regex flags. For example, `'i'` enables case-insensitive generation.
   */
  flags?: string
}

/**
 * Generates pseudo-random strings that match a given regular expression pattern.
 * Uses the deterministic central `Types` generator making it fully seedable.
 */
export class RegExp {
  protected types: Types

  /**
   * Initializes the RegExp generator.
   * @param init The configuration options including the random generator seed.
   */
  constructor(init: IDataMockInit = {}) {
    this.types = new Types(init.seed)
  }

  /**
   * Sets the deterministic seed for the internal random value generator.
   * @param value A numerical seed value.
   */
  seed(value?: number): void {
    this.types.seed(value)
  }

  /**
   * Generates a random string that matches the provided regular expression pattern.
   *
   * @param pattern The regular expression pattern (either a RegExp object or a string).
   * @param options Additional generation options.
   * @returns A randomly produced string fulfilling the constraints of the pattern.
   *
   * @example
   * ```ts
   * const generator = new RegExp();
   * generator.fromPattern(/^[a-z0-9]{5}$/); // e.g. "a1b2c"
   * ```
   */
  fromPattern(pattern: string | globalThis.RegExp, options: RegExpOptions = {}): string {
    let source: string
    let ignoreCase: boolean

    if (pattern instanceof globalThis.RegExp) {
      ignoreCase = pattern.ignoreCase
      source = pattern.source
    } else {
      ignoreCase = options.flags?.includes('i') ?? false
      source = pattern
    }

    let max = 10
    if (typeof options.max === 'number') {
      max = options.max
    }

    const tokens = ret(source)
    const defaultRange = Array.from({ length: 126 - 32 + 1 }, (_, i) => i + 32)
    return this._gen(tokens, [], ignoreCase, defaultRange, max)
  }

  private _gen(
    token: Token,
    groups: (string | null)[],
    ignoreCase: boolean,
    defaultRange: number[],
    max: number
  ): string {
    let stack, str, i, l

    switch (token.type) {
      case types.ROOT:
      case types.GROUP:
        if (token.followedBy || token.notFollowedBy) return ''

        if (token.remember && token.groupNumber === undefined) {
          token.groupNumber = groups.push(null) - 1
        }

        stack = token.options ? this._choice(token.options) : token.stack
        str = ''
        for (i = 0, l = stack.length; i < l; i++) {
          str += this._gen(stack[i], groups, ignoreCase, defaultRange, max)
        }

        if (token.remember) {
          groups[token.groupNumber] = str
        }
        return str

      case types.POSITION:
        return ''

      case types.SET: {
        const set = this._processSet(token, ignoreCase, defaultRange)
        if (!set.length) return ''
        return String.fromCharCode(this._choice(set) as number)
      }
      case types.REPETITION: {
        const repetitionMax = token.max === Infinity ? Math.max(token.min, max) : token.max
        const n = this.types.number({ min: token.min, max: repetitionMax })
        str = ''
        for (i = 0; i < n; i++) {
          str += this._gen(token.value, groups, ignoreCase, defaultRange, max)
        }
        return str
      }
      case types.REFERENCE:
        return groups[token.value - 1] || ''

      case types.CHAR: {
        const code = ignoreCase && this._coin() ? RegExp._toCaseInverse(token.value) : token.value
        return String.fromCharCode(code)
      }
    }
    return ''
  }

  private _processSet(token: Token, ignoreCase: boolean, defaultRange: number[]): number[] {
    if (token.type === types.CHAR) {
      return [token.value]
    }
    if (token.type === types.RANGE) {
      const arr = []
      for (let i = token.from; i <= token.to; i++) {
        arr.push(i)
      }
      return arr
    }

    const set = new Set<number>()
    for (const char of token.set) {
      const sub = this._processSet(char, ignoreCase, defaultRange)
      sub.forEach((c) => set.add(c))
      if (ignoreCase) {
        for (const c of sub) {
          const charCode = c
          const otherCase = RegExp._toCaseInverse(charCode)
          if (charCode !== otherCase) {
            set.add(otherCase)
          }
        }
      }
    }

    if (token.not) {
      return defaultRange.filter((c) => !set.has(c))
    }
    return Array.from(set)
  }

  private static _toCaseInverse(code: number): number {
    if (code >= 97 && code <= 122) return code - 32
    if (code >= 65 && code <= 90) return code + 32
    return code
  }

  private _coin(): boolean {
    return this.types.number({ min: 0, max: 1 }) === 0
  }

  private _choice<T>(choices: T[]): T {
    return choices[this.types.number({ min: 0, max: choices.length - 1 })]
  }
}
