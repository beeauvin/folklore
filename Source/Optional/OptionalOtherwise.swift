// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Optional {

  // MARK: - Otherwise Value

  /// Returns the wrapped value if the optional is non-nil, otherwise returns the provided default value.
  ///
  /// This method provides a natural language alternative to the nil-coalescing operator (`??`),
  /// making code that deals with optionals more readable and intention-revealing.
  ///
  /// ```swift
  /// // Using a string optional with a default
  /// let username: String? = get_username_from_database()
  /// let display_name = username.otherwise("Guest")
  ///
  /// // Equivalent to: let display_name = username ?? "Guest"
  /// ```
  ///
  /// In Swift 6+, this method complements the improved optional handling features:
  /// - It provides a functional alternative to the enhanced `if let/else` binding syntax
  /// - It works seamlessly with Swift 6's improved type inference for optionals
  /// - It can be chained with other optional operations for expressive, readable code
  ///
  /// - Parameter default: The value to use when the optional is nil
  /// - Returns: The wrapped value if non-nil, otherwise the provided default value
  public func otherwise(_ default: Wrapped) -> Wrapped {
    return self ?? `default`
  }

  // MARK: - Otherwise Provider

  /// Returns the wrapped value if the optional is non-nil, otherwise evaluates and returns
  /// the result of the provided closure.
  ///
  /// This method is similar to `otherwise(_:)` but allows for lazy evaluation of the default value,
  /// which is useful when the default is expensive to compute or has side effects that should only
  /// occur when needed.
  ///
  /// ```swift
  /// // Only compute default value if needed
  /// let cached_result: ExpensiveComputationResult? = cache.retrieve(key)
  /// let result = cached_result.otherwise {
  ///     let computed = perform_expensive_computation()
  ///     cache.store(computed, for: key)
  ///     return computed
  /// }
  /// ```
  ///
  /// With Swift 6+, this method offers an ergonomic alternative to the improved `if let/else` pattern:
  ///
  /// ```swift
  /// // Using if let/else in Swift 6+
  /// if let cached_result = cache.retrieve(key) {
  ///     return cached_result
  /// } else {
  ///     let computed = perform_expensive_computation()
  ///     cache.store(computed, for: key)
  ///     return computed
  /// }
  ///
  /// // Using otherwise (more concise and expression-oriented)
  /// return cache.retrieve(key).otherwise {
  ///     let computed = perform_expensive_computation()
  ///     cache.store(computed, for: key)
  ///     return computed
  /// }
  /// ```
  ///
  /// - Parameter provider: A closure that provides a default value when evaluated
  /// - Returns: The wrapped value if non-nil, otherwise the result of evaluating the `provider`
  public func otherwise(_ provider: () -> Wrapped) -> Wrapped {
    return self ?? provider()
  }

  // MARK: - Otherwise Async Provider

  /// Returns the wrapped value if the optional is non-nil, otherwise awaits and returns
  /// the result of the provided async closure.
  ///
  /// Useful for any async operations where the fallback needs to be performed asynchronously,
  /// including when working with actors.
  ///
  /// ```swift
  /// // With regular async code
  /// let cached_value = await cache.retrieve_value(for: key)
  /// let value = await cached_value.otherwise {
  ///     await perform_async_operation()
  /// }
  ///
  /// // With actor-isolated code
  /// let cached_value = await cache.retrieve_value(for: key)
  /// let value = await cached_value.otherwise {
  ///     // Swift will enforce @Sendable requirement at the actor boundary
  ///     await some_actor.compute_something()
  /// }
  /// ```
  ///
  /// In Swift 6+, this method provides an elegant alternative to conditional unwrapping
  /// patterns when working with async code:
  ///
  /// ```swift
  /// // Using otherwise with async (more concise)
  /// return await cached_result.otherwise {
  ///     await service.compute_expensive_default()
  /// }
  ///
  /// // Instead of conditional unwrapping
  /// if let result = await cache.retrieve(key) {
  ///     return result
  /// } else {
  ///     return await service.compute_expensive_default()
  /// }
  /// ```
  ///
  /// - Note: When using this method with actors, Swift will automatically enforce
  ///   the `@Sendable` requirement at the actor boundary. You don't need to add any
  ///   special annotation to the `otherwise` call itself.
  ///
  /// - Parameter provider: An async closure that provides a default value when evaluated
  /// - Returns: The wrapped value if non-nil, otherwise the result of awaiting the `provider`
  public func otherwise(_ provider: () async -> Wrapped) async -> Wrapped {
    if let wrapped = self {
      return wrapped
    } else {
      return await provider()
    }
  }
}
