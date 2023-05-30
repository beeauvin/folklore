/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Utility types, similar to the TypeScript Reference.
 * @see https://www.typescriptlang.org/docs/handbook/utility-types
 */

/**
 * Null or Undefined effectively mean the same thing: Nothing.
 * This is mostly a convenience type to extend from.
 */
export type Nothing = null | undefined

/**
 * Construct a type that is explicitly something or nothing.
 */
export type Nullable<Type> = Type | Nothing

/**
 * Construct a type that is explicitly not nothing. This is unnecessary as
 * TypeScript includes this type by default. Here as a reference.
 * @see https://www.typescriptlang.org/docs/handbook/utility-types#nonnullabletype
 */
// export type NonNullable<Type> = Type extends Nothing ? never : Type
