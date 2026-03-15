// Regular Expression Tokenizer
// https://github.com/fent/ret.js

export enum types {
  ROOT = 0,
  GROUP = 1,
  POSITION = 2,
  SET = 3,
  RANGE = 4,
  REPETITION = 5,
  REFERENCE = 6,
  CHAR = 7,
}

export interface Token {
  type: types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
const wordBoundary = (): Token => ({ type: types.POSITION, value: 'b' })
const nonWordBoundary = (): Token => ({ type: types.POSITION, value: 'B' })
const begin = (): Token => ({ type: types.POSITION, value: '^' })
const end = (): Token => ({ type: types.POSITION, value: '$' })

const ints = (): Token[] => [{ type: types.RANGE, from: 48, to: 57 }]
const words = (): Token[] => [
  { type: types.CHAR, value: 95 },
  { type: types.RANGE, from: 97, to: 122 },
  { type: types.RANGE, from: 65, to: 90 },
  ...ints(),
]
const whitespace = (): Token[] => [
  { type: types.CHAR, value: 9 },
  { type: types.CHAR, value: 10 },
  { type: types.CHAR, value: 11 },
  { type: types.CHAR, value: 12 },
  { type: types.CHAR, value: 13 },
  { type: types.CHAR, value: 32 },
  { type: types.CHAR, value: 160 },
  { type: types.CHAR, value: 5760 },
  { type: types.CHAR, value: 6158 },
  { type: types.CHAR, value: 8192 },
  { type: types.CHAR, value: 8193 },
  { type: types.CHAR, value: 8194 },
  { type: types.CHAR, value: 8195 },
  { type: types.CHAR, value: 8196 },
  { type: types.CHAR, value: 8197 },
  { type: types.CHAR, value: 8198 },
  { type: types.CHAR, value: 8199 },
  { type: types.CHAR, value: 8200 },
  { type: types.CHAR, value: 8201 },
  { type: types.CHAR, value: 8202 },
  { type: types.CHAR, value: 8232 },
  { type: types.CHAR, value: 8233 },
  { type: types.CHAR, value: 8239 },
  { type: types.CHAR, value: 8287 },
  { type: types.CHAR, value: 12288 },
  { type: types.CHAR, value: 65279 },
]
const notanychar = (): Token[] => [
  { type: types.CHAR, value: 10 },
  { type: types.CHAR, value: 13 },
  { type: types.CHAR, value: 8232 },
  { type: types.CHAR, value: 8233 },
]

const words_ = (): Token => ({ type: types.SET, set: words(), not: false })
const notWords = (): Token => ({ type: types.SET, set: words(), not: true })
const ints_ = (): Token => ({ type: types.SET, set: ints(), not: false })
const notInts = (): Token => ({ type: types.SET, set: ints(), not: true })
const whitespace_ = (): Token => ({ type: types.SET, set: whitespace(), not: false })
const notWhitespace = (): Token => ({ type: types.SET, set: whitespace(), not: true })
const anyChar = (): Token => ({ type: types.SET, set: notanychar(), not: true })

const specialChars: Record<string, number> = {
  '0': 0,
  't': 9,
  'n': 10,
  'v': 11,
  'f': 12,
  'r': 13,
}

const strToChars = (str: string): string => {
  const chars = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g
  return str.replace(chars, (match, b, s, uh, xh, o, c, sp) => {
    if (s) return match
    const code = b
      ? 8
      : uh
        ? parseInt(uh, 16)
        : xh
          ? parseInt(xh, 16)
          : o
            ? parseInt(o, 8)
            : c
              ? '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?'.indexOf(c)
              : specialChars[sp]
    let ch = String.fromCharCode(code)
    if (/[[{}^$.|?*+()]/.test(ch)) {
      ch = `\\${ch}`
    }
    return ch
  })
}

const tokenizeClass = (str: string, regexpStr: string): [Token[], number] => {
  const tokens: Token[] = []
  const classTokens = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?(.)/g
  let match
  let char
  while ((match = classTokens.exec(str)) !== null) {
    if (match[1]) {
      tokens.push(words_())
    } else if (match[2]) {
      tokens.push(ints_())
    } else if (match[3]) {
      tokens.push(whitespace_())
    } else if (match[4]) {
      tokens.push(notWords())
    } else if (match[5]) {
      tokens.push(notInts())
    } else if (match[6]) {
      tokens.push(notWhitespace())
    } else if (match[7]) {
      tokens.push({
        type: types.RANGE,
        from: (match[8] || match[9]).charCodeAt(0),
        to: match[10].charCodeAt(0),
      })
    } else if ((char = match[12])) {
      tokens.push({ type: types.CHAR, value: char.charCodeAt(0) })
    } else {
      return [tokens, classTokens.lastIndex]
    }
  }
  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unterminated character class`)
}

const error = (regexpStr: string, msg: string): never => {
  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: ${msg}`)
}

export const ret = (regexpStr: string): Token => {
  let i = 0
  const root: Token = { type: types.ROOT, stack: [] }
  let p: Token = root
  let stack: Token[] = root.stack
  const groupStack: Token[] = []

  const repeatErr = (i: number) => error(regexpStr, `Nothing to repeat at column ${i - 1}`)
  const chars = strToChars(regexpStr)

  while (i < chars.length) {
    let c = chars[i++]
    switch (c) {
      case '\\':
        c = chars[i++]
        switch (c) {
          case 'b':
            stack.push(wordBoundary())
            break
          case 'B':
            stack.push(nonWordBoundary())
            break
          case 'w':
            stack.push(words_())
            break
          case 'W':
            stack.push(notWords())
            break
          case 'd':
            stack.push(ints_())
            break
          case 'D':
            stack.push(notInts())
            break
          case 's':
            stack.push(whitespace_())
            break
          case 'S':
            stack.push(notWhitespace())
            break
          default:
            if (/\d/.test(c)) {
              stack.push({ type: types.REFERENCE, value: parseInt(c, 10) })
            } else {
              stack.push({ type: types.CHAR, value: c.charCodeAt(0) })
            }
        }
        break
      case '^':
        stack.push(begin())
        break
      case '$':
        stack.push(end())
        break
      case '[': {
        let not = false
        if (chars[i] === '^') {
          not = true
          i++
        }
        const [set, lastIndex] = tokenizeClass(chars.slice(i), regexpStr)
        i += lastIndex
        stack.push({ type: types.SET, set, not })
        break
      }
      case '.':
        stack.push(anyChar())
        break
      case '(': {
        const group: Token = { type: types.GROUP, stack: [], remember: true }
        if (chars[i] === '?') {
          c = chars[i + 1]
          i += 2
          if (c === '=') {
            group.followedBy = true
          } else if (c === '!') {
            group.notFollowedBy = true
          } else if (c !== ':') {
            error(regexpStr, `Invalid group, character '${c}' after '?' at column ${i - 1}`)
          }
          group.remember = false
        }
        stack.push(group)
        groupStack.push(p)
        p = group
        stack = group.stack
        break
      }
      case ')':
        if (groupStack.length === 0) error(regexpStr, `Unmatched ) at column ${i - 1}`)
        p = groupStack.pop() as Token
        stack = p.options ? p.options[p.options.length - 1] : p.stack
        break
      case '|':
        if (!p.options) {
          p.options = [p.stack]
          delete p.stack
        }
        {
          const newStack: Token[] = []
          p.options.push(newStack)
          stack = newStack
        }
        break
      case '{': {
        const repetition = /^(\d+)(,(\d+)?)?\}/.exec(chars.slice(i))
        if (repetition) {
          if (stack.length === 0) repeatErr(i)
          const min = parseInt(repetition[1], 10)
          const max = repetition[2] ? (repetition[3] ? parseInt(repetition[3], 10) : Infinity) : min
          i += repetition[0].length
          stack.push({ type: types.REPETITION, min, max, value: stack.pop() })
        } else {
          stack.push({ type: types.CHAR, value: 123 })
        }
        break
      }
      case '?':
        if (stack.length === 0) repeatErr(i)
        stack.push({ type: types.REPETITION, min: 0, max: 1, value: stack.pop() })
        break
      case '+':
        if (stack.length === 0) repeatErr(i)
        stack.push({ type: types.REPETITION, min: 1, max: Infinity, value: stack.pop() })
        break
      case '*':
        if (stack.length === 0) repeatErr(i)
        stack.push({ type: types.REPETITION, min: 0, max: Infinity, value: stack.pop() })
        break
      default:
        stack.push({ type: types.CHAR, value: c.charCodeAt(0) })
    }
  }
  if (groupStack.length !== 0) error(regexpStr, 'Unterminated group')
  return root
}
