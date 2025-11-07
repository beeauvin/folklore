// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Optional {

  // MARK: - When Something

  /// Executes a closure with the wrapped value if the optional is non-nil.
  ///
  /// This method provides a side-effect-oriented approach to handling the presence of a value,
  /// allowing you to perform actions without breaking the flow of your code.
  ///
  /// ```swift
  /// // Execute code only when the optional contains a value
  /// let user: User? = get_current_user()
  /// user.when(something: { person in
  ///   analytics.log_user_visit(person.id)
  /// })
  ///
  /// // Equivalent to:
  /// // if let person = user {
  /// //   analytics.log_user_visit(person.id)
  /// // }
  /// ```
  ///
  /// In Swift 6+, this method complements the improved optional handling features:
  /// - It provides a more functional alternative to `if let` for side effects
  /// - It keeps code intention-revealing through natural language
  /// - It lets you perform optional-dependent actions without breaking the flow
  ///
  /// - Parameter action: A closure to execute with the wrapped value if non-nil
  public func when(something action: (Wrapped) -> Void) {
    if let wrapped = self {
      action(wrapped)
    }
  }

  // MARK: - When Nothing

  /// Executes a closure if the optional is nil.
  ///
  /// This method provides a way to perform side effects when an optional is nil,
  /// without needing to use if-else or guard statements.
  ///
  /// ```swift
  /// // Execute code only when optional is nil
  /// let user: User? = get_current_user()
  /// user.when(nothing: {
  ///   analytics.log_anonymous_visit()
  /// })
  ///
  /// // Equivalent to:
  /// // if user == nil {
  /// //   analytics.log_anonymous_visit()
  /// // }
  /// ```
  ///
  /// - Parameter action: A closure to execute if the optional is nil
  public func when(nothing action: () -> Void) {
    if self == nil {
      action()
    }
  }

  // MARK: - When Something or Nothing (side effects only)

  /// Executes one of two closures based on whether the optional contains a value.
  ///
  /// This method provides a unified approach to handling both the presence and absence
  /// of a value in a single expression, making code more readable and expressive.
  ///
  /// ```swift
  /// // Handle both the presence and absence of a value
  /// let user: User? = get_current_user()
  /// user.when(
  ///   something: { person in
  ///     analytics.log_user_visit(person.id)
  ///   },
  ///   nothing: {
  ///     analytics.log_anonymous_visit()
  ///   }
  /// )
  ///
  /// // Equivalent to:
  /// // if let person = user {
  /// //   analytics.log_user_visit(person.id)
  /// // } else {
  /// //   analytics.log_anonymous_visit()
  /// // }
  /// ```
  ///
  /// - Parameters:
  ///   - something_action: A closure to execute with the wrapped value if non-nil
  ///   - nothing_action: A closure to execute if the optional is nil
  public func when(
    something something_action: (Wrapped) -> Void,
    nothing nothing_action: () -> Void
  ) {
    if let wrapped = self {
      something_action(wrapped)
    } else {
      nothing_action()
    }
  }

  // MARK: - Async When Something

  /// Executes an async closure with the wrapped value if the optional is non-nil.
  ///
  /// This method provides an async variant of `when(something:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Using async when with actors or async code
  /// let user: User? = get_current_user()
  /// await user.when(something: { person in
  ///   await analytics.log_user_visit_async(person.id)
  /// })
  /// ```
  ///
  /// - Parameter action: An async closure to execute with the wrapped value if non-nil
  public func when(something action: (Wrapped) async -> Void) async {
    if let wrapped = self {
      await action(wrapped)
    }
  }

  // MARK: - Async When Nothing

  /// Executes an async closure if the optional is nil.
  ///
  /// This method provides an async version of `when(nothing:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Execute async code only when optional is nil
  /// let user: User? = get_current_user()
  /// await user.when(nothing: {
  ///   await analytics.log_anonymous_visit_async()
  /// })
  /// ```
  ///
  /// - Parameter action: An async closure to execute if the optional is nil
  public func when(nothing action: () async -> Void) async {
    if self == nil {
      await action()
    }
  }

  // MARK: - Async When Something or Nothing (side effects only)

  /// Executes one of two async closures based on whether the optional contains a value.
  ///
  /// This method provides an async variant of `when(something:nothing:)` for use with
  /// Swift's structured concurrency.
  ///
  /// ```swift
  /// // Handle both the presence and absence of a value asynchronously
  /// let user: User? = get_current_user()
  /// await user.when(
  ///   something: { person in
  ///     await analytics.log_user_visit_async(person.id)
  ///   },
  ///   nothing: {
  ///     await analytics.log_anonymous_visit_async()
  ///   }
  /// )
  /// ```
  ///
  /// - Note: When using this method with actors, Swift will automatically enforce
  ///   the `@Sendable` requirement at the actor boundary.
  ///
  /// - Parameters:
  ///   - something_action: An async closure to execute with the wrapped value if non-nil
  ///   - nothing_action: An async closure to execute if the optional is nil
  public func when(
    something something_action: (Wrapped) async -> Void,
    nothing nothing_action: () async -> Void
  ) async {
    if let wrapped = self {
      await something_action(wrapped)
    } else {
      await nothing_action()
    }
  }
}
