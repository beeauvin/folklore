/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Utility types for working with optional and nullable values.
 *
 * This module provides type aliases similar to TypeScript's built-in utility types,
 * with a focus on representing the presence or absence of values in a functional
 * programming style.
 *
 * @module
 * @see https://www.typescriptlang.org/docs/handbook/utility-types
 */

/**
 * Represents the absence of a value.
 *
 * Null or undefined effectively mean the same thing: nothing. This type
 * provides a semantic alias for `null | undefined` and is used throughout
 * folklore to represent empty or missing values.
 *
 * @example
 * ```ts
 * // Function that might return nothing
 * function findUser(id: string): User | Nothing {
 *   return users.get(id) ?? null
 * }
 * ```
 *
 * @see {@link Nullable} for creating optional value types
 */
export type Nothing = null | undefined

/**
 * Constructs a type that can be either a value or nothing.
 *
 * This type is useful for representing optional values, similar to TypeScript's
 * built-in optional properties, but as an explicit union type. It's particularly
 * helpful when working with the {@link Maybe} type from folklore.
 *
 * @typeParam Type - The type of the value when it exists
 *
 * @example
 * ```ts
 * // Function parameter that accepts a value or nothing
 * function greet(name: Nullable<string>): string {
 *   return name != null ? `Hello, ${name}!` : 'Hello, stranger!'
 * }
 *
 * greet('Alice')     // "Hello, Alice!"
 * greet(null)        // "Hello, stranger!"
 * greet(undefined)   // "Hello, stranger!"
 * ```
 *
 * @example
 * ```ts
 * // Converting nullable values to Maybe
 * import { Maybe } from '@folklore/folklore'
 *
 * const value: Nullable<number> = Math.random() > 0.5 ? 42 : null
 * const maybeValue = Maybe.FromNullable(value)
 * ```
 *
 * @see {@link Nothing} for the absence value type
 */
export type Nullable<Type> = Type | Nothing

/**
 * Construct a type that is explicitly not nothing. This is unnecessary as
 * TypeScript includes this type by default. Here as a reference.
 * @see https://www.typescriptlang.org/docs/handbook/utility-types#nonnullabletype
 */
// export type NonNullable<Type> = Type extends Nothing ? never : Type
