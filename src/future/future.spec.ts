/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Future } from './future'

describe('Future', () => {
  describe('FromPromise', () => {
    it('should return a future with the value', async () => {
      const future = Future.FromPromise(Promise.resolve(1))
      expect((await future.result()).isOk()).toBe(true)
      expect((await future.result()).getOrElse(0)).toBe(1)
    })

    it('should return a future with the error', async () => {
      const promise = new Promise<number>((_resolve, reject) => {
        reject(new Error('error'))
      })
      const future = Future.FromPromise(promise)
      expect((await future.result()).isError()).toBe(true)
      expect((await future.result()).getOrElse(0)).toBe(0)
    })

    it('should never throw an error', () => {
      const promise = new Promise(() => {
        throw new Error('error')
      })
      const future = Future.FromPromise(promise)
      expect(async () => await future.result()).not.toThrow()
    })
  })
})
