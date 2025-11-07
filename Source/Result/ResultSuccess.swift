// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result where Success == Void {

  // MARK: - Success

  /// A convenience property that returns a successful Result with a Void value.
  ///
  /// This property provides a more natural way to create a successful Result
  /// when the success type is Void, avoiding the awkward `.success(())` syntax.
  ///
  /// ```swift
  /// // Instead of:
  /// let result: Result<Void, Error> = .success(())
  ///
  /// // Use:
  /// let result: Result<Void, Error> = .success
  /// ```
  ///
  /// - Returns: A Result in the success state with a Void value
  public static var success: Self { .success(()) }
}
