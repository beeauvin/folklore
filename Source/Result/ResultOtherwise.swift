// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result {

  // MARK: - Otherwise Value

  /// Returns the success value if the result is a success, otherwise returns the provided default value.
  ///
  /// This method provides a natural language way to extract values from results while providing
  /// a fallback for the error case.
  ///
  /// ```swift
  /// // Using a result with a default
  /// let computation_result: Result<Int, Error> = perform_risky_computation()
  /// let value = computation_result.otherwise(0)
  ///
  /// // Equivalent to:
  /// // let value = (try? computation_result.get()) ?? 0
  /// ```
  ///
  /// - Parameter default: The value to use when the result is a failure
  /// - Returns: The success value if a success, otherwise the provided default value
  public func otherwise(_ default: Success) -> Success {
    switch self {
    case .success(let value):
      return value
    case .failure:
      return `default`
    }
  }

  // MARK: - Otherwise Provider

  /// Returns the success value if the result is a success, otherwise evaluates and returns
  /// the result of the provided closure.
  ///
  /// This method allows for lazy evaluation of the default value, which is useful when
  /// the default is expensive to compute or has side effects that should only occur when needed.
  ///
  /// ```swift
  /// // Only compute default value if needed
  /// let computation_result: Result<ExpensiveComputationResult, Error> = perform_risky_computation()
  /// let result = computation_result.otherwise {
  ///     perform_fallback_computation()
  /// }
  /// ```
  ///
  /// - Parameter provider: A closure that provides a default value when evaluated
  /// - Returns: The success value if a success, otherwise the result of evaluating the `provider`
  public func otherwise(_ provider: () -> Success) -> Success {
    switch self {
    case .success(let value):
      return value
    case .failure:
      return provider()
    }
  }

  // MARK: - Otherwise Provider with Error

  /// Returns the success value if the result is a success, otherwise evaluates the provided
  /// closure with the error and returns its result.
  ///
  /// This method allows for creating fallback values that can make use of the error information.
  ///
  /// ```swift
  /// // Use error information to create fallback
  /// let computation_result: Result<UserProfile, APIError> = api.fetch_profile(for: user_id)
  /// let profile = computation_result.otherwise { error in
  ///     // Create a partial profile from cached data, incorporating error info
  ///     let cached_profile = cache.get_profile(for: user_id)
  ///     logger.log("Used cached profile due to API error: \(error)")
  ///     return cached_profile
  /// }
  /// ```
  ///
  /// - Parameter provider: A closure that takes the failure value and provides a default success value
  /// - Returns: The success value if a success, otherwise the result of evaluating the `provider` with the error
  public func otherwise(_ provider: (Failure) -> Success) -> Success {
    switch self {
    case .success(let value):
      return value
    case .failure(let error):
      return provider(error)
    }
  }

  // MARK: - Otherwise Async Provider

  /// Returns the success value if the result is a success, otherwise awaits and returns
  /// the result of the provided async closure.
  ///
  /// Useful when the fallback operation needs to be performed asynchronously.
  ///
  /// ```swift
  /// // With async fallback computation
  /// let local_result: Result<Data, Error> = try_read_local_file()
  /// let data = await local_result.otherwise {
  ///     await download_from_network()
  /// }
  /// ```
  ///
  /// - Parameter provider: An async closure that provides a default value when evaluated
  /// - Returns: The success value if a success, otherwise the result of awaiting the `provider`
  public func otherwise(_ provider: () async -> Success) async -> Success {
    switch self {
    case .success(let value):
      return value
    case .failure:
      return await provider()
    }
  }

  // MARK: - Otherwise Async Provider with Error

  /// Returns the success value if the result is a success, otherwise awaits the provided
  /// async closure with the error and returns its result.
  ///
  /// This method allows for creating fallback values asynchronously while making use of the error information.
  ///
  /// ```swift
  /// // Use error information for async fallback
  /// let result: Result<Document, FileError> = file_system.read_document(path)
  /// let document = await result.otherwise { error in
  ///     await backup_service.retrieve_document(path, error: error)
  /// }
  /// ```
  ///
  /// - Parameter provider: An async closure that takes the failure value and provides a default success value
  /// - Returns: The success value if a success, otherwise the result of awaiting the `provider` with the error
  public func otherwise(_ provider: (Failure) async -> Success) async -> Success {
    switch self {
    case .success(let value):
      return value
    case .failure(let error):
      return await provider(error)
    }
  }
}
