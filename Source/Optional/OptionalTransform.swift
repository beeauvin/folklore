// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Optional {

  // MARK: - Transform

  /// Transforms the wrapped value if the optional is non-nil, otherwise returns nil.
  ///
  /// This method provides a natural language alternative to `map(_:)`,
  /// making code that deals with optional transformations more readable and intention-revealing.
  ///
  /// ```swift
  /// // Using a string optional with a direct transformation
  /// let username: String? = get_username_from_database()
  /// let name_length = username.transform { name in
  ///   name.count
  /// }
  ///
  /// // Equivalent to: let name_length = username.map { $0.count }
  /// ```
  ///
  /// In Swift 6+, this method complements the improved optional handling features:
  /// - It provides a more intuitive name that clearly communicates intent
  /// - It works seamlessly with Swift 6's improved type inference for optionals
  /// - It can be chained with other optional operations for expressive, readable code
  ///
  /// - Parameter transformer: A closure that transforms the wrapped value
  /// - Returns: An optional containing the transformed value, or nil if the original was nil
  public func transform<Transformed>(_ transformer: (Wrapped) -> Transformed) -> Transformed? {
    return map(transformer)
  }

  /// Transforms the wrapped value using a closure that may return nil.
  ///
  /// This method provides a natural language alternative to `flatMap(_:)`,
  /// preventing nested optionals when the transformer itself returns an optional.
  ///
  /// ```swift
  /// // Using a string optional with a transformation that might fail
  /// let numeric_string: String? = "42"
  /// let number = numeric_string.transform { string in
  ///   Int(string)  // Returns Int? (might be nil if string isn't numeric)
  /// }
  ///
  /// // Equivalent to: let number = numeric_string.flatMap { Int($0) }
  /// ```
  ///
  /// This overload automatically handles the case where your transformation might fail
  /// or return an optional, avoiding the nested optional problem that would occur with
  /// the regular `transform` method.
  ///
  /// - Parameter transformer: A closure that transforms the wrapped value and may return nil
  /// - Returns: An optional containing the transformed value, or nil if original was nil or transformation returned nil
  public func transform<Transformed>(_ transformer: (Wrapped) -> Transformed?) -> Transformed? {
    return flatMap(transformer)
  }

  // MARK: - Async Transform

  /// Transforms the wrapped value using an async closure if the optional is non-nil.
  ///
  /// This method provides an async variant of `transform(_:)` for use with
  /// Swift's structured concurrency, making async optional transformations
  /// more readable and intention-revealing.
  ///
  /// ```swift
  /// // Using transform with an async closure
  /// let user_id: UUID? = get_current_user_id()
  /// let user_profile = await user_id.transform { id in
  ///   await user_service.fetch_profile(for: id)
  /// }
  /// ```
  ///
  /// With Swift 6+, this method provides an elegant solution for handling
  /// optionals in async code:
  ///
  /// ```swift
  /// // Using transform with async code (more concise)
  /// return await cached_result.transform { value in
  ///   await service.process(value)
  /// }
  ///
  /// // Instead of conditional unwrapping
  /// if let result = cached_result {
  ///   return await service.process(result)
  /// } else {
  ///   return nil
  /// }
  /// ```
  ///
  /// - Parameter transformer: An async closure that transforms the wrapped value
  /// - Returns: An optional containing the transformed value, or nil if the original was nil
  public func transform<Transformed>(_ transformer: (Wrapped) async -> Transformed) async
    -> Transformed?
  {
    if let wrapped = self {
      return await transformer(wrapped)
    } else {
      return .none
    }
  }

  /// Transforms the wrapped value using an async closure that may return nil.
  ///
  /// This method provides an async variant of `transform(_:)` that handles
  /// transformations which might fail or return an optional, avoiding nested
  /// optionals in async contexts.
  ///
  /// ```swift
  /// // Using transform with an async closure that might return nil
  /// let user_id: UUID? = get_current_user_id()
  /// let premium_status = await user_id.transform { id in
  ///   await subscription_service.get_premium_status(for: id)
  ///   // Returns SubscriptionStatus? (nil if user has no subscription)
  /// }
  /// ```
  ///
  /// - Note: When using this method with actors, Swift will automatically enforce
  ///   the `@Sendable` requirement at the actor boundary.
  ///
  /// - Parameter transformer: An async closure that transforms the wrapped value and may return nil
  /// - Returns: An optional containing the transformed value, or nil if original was nil or transformation returned nil
  public func transform<Transformed>(_ transformer: (Wrapped) async -> Transformed?) async
    -> Transformed?
  {
    if let wrapped = self {
      return await transformer(wrapped)
    } else {
      return .none
    }
  }
}
