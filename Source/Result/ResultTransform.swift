// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result {

  // MARK: - Transform

  /// Transforms the success value if the result is a success, otherwise forwards the error.
  ///
  /// This method provides a natural language alternative to `map(_:)`,
  /// making code that deals with result transformations more readable and intention-revealing.
  ///
  /// ```swift
  /// // Using a successful result with a direct transformation
  /// let string_result: Result<String, Error> = .success("Hello")
  /// let length_result = string_result.transform { string in
  ///   string.count
  /// }
  ///
  /// // Equivalent to: let length_result = string_result.map { $0.count }
  /// ```
  ///
  /// - Parameter transformer: A closure that transforms the success value
  /// - Returns: A result containing the transformed value, or the original error if the original was a failure
  public func transform<NewSuccess>(_ transformer: (Success) -> NewSuccess) -> Result<
    NewSuccess, Failure
  > {
    switch self {
    case .success(let value):
      return .success(transformer(value))
    case .failure(let error):
      return .failure(error)
    }
  }

  /// Transforms the success value using a closure that may return a new result.
  ///
  /// This method provides a natural language alternative to `flatMap(_:)`,
  /// allowing for transformations that might themselves fail.
  ///
  /// ```swift
  /// // Using a successful result with a transformation that might fail
  /// let file_path_result: Result<String, Error> = .success("document.txt")
  /// let file_contents_result = file_path_result.transform { path in
  ///   read_file(at: path)  // Returns Result<String, Error>
  /// }
  ///
  /// // Equivalent to: let file_contents_result = file_path_result.flatMap { read_file(at: $0) }
  /// ```
  ///
  /// - Parameter transformer: A closure that transforms the success value into a new result
  /// - Returns: The result of the transformation, or the original error if the original was a failure
  public func transform<NewSuccess>(_ transformer: (Success) -> Result<NewSuccess, Failure>)
    -> Result<NewSuccess, Failure>
  {
    switch self {
    case .success(let value):
      return transformer(value)
    case .failure(let error):
      return .failure(error)
    }
  }

  // MARK: - Async Transform

  /// Transforms the success value using an async closure if the result is a success.
  ///
  /// This method provides an async variant of `transform(_:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Using transform with an async closure
  /// let user_id_result: Result<UUID, APIError> = get_user_id_result()
  /// let profile_result = await user_id_result.transform { id in
  ///   await user_service.fetch_profile(for: id)
  /// }
  /// ```
  ///
  /// - Parameter transformer: An async closure that transforms the success value
  /// - Returns: A result containing the transformed value, or the original error if the original was a failure
  public func transform<NewSuccess>(_ transformer: (Success) async -> NewSuccess) async -> Result<
    NewSuccess, Failure
  > {
    switch self {
    case .success(let value):
      let transformed = await transformer(value)
      return .success(transformed)
    case .failure(let error):
      return .failure(error)
    }
  }

  /// Transforms the success value using an async closure that may return a new result.
  ///
  /// This method provides an async variant of `transform(_:)` that handles
  /// transformations which might fail, for use with Swift's structured concurrency.
  ///
  /// ```swift
  /// // Using transform with an async closure that might fail
  /// let token_result: Result<AuthToken, APIError> = get_auth_token_result()
  /// let user_data_result = await token_result.transform { token in
  ///   await api.fetch_user_data(with: token)  // Returns Result<UserData, APIError>
  /// }
  /// ```
  ///
  /// - Parameter transformer: An async closure that transforms the success value into a new result
  /// - Returns: The result of the transformation, or the original error if the original was a failure
  public func transform<NewSuccess>(_ transformer: (Success) async -> Result<NewSuccess, Failure>)
    async -> Result<NewSuccess, Failure>
  {
    switch self {
    case .success(let value):
      return await transformer(value)
    case .failure(let error):
      return .failure(error)
    }
  }
}
