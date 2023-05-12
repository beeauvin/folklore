/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { assert, assertEquals } from 'std/testing/asserts.ts'
import { describe, it } from 'std/testing/bdd.ts'

import { Future } from './future.ts'

describe('Future', () => {
  describe('FromPromise', () => {
    it('should return a future with the value', async () => {
      const future = Future.FromPromise(Promise.resolve(1))
      assertEquals((await future.result()).isOk(), true)
      assertEquals((await future.result()).getOrElse(0), 1)
    })

    it('should return a future with the error', async () => {
      const promise = new Promise<number>((_resolve, reject) => {
        reject(new Error('error'))
      })
      const future = Future.FromPromise(promise)
      assertEquals((await future.result()).isError(), true)
      assertEquals((await future.result()).getOrElse(0), 0)
    })

    it('should never throw an error', () => {
      const promise = new Promise(() => {
        throw new Error('error')
      })
      const future = Future.FromPromise(promise)
      assert(async () => await future.result())
    })
  })
})
