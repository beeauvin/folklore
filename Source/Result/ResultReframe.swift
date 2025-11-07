// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result {

  // MARK: - Reframe

  /// Transforms the failure value if the result is a failure, otherwise forwards the success.
  ///
  /// This method provides a natural language alternative to `mapError(_:)`,
  /// making code that deals with result error transformations more readable and intention-revealing.
  ///
  /// ```swift
  /// // Using a failed result with a direct transformation
  /// let network_result: Result<Data, NetworkError> = .failure(.connectionLost)
  /// let app_result = network_result.reframe { network_error in
  ///   AppError.network(underlying: network_error)
  /// }
  ///
  /// // Equivalent to: let app_result = network_result.mapError { AppError.network(underlying: $0) }
  /// ```
  ///
  /// - Parameter transformer: A closure that transforms the failure value
  /// - Returns: A result containing the original success value, or the transformed error if the original was a failure
  public func reframe<NewFailure>(_ transformer: (Failure) -> NewFailure) -> Result<
    Success, NewFailure
  > {
    switch self {
    case .success(let value):
      return .success(value)
    case .failure(let error):
      return .failure(transformer(error))
    }
  }

  /// Transforms the failure value using a closure that may return a new result.
  ///
  /// This method provides a natural language alternative to complex error handling chains,
  /// allowing for transformations of errors that might produce a success or a different failure.
  ///
  /// ```swift
  /// // Using a failed result with a transformation that might succeed
  /// let network_result: Result<Data, NetworkError> = .failure(.notFound)
  /// let final_result = network_result.reframe { error in
  ///   if error == .notFound {
  ///     // Return a success with default data when the resource is not found
  ///     return .success(default_data)
  ///   } else {
  ///     // Return a new application error for other network errors
  ///     return .failure(AppError.network(underlying: error))
  ///   }
  /// }
  /// ```
  ///
  /// - Parameter transformer: A closure that transforms the failure value into a new result
  /// - Returns: The original success, or the result of the transformation if the original was a failure
  public func reframe<NewFailure>(_ transformer: (Failure) -> Result<Success, NewFailure>)
    -> Result<Success, NewFailure>
  {
    switch self {
    case .success(let value):
      return .success(value)
    case .failure(let error):
      return transformer(error)
    }
  }

  // MARK: - Async Reframe

  /// Transforms the failure value using an async closure if the result is a failure.
  ///
  /// This method provides an async variant of `reframe(_:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Using reframe with an async closure
  /// let api_result: Result<User, APIError> = api_call_result
  /// let domain_result = await api_result.reframe { api_error in
  ///   await error_processor.convert_to_domain_error(api_error)
  /// }
  /// ```
  ///
  /// - Parameter transformer: An async closure that transforms the failure value
  /// - Returns: A result containing the original success value, or the transformed error if the original was a failure
  public func reframe<NewFailure>(_ transformer: (Failure) async -> NewFailure) async -> Result<
    Success, NewFailure
  > {
    switch self {
    case .success(let value):
      return .success(value)
    case .failure(let error):
      let transformed = await transformer(error)
      return .failure(transformed)
    }
  }

  /// Transforms the failure value using an async closure that may return a new result.
  ///
  /// This method provides an async variant of `reframe(_:)` that handles
  /// transformations which might produce a success or a different failure.
  ///
  /// ```swift
  /// // Using reframe with an async closure that might produce a success
  /// let network_result: Result<Data, NetworkError> = .failure(.rateLimited)
  /// let final_result = await network_result.reframe { error in
  ///   if error == .rateLimited {
  ///     // Try to get data from the cache when rate limited
  ///     return await cache_service.try_fetch_data(for: request_key)
  ///   } else {
  ///     // Convert other network errors to application errors
  ///     return .failure(await error_service.convert_network_error(error))
  ///   }
  /// }
  /// ```
  ///
  /// - Parameter transformer: An async closure that transforms the failure value into a new result
  /// - Returns: The original success, or the result of the transformation if the original was a failure
  public func reframe<NewFailure>(_ transformer: (Failure) async -> Result<Success, NewFailure>)
    async -> Result<Success, NewFailure>
  {
    switch self {
    case .success(let value):
      return .success(value)
    case .failure(let error):
      return await transformer(error)
    }
  }
}
