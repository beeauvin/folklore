// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result {

  // MARK: - When Success

  /// Executes a closure with the success value if the result is a success.
  ///
  /// This method provides a side-effect-oriented approach to handling successful results,
  /// allowing you to perform actions without breaking the flow of your code.
  ///
  /// ```swift
  /// // Execute code only when the result is a success
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// user_result.when(success: { user in
  ///   analytics.log_user_visit(user.id)
  /// })
  ///
  /// // Equivalent to:
  /// // if case .success(let user) = user_result {
  /// //   analytics.log_user_visit(user.id)
  /// // }
  /// ```
  ///
  /// - Parameter action: A closure to execute with the success value
  /// - Returns: The original result, allowing for method chaining
  @discardableResult
  public func when(success action: (Success) -> Void) -> Self {
    if case .success(let value) = self {
      action(value)
    }
    return self
  }

  // MARK: - When Failure

  /// Executes a closure with the failure value if the result is a failure.
  ///
  /// This method provides a way to perform side effects when a result is a failure,
  /// without breaking the flow of your code.
  ///
  /// ```swift
  /// // Execute code only when the result is a failure
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// user_result.when(failure: { error in
  ///   logger.log("Failed to fetch user: \(error)")
  /// })
  ///
  /// // Equivalent to:
  /// // if case .failure(let error) = user_result {
  /// //   logger.log("Failed to fetch user: \(error)")
  /// // }
  /// ```
  ///
  /// - Parameter action: A closure to execute with the failure value
  /// - Returns: The original result, allowing for method chaining
  @discardableResult
  public func when(failure action: (Failure) -> Void) -> Self {
    if case .failure(let error) = self {
      action(error)
    }
    return self
  }

  // MARK: - When Success or Failure (side effects only)

  /// Executes one of two closures based on whether the result is a success or failure.
  ///
  /// This method provides a unified approach to handling both success and failure
  /// in a single expression, making code more readable and expressive.
  ///
  /// ```swift
  /// // Handle both success and failure
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// user_result.when(
  ///   success: { user in
  ///     display_user_profile(user)
  ///   },
  ///   failure: { error in
  ///     display_error_message(for: error)
  ///   }
  /// )
  ///
  /// // Equivalent to:
  /// // switch user_result {
  /// // case .success(let user):
  /// //   display_user_profile(user)
  /// // case .failure(let error):
  /// //   display_error_message(for: error)
  /// // }
  /// ```
  ///
  /// - Parameters:
  ///   - success_action: A closure to execute with the success value
  ///   - failure_action: A closure to execute with the failure value
  @discardableResult
  public func when(
    success success_action: (Success) -> Void,
    failure failure_action: (Failure) -> Void
  ) -> Self {
    switch self {
    case .success(let value):
      success_action(value)
    case .failure(let error):
      failure_action(error)
    }
    return self
  }

  // MARK: - Async When Success

  /// Executes an async closure with the success value if the result is a success.
  ///
  /// This method provides an async variant of `when(success:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Using async when with actors or async code
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// await user_result.when(success: { user in
  ///   await analytics.log_user_visit_async(user.id)
  /// })
  /// ```
  ///
  /// - Parameter action: An async closure to execute with the success value
  /// - Returns: The original result, allowing for method chaining
  @discardableResult
  public func when(success action: (Success) async -> Void) async -> Self {
    if case .success(let value) = self {
      await action(value)
    }
    return self
  }

  // MARK: - Async When Failure

  /// Executes an async closure with the failure value if the result is a failure.
  ///
  /// This method provides an async variant of `when(failure:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Using async when with actors or async code
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// await user_result.when(failure: { error in
  ///   await error_reporting_service.report(error)
  /// })
  /// ```
  ///
  /// - Parameter action: An async closure to execute with the failure value
  /// - Returns: The original result, allowing for method chaining
  @discardableResult
  public func when(failure action: (Failure) async -> Void) async -> Self {
    if case .failure(let error) = self {
      await action(error)
    }
    return self
  }

  // MARK: - Async When Success or Failure

  /// Executes one of two async closures based on whether the result is a success or failure.
  ///
  /// This method provides an async variant of `when(success:failure:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Handle both success and failure asynchronously
  /// let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
  /// await user_result.when(
  ///   success: { user in
  ///     await user_service.process_user_async(user)
  ///   },
  ///   failure: { error in
  ///     await error_service.handle_error_async(error)
  ///   }
  /// )
  /// ```
  ///
  /// - Parameters:
  ///   - success_action: An async closure to execute with the success value
  ///   - failure_action: An async closure to execute with the failure value
  /// - Returns: The original result, allowing for method chaining
  @discardableResult
  public func when(
    success success_action: (Success) async -> Void,
    failure failure_action: (Failure) async -> Void
  ) async -> Self {
    switch self {
    case .success(let value):
      await success_action(value)
    case .failure(let error):
      await failure_action(error)
    }
    return self
  }
}
