import { Internet } from '../Internet.js'
import { Lorem } from '../Lorem.js'
import { Random } from '../Random.js'
import { Time } from '../Time.js'
import { Types } from '../Types.js'

export interface GenerateInit {
  time: Time
  random: Random
  types: Types
  lorem: Lorem
  internet: Internet
}

export interface IHeadersSchema {
  group: 'general' | 'caching' | 'conditional' | 'content' | 'cookies' | 'cors' | string
  request: boolean | string[]
  response: boolean | string[]
  enum?: string[]
  generate: (init: GenerateInit) => string
}

export const HeadersSchema: Record<string, IHeadersSchema> = {
  'date': {
    group: 'general',
    request: true,
    response: true,
    generate: (init: GenerateInit): string => {
      const d = init.time.date()
      return d.toUTCString()
    },
  },
  'cache-control': {
    group: 'general,caching',
    request: [
      'max-age={{number}}',
      'max-stale',
      'min-fresh={{number}}',
      'no-cache',
      'no-store',
      'no-transform',
      'only-if-cached',
    ],
    response: [
      'must-revalidate',
      'no-cache',
      'no-store',
      'no-transform',
      'public',
      'private',
      'proxy-revalidate',
      'max-age={{number}}',
      's-maxage={{number}}',
    ],
    generate: (init: GenerateInit): string => {
      const type = init.random.pickOne(['request', 'response']) as keyof IHeadersSchema
      const picks = HeadersSchema['cache-control'][type] as string[]
      const value = init.random.pickOne(picks) as string
      return value.replace('{{number}}', init.types.number({ min: 1, max: 500000 }).toString())
    },
  },
  'connection': {
    group: 'general',
    enum: ['keep-alive', 'close'],
    request: true,
    response: true,
    generate: (init: GenerateInit): string => init.random.pickOne(HeadersSchema.connection.enum!),
  },
  'age': {
    group: 'caching',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => init.types.number({ min: 1, max: 500000 }).toString(),
  },
  'expires': {
    group: 'caching',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => {
      const d = init.time.date()
      return d.toUTCString()
    },
  },
  'pragma': {
    group: 'caching',
    request: false,
    response: true,
    generate: (): string => 'no-cache',
  },
  'last-modified': {
    group: 'conditional',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => {
      const d = init.time.date()
      return d.toUTCString()
    },
  },
  'etag': {
    group: 'conditional',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => `W/${init.types.hash()}`,
  },
  'if-match': {
    group: 'conditional',
    request: true,
    response: false,
    generate: (init: GenerateInit): string => `W/${init.types.hash()}`,
  },
  'if-none-match': {
    group: 'conditional',
    request: true,
    response: false,
    generate: (init: GenerateInit): string => `W/${init.types.hash()}`,
  },
  'if-modified-since': {
    group: 'conditional',
    request: true,
    response: false,
    generate: (init: GenerateInit): string => {
      const d = init.time.date()
      return d.toUTCString()
    },
  },
  'accept': {
    group: 'content',
    request: true,
    response: false,
    enum: ['*/*', 'text/html', 'image/*', 'application/xhtml+xml', 'application/xml;q=0.9', 'application/json'],
    generate: (init: GenerateInit): string => {
      const picks = HeadersSchema.accept.enum!
      return init.random.pickOne(picks)
    },
  },
  'accept-charset': {
    group: 'content',
    request: true,
    response: false,
    enum: ['utf-8', 'iso-8859-1;q=0.5'],
    generate: (init: GenerateInit): string => {
      const picks = HeadersSchema['accept-charset'].enum!
      return init.random.pickOne(picks)
    },
  },
  'accept-encoding': {
    group: 'content',
    request: true,
    response: false,
    enum: ['gzip', 'compress', 'deflate', 'br', 'identity', '*', 'gzip;q=1.0', '*;q=0.5'],
    generate: (init: GenerateInit): string => {
      const picks = HeadersSchema['accept-encoding'].enum!
      return init.random.pickOne(picks)
    },
  },
  'cookie': {
    group: 'cookies',
    request: true,
    response: false,
    generate: (init: GenerateInit): string => {
      const size = init.types.number({ min: 1, max: 4 })
      return new Array(size)
        .fill(0)
        .map(() => `${init.lorem.word()}=${init.lorem.word()}`)
        .join('; ')
    },
  },
  'set-cookie': {
    group: 'cookies',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => {
      const size = init.types.number({ min: 1, max: 4 })
      return new Array(size)
        .fill(0)
        .map(() => `${init.lorem.word()}=${init.lorem.word()}`)
        .join('; ')
    },
  },
  'access-control-allow-origin': {
    group: 'cors',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => (init.types.boolean() ? init.internet.domain() : '*'),
  },
  'origin': {
    group: 'cors',
    request: true,
    response: false,
    generate: (init: GenerateInit): string => (init.types.boolean() ? init.internet.domain() : '*'),
  },
  'content-length': {
    group: 'content',
    request: true,
    response: true,
    generate: (init: GenerateInit): string => init.types.number({ min: 0, max: 1000000 }).toString(),
  },
  'content-type': {
    group: 'content',
    request: true,
    response: true,
    enum: [
      'text/html',
      'image/png',
      'application/xml',
      'application/json',
      'text-plain',
      'application/x-www-form-urlencoded',
    ],
    generate: (init: GenerateInit): string => {
      const picks = HeadersSchema['content-type'].enum!
      return init.random.pickOne(picks)
    },
  },
  'content-encoding': {
    group: 'content',
    request: true,
    response: true,
    enum: ['gzip', 'compress', 'deflate', 'br', 'identity', '*', 'gzip;q=1.0', '*;q=0.5'],
    generate: (init: GenerateInit): string => {
      const picks = HeadersSchema['content-encoding'].enum!
      return init.random.pickOne(picks)
    },
  },
  'transfer-encoding': {
    group: 'content',
    request: false,
    response: true,
    enum: ['chunked', 'compress', 'deflate', 'gzip', 'identity'],
    generate: (init: GenerateInit): string => {
      const picks = HeadersSchema['transfer-encoding'].enum!
      return init.random.pickOne(picks)
    },
  },
  'link': {
    group: 'general',
    request: false,
    response: true,
    generate: (init: GenerateInit): string => {
      const size = init.types.number({ min: 1, max: 4 })
      return new Array(size)
        .fill(0)
        .map(() => `<${init.internet.uri()}>; rel="${init.types.string()}"`)
        .join(', ')
    },
  },
}
