/**
 @license  
  A C-program for MT19937, with initialization improved 2002/1/26.
  Coded by Takuji Nishimura and Makoto Matsumoto.
  Before using, initialize the state by using init_genrand(seed)
  or init_by_array(init_key, key_length).
  Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
  All rights reserved.
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions
  are met:
  1. Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
  3. The names of its contributors may not be used to endorse or promote
  products derived from this software without specific prior written
  permission.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
  A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  Any feedback is very welcome.
  http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
  email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

export const nValue = Symbol('nValue')
export const mValue = Symbol('mValue')
export const matrixAValue = Symbol('matrixAValue')
export const upperMaskValue = Symbol('upperMaskValue')
export const lowerMaskValue = Symbol('lowerMaskValue')
export const mtValue = Symbol('mtValue')
export const mtiValue = Symbol('mtiValue')
export const instancesValue = Symbol('instancesValue')

export class MersenneTwister {
  static [instancesValue] = new Map();

  [nValue] = 624;
  [mValue] = 397;
  /** constant vector a */
  [matrixAValue] = 0x9908b0df;
  /** most significant w-r bits */
  [upperMaskValue] = 0x80000000;
  /** least significant r bits */
  [lowerMaskValue] = 0x7fffffff;
  /**
   * the array for the state vector
   */
  [mtValue]: number[] = new Array(this[nValue]);
  /** mti==N + 1 means mt[N] is not initialized */
  [mtiValue] = this[nValue] + 1

  constructor(seed: number = MersenneTwister.seedFn()) {
    this.initGenRand(seed)
  }

  static seedFn(): number {
    return Math.floor(Math.random() * 10 ** 13)
  }

  /**
   * Creates a new instance of the MersenneTwister class or re-uses existing instance for a given seed.
   * It's the preferred way to as a memory optimisation use to create as little instances as possible.
   */
  static fromSeed(seed: number = MersenneTwister.seedFn()): MersenneTwister {
    if (this[instancesValue].has(seed)) {
      return this[instancesValue].get(seed)
    }
    const instance = new MersenneTwister(seed)
    this[instancesValue].set(seed, instance)
    return instance
  }

  /**
   * initializes mt[N] with a seed
   */
  initGenRand(seed: number): void {
    let value = seed
    this[mtValue][0] = value >>> 0

    for (this[mtiValue] = 1; this[mtiValue] < this[nValue]; this[mtiValue]++) {
      value = this[mtValue][this[mtiValue] - 1] ^ (this[mtValue][this[mtiValue] - 1] >>> 30)
      this[mtValue][this[mtiValue]] =
        ((((value & 0xffff0000) >>> 16) * 1812433253) << 16) + (value & 0x0000ffff) * 1812433253 + this[mtiValue]
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this[mtValue][this[mtiValue]] >>>= 0
      /* for >32 bit machines */
    }
  }

  /**
   * Initializes by an array with array-length
   * @param key the array for initializing keys
   * @param length the array for initializing keys
   */
  initByArray(key: number[], length: number): void {
    let i = 1
    let j = 0
    let s: number
    this.initGenRand(19650218)
    let k = this[nValue] > length ? this[nValue] : length

    for (; k; k--) {
      s = this[mtValue][i - 1] ^ (this[mtValue][i - 1] >>> 30)
      this[mtValue][i] =
        (this[mtValue][i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + (s & 0x0000ffff) * 1664525)) +
        key[j] +
        j /* non linear */
      this[mtValue][i] >>>= 0 /* for WORDSIZE > 32 machines */
      i++
      j++
      if (i >= this[nValue]) {
        this[mtValue][0] = this[mtValue][this[nValue] - 1]
        i = 1
      }
      if (j >= length) {
        j = 0
      }
    }

    for (k = this[nValue] - 1; k; k--) {
      s = this[mtValue][i - 1] ^ (this[mtValue][i - 1] >>> 30)
      this[mtValue][i] =
        (this[mtValue][i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) -
        i /* non linear */
      this[mtValue][i] >>>= 0 /* for WORDSIZE > 32 machines */
      i++
      if (i >= this[nValue]) {
        this[mtValue][0] = this[mtValue][this[nValue] - 1]
        i = 1
      }
    }

    this[mtValue][0] = 0x80000000 /* MSB is 1; assuring non-zero initial array */
  }

  /**
   * @returns a random number on [0,0xffffffff]-interval
   */
  int32(): number {
    let y
    const mag01 = [0x0, this[matrixAValue]]
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this[mtiValue] >= this[nValue]) {
      /* generate N words at one time */
      let kk

      if (this[mtiValue] === this[nValue] + 1) {
        /* if initGenRand() has not been called, */
        this.initGenRand(5489) /* a default initial seed is used */
      }

      for (kk = 0; kk < this[nValue] - this[mValue]; kk++) {
        y = (this[mtValue][kk] & this[upperMaskValue]) | (this[mtValue][kk + 1] & this[lowerMaskValue])
        this[mtValue][kk] = this[mtValue][kk + this[mValue]] ^ (y >>> 1) ^ mag01[y & 0x1]
      }

      for (; kk < this[nValue] - 1; kk++) {
        y = (this[mtValue][kk] & this[upperMaskValue]) | (this[mtValue][kk + 1] & this[lowerMaskValue])
        this[mtValue][kk] = this[mtValue][kk + (this[mValue] - this[nValue])] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      y = (this[mtValue][this[nValue] - 1] & this[upperMaskValue]) | (this[mtValue][0] & this[lowerMaskValue])
      this[mtValue][this[nValue] - 1] = this[mtValue][this[mValue] - 1] ^ (y >>> 1) ^ mag01[y & 0x1]

      this[mtiValue] = 0
    }

    y = this[mtValue][this[mtiValue]++]

    /* Tempering */
    y ^= y >>> 11
    y ^= (y << 7) & 0x9d2c5680
    y ^= (y << 15) & 0xefc60000
    y ^= y >>> 18

    return y >>> 0
  }

  /**
   * @returns a random number on [0,0x7fffffff]-interval
   */
  int31(): number {
    return this.int32() >>> 1
  }

  /**
   * @returns a random number on [0,1]-real-interval
   */
  real1(): number {
    return this.int32() * (1.0 / 4294967295.0) /* divided by 2^32-1 */
  }

  /**
   * @returns a random number on [0,1)-real-interval
   */
  random(max = 32768, min = 0): number {
    return Math.floor(this.real2() * (max - min) + min)
  }

  /**
   * @returns a random number on [0,1)-real-interval
   */
  real2(): number {
    return this.int32() * (1.0 / 4294967296.0) /* divided by 2^32 */
  }

  /**
   * @returns a random number on (0,1)-real-interval
   */
  real3(): number {
    return (this.int32() + 0.5) * (1.0 / 4294967296.0) /* divided by 2^32 */
  }

  /**
   * @returns a random number on [0,1) with 53-bit resolution
   */
  res53(): number {
    const a = this.int32() >>> 5
    const b = this.int32() >>> 6
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0)
  }
}
