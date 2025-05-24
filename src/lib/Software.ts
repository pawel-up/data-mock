import { Random } from './Random.js'
import { Types } from './Types.js'
import { IDataMockInit, ITypeVersionInit } from '../Types.js'

export const typesValue = Symbol('typesValue')
export const randomValue = Symbol('randomValue')

export class Software {
  [typesValue]: Types;
  [randomValue]: Random
  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[typesValue] = new Types(init.seed)
    this[randomValue] = new Random(init.seed)
  }

  seed(value?: number): void {
    this[typesValue].seed(value)
    this[randomValue].seed(value)
  }

  /**
   * @returns The version name.
   */
  version(init: ITypeVersionInit = {}): string {
    const { format = 'symVer' } = init
    switch (format) {
      case 'symVer':
        return this.symVersion(init)
      case 'major':
        return this.majorVersion(init)
      case 'majorMinor':
        return this.majorMinorVersion(init)
      default:
        throw new RangeError(`Invalid version format: ${format}`)
    }
  }

  /**
   * @returns Semantic versioning version name.
   */
  symVersion(init: ITypeVersionInit = {}): string {
    const { patch = {} } = init
    const result = this.majorMinorVersion(init)
    let patchValue: number
    if (typeof patch === 'number') {
      patchValue = patch
    } else {
      const { min = 0, max = 100 } = patch
      patchValue = this[typesValue].number({ min, max })
    }
    return `${result}.${patchValue}`
  }

  /**
   * @returns Major and minor only version name.
   */
  majorMinorVersion(init: ITypeVersionInit = {}): string {
    const { minor = {} } = init
    let minorValue: number
    if (typeof minor === 'number') {
      minorValue = minor
    } else {
      const { min = 0, max = 100 } = minor
      minorValue = this[typesValue].number({ min, max })
    }
    const major = this.majorVersion(init)
    return `${major}.${minorValue}`
  }

  /**
   * @returns Major only version name.
   */
  majorVersion(init: ITypeVersionInit = {}): string {
    const { major = {} } = init
    let majorValue: number
    if (typeof major === 'number') {
      majorValue = major
    } else {
      const { min = 0, max = 100 } = major
      majorValue = this[typesValue].number({ min, max })
    }
    return `${majorValue}`
  }

  /**
   * @returns The pre-release version name.
   */
  preVersion(init: ITypeVersionInit = {}): string {
    const version = this.version(init)
    const suffixes = ['pre', 'alpha', 'beta', 'dev']
    const suffix = this[randomValue].pickOne(suffixes)
    return `${version}-${suffix}`
  }
}
