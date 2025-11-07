// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Optional {

  // MARK: - Transmute to Result

  /// Transmutes an Optional into a Result, using the provided error if the Optional is nil.
  ///
  /// This method provides a natural way to convert an Optional into a Result
  /// when you need to provide more specific error information.
  ///
  /// ```swift
  /// // Convert an optional username to a Result
  /// let username: String? = get_username_from_database()
  /// let result = username.transmute(as: UserError.missing_username)
  ///
  /// // Now you can use all Result extensions
  /// let display_name = result
  ///   .recover { error in "Guest" }
  ///   .when(success: { name in log_user_found(name) })
  /// ```
  ///
  /// - Parameter error: The error to use if the Optional is nil
  /// - Returns: A Result containing the wrapped value if non-nil, or the provided error if nil
  public func transmute<E: Error>(as error: E) -> Result<Wrapped, E> {
    switch self {
    case .some(let value):
      return .success(value)
    case .none:
      return .failure(error)
    }
  }
}
