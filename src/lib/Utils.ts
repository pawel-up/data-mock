export const NUMBERS = '0123456789'
export const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz'
export const CHARS_UPPER = CHARS_LOWER.toUpperCase()
export const HEX_POOL = `${NUMBERS}abcdef`

/**
 * @returns Slug from the input.
 */
export function slug(input = ''): string {
  return input.replace(/ /g, '-').replace(/[^一-龠ぁ-ゔァ-ヴー\w.-]+/g, '')
}

/**
 * Transforms ASCII string to buffer.
 */
export function strToBuffer(asciiString: string): Uint8Array {
  return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)))
}

/**
 * Converts incoming data to base64 string.
 * @returns Safe to store string.
 */
export function bufferToBase64(buffer: ArrayBufferLike): string {
  const bytes = new Uint8Array(buffer)
  return btoa(String.fromCharCode(...bytes))
}

/**
 * Converts base64 string to Uint8Array.
 * @returns Restored array view.
 */
export function base64ToBuffer(str: string): Uint8Array {
  const asciiString = atob(str)
  return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)))
}
