// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Optional {

  // MARK: - Optionally Value

  /// Returns the wrapped value if the optional is non-nil, otherwise returns the provided optional.
  ///
  /// This method provides optional chaining with fallbacks, allowing multiple optionals to be tried
  /// before ultimately providing a guaranteed value with `otherwise(_:)`.
  ///
  /// ```swift
  /// // Try multiple optionals in sequence before falling back to a guaranteed value
  /// let primary_value: String? = cache.retrieve_value(for: key)
  /// let backup_value: String? = fallback_cache.retrieve_value(for: key)
  /// let result = primary_value.optionally(backup_value).otherwise("Default")
  ///
  /// // Equivalent to: let result = primary_value ?? backup_value ?? "Default"
  /// ```
  ///
  /// In Swift 6+, this method complements the improved optional handling features and works
  /// together with other optional extensions to create expressive, readable code.
  ///
  /// - Parameter optional: The optional to use when this optional is nil
  /// - Returns: The wrapped value if non-nil, otherwise the provided optional
  public func optionally(_ optional: Wrapped?) -> Wrapped? {
    return self ?? optional
  }

  // MARK: - Optionally Provider

  /// Returns the wrapped value if the optional is non-nil, otherwise evaluates and returns
  /// the result of the provided closure which returns another optional.
  ///
  /// This method provides lazy evaluation of the fallback optional, which is useful when
  /// the fallback is expensive to compute or has side effects that should only occur when needed.
  ///
  /// ```swift
  /// // Only compute fallback optional if needed
  /// let cached_result: ExpensiveComputationResult? = cache.retrieve(key)
  /// let result = cached_result.optionally {
  ///     compute_expensive_fallback()  // Returns another optional
  /// }.otherwise("Default")  // Finally provide a guaranteed value
  /// ```
  ///
  /// - Parameter provider: A closure that provides a fallback optional when evaluated
  /// - Returns: The wrapped value if non-nil, otherwise the result of evaluating the `provider`
  public func optionally(_ provider: () -> Wrapped?) -> Wrapped? {
    return self ?? provider()
  }

  // MARK: - Optionally Async Provider

  /// Returns the wrapped value if the optional is non-nil, otherwise awaits and returns
  /// the result of the provided async closure which returns another optional.
  ///
  /// Useful for any async operations where the fallback needs to be performed asynchronously,
  /// including when working with actors.
  ///
  /// ```swift
  /// // With async fallback computation
  /// let local_value = await local_cache.retrieve_value(for: key)
  /// let value = await local_value.optionally {
  ///     await remote_service.fetch_optional_value()
  /// }.otherwise("Default")
  ///
  /// // With actor-isolated code
  /// let cached_value = await cache.retrieve_value(for: key)
  /// let value = await cached_value.optionally {
  ///     // Swift will enforce @Sendable requirement at the actor boundary
  ///     await some_actor.compute_optional_value()
  /// }.otherwise("Default")
  /// ```
  ///
  /// - Note: When using this method with actors, Swift will automatically enforce
  ///   the `@Sendable` requirement at the actor boundary. You don't need to add any
  ///   special annotation to the `optionally` call itself.
  ///
  /// - Parameter provider: An async closure that provides a fallback optional when evaluated
  /// - Returns: The wrapped value if non-nil, otherwise the result of awaiting the `provider`
  public func optionally(_ provider: () async -> Wrapped?) async -> Wrapped? {
    if let wrapped = self {
      return wrapped
    } else {
      return await provider()
    }
  }
}
