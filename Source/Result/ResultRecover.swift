// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result {

  // MARK: - Recover

  /// Attempts to recover from a failure by providing an alternative success value.
  ///
  /// Unlike `otherwise`, which always produces a value, this method attempts to recover
  /// from the error but may still fail, returning another result.
  ///
  /// ```swift
  /// // Try to recover from a network error by using cached data
  /// let data_result: Result<Data, NetworkError> = api.fetch_data()
  /// let recovered_result = data_result.recover { error in
  ///   if cache.has_valid_data_for(request) {
  ///     return cache.get_data_for(request)
  ///   } else {
  ///     return nil  // Unable to recover, will maintain failure
  ///   }
  /// }
  /// ```
  ///
  /// If the original result is a success, the recovery closure is not called.
  /// If the recovery closure returns nil, the original error is maintained.
  ///
  /// - Parameter recovery: A closure that takes the error and tries to produce a success value
  /// - Returns: The original success, a recovered success, or the original failure if recovery failed
  public func recover(_ recovery: (Failure) -> Success?) -> Result<Success, Failure> {
    switch self {
    case .success:
      return self
    case .failure(let error):
      if let recovered = recovery(error) {
        return .success(recovered)
      } else {
        return .failure(error)
      }
    }
  }

  /// Attempts to recover from a failure by providing an alternative result.
  ///
  /// This variant allows the recovery to potentially produce a different error.
  ///
  /// ```swift
  /// // Try to recover by using a different service that might have its own errors
  /// let data_result: Result<Data, ServiceAError> = service_a.fetch_data()
  /// let recovered_result = data_result.recover { error in
  ///   return service_b.fetch_data()  // Returns Result<Data, ServiceBError>
  /// }
  /// ```
  ///
  /// - Parameter recovery: A closure that takes the error and produces an alternative result
  /// - Returns: The original success or the result of the recovery attempt
  public func recover<NewFailure>(_ recovery: (Failure) -> Result<Success, NewFailure>) -> Result<
    Success, NewFailure
  > {
    switch self {
    case .success(let value):
      return .success(value)
    case .failure(let error):
      return recovery(error)
    }
  }

  // MARK: - Async Recover

  /// Attempts to recover from a failure by providing an alternative success value asynchronously.
  ///
  /// This method is the async variant of `recover(_:)` for use with Swift's structured concurrency.
  ///
  /// ```swift
  /// // Try to recover from an error asynchronously
  /// let data_result: Result<Data, NetworkError> = api.fetch_data()
  /// let recovered_result = await data_result.recover { error in
  ///   return await backup_service.try_fetch_data()  // Might return nil
  /// }
  /// ```
  ///
  /// - Parameter recovery: An async closure that takes the error and tries to produce a success value
  /// - Returns: The original success, a recovered success, or the original failure if recovery failed
  public func recover(_ recovery: (Failure) async -> Success?) async -> Result<Success, Failure> {
    switch self {
    case .success:
      return self
    case .failure(let error):
      if let recovered = await recovery(error) {
        return .success(recovered)
      } else {
        return .failure(error)
      }
    }
  }

  /// Attempts to recover from a failure by providing an alternative result asynchronously.
  ///
  /// This async variant allows the recovery to potentially produce a different error.
  ///
  /// ```swift
  /// // Try to recover by using a different service asynchronously
  /// let data_result: Result<Data, ServiceAError> = service_a.fetch_data()
  /// let recovered_result = await data_result.recover { error in
  ///   return await service_b.fetch_data_async()  // Returns Result<Data, ServiceBError>
  /// }
  /// ```
  ///
  /// - Parameter recovery: An async closure that takes the error and produces an alternative result
  /// - Returns: The original success or the result of the recovery attempt
  public func recover<NewFailure>(_ recovery: (Failure) async -> Result<Success, NewFailure>) async
    -> Result<Success, NewFailure>
  {
    switch self {
    case .success(let value):
      return .success(value)
    case .failure(let error):
      return await recovery(error)
    }
  }
}
