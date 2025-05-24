import { Creator, Browser } from 'har-format'
import { Internet } from './Internet.js'
import { Lorem } from './Lorem.js'
import { Random } from './Random.js'
import { Software } from './Software.js'
import { Time } from './Time.js'
import { Types } from './Types.js'
import { IDataMockInit, IHarTiming, IHarTimingInit } from '../Types.js'
import { DataMockLocale } from '../../locales/Types.js'

export const typesValue = Symbol('typesValue')
export const randomValue = Symbol('randomValue')
export const internetValue = Symbol('internetValue')
export const loremValue = Symbol('loremValue')
export const timeValue = Symbol('timeValue')
export const softwareValue = Symbol('softwareValue')

/**
 * Generates data related to the HAR specification.
 */
export class Har {
  [typesValue]: Types;
  [randomValue]: Random;
  [loremValue]: Lorem;
  [internetValue]: Internet;
  [timeValue]: Time;
  [softwareValue]: Software
  /**
   * @param init The library init options.
   */
  constructor(init: IDataMockInit = {}) {
    this[typesValue] = new Types(init.seed)
    this[randomValue] = new Random(init.seed)
    this[loremValue] = new Lorem(init)
    this[internetValue] = new Internet(init)
    this[timeValue] = new Time(init)
    this[softwareValue] = new Software(init)
  }

  seed(value?: number): void {
    this[typesValue].seed(value)
    this[randomValue].seed(value)
    this[loremValue].seed(value)
    this[internetValue].seed(value)
    this[timeValue].seed(value)
    this[softwareValue].seed(value)
  }

  /**
   * @param locale The locale to set. When nothing is passed then it uses the default locale.
   */
  locale(locale?: DataMockLocale): void {
    this[loremValue].locale(locale)
    this[internetValue].locale(locale)
  }

  timing(init: IHarTimingInit = {}): IHarTiming {
    const types = this[typesValue]
    const result: IHarTiming = {
      blocked: types.number({ min: 0, max: 100 }),
      connect: types.number({ min: 0, max: 100 }),
      receive: types.number({ min: 0, max: 100 }),
      send: types.number({ min: 0, max: 100 }),
      wait: types.number({ min: 0, max: 100 }),
      dns: types.number({ min: 0, max: 100 }),
    }
    if (init.ssl) {
      result.ssl = types.number({ min: 0, max: 100 })
    }
    return result
  }

  /**
   * @return The version of the HAR spec.
   */
  version(): string {
    return '1.2'
  }

  /**
   * @returns the HAR's creator info.
   */
  creator(): Creator {
    const name = this[loremValue].word()
    const version = this[softwareValue].majorMinorVersion()
    const comment = this[loremValue].paragraph()
    return {
      name,
      version,
      comment,
    }
  }

  /**
   * @returns the HAR's browser info.
   */
  browser(): Browser {
    const name = this[internetValue].browser()
    const version = this[softwareValue].majorMinorVersion()
    const comment = this[loremValue].paragraph()
    return {
      name,
      version,
      comment,
    }
  }
}
