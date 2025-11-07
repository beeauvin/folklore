// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result {

  // MARK: - Transmute to Optional

  /// Transmutes a Result into an Optional containing the success value.
  ///
  /// This method provides a natural way to convert a Result into an Optional
  /// when you're only interested in the success value and want to discard any errors.
  ///
  /// ```swift
  /// // Convert a Result to an Optional with the success value
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// let user_optional: User? = user_result.transmute()
  ///
  /// // Use with Optional extensions
  /// user_optional.when(something: { user in
  ///   display_user_profile(user)
  /// })
  /// ```
  ///
  /// - Returns: An Optional containing the success value, or nil if the Result is a failure
  public func transmute() -> Success? {
    switch self {
    case .success(let value):
      return value
    case .failure:
      return nil
    }
  }

  /// Transmutes a Result into an Optional containing the error value.
  ///
  /// This method provides a natural way to convert a Result into an Optional
  /// when you're only interested in the error value and want to discard successes.
  ///
  /// ```swift
  /// // Convert a Result to an Optional with the error value
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// let error_optional: APIError? = user_result.transmute(.error)
  ///
  /// // Use with Optional extensions
  /// error_optional.when(something: { error in
  ///   log_error(error)
  /// })
  /// ```
  ///
  /// - Parameter target: Specifies to keep the error value (.error) instead of the success value
  /// - Returns: An Optional containing the error value, or nil if the Result is a success
  public func transmute(_ target: TransmuteTarget) -> Failure? {
    switch self {
    case .success:
      return nil
    case .failure(let error):
      return error
    }
  }
}
