// Copyright © 2025 Cassidy Spring (Bee). Folklore Project.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

extension Result where Failure == Error {

  // MARK: - Catching

  /// Creates a Result by running the provided throwing closure, capturing either a success or an error.
  ///
  /// This method is similar to the built-in `Result.init(catching:)` initializer but
  /// provides a consistent interface with Folklore's other catching functions.
  ///
  /// ```swift
  /// // Convert a throwing function call into a Result
  /// let result = Result<Data, Error>.Catching {
  ///   try file_manager.contents(atPath: path)
  /// }
  ///
  /// // Chain with other Result extensions
  /// let text = Result<Data, Error>.Catching {
  ///   try file_manager.contents(atPath: path)
  /// }.transform { data in
  ///   String(data: data, encoding: .utf8)
  /// }.otherwise("Empty file")
  /// ```
  ///
  /// - Parameter body: A throwing closure to execute
  /// - Returns: A Result containing either the value returned by the closure or the thrown error
  public static func Catching(_ body: () throws -> Success) -> Result<Success, Failure> {
    do {
      return .success(try body())
    } catch {
      return .failure(error)
    }
  }

  // MARK: - Async Catching

  /// Creates a Result by running the provided async throwing closure, capturing either a success or an error.
  ///
  /// This method provides an async variant of `Catching(_:)` for use with Swift's structured concurrency.
  ///
  /// ```swift
  /// // Convert an async throwing function call into a Result
  /// let result = await Result<Data, Error>.Catching {
  ///   try await network_service.fetch_data(from: url)
  /// }
  ///
  /// // Chain with other Result extensions
  /// let text = await Result<Data, Error>.Catching {
  ///   try await network_service.fetch_data(from: url)
  /// }.transform { data in
  ///   String(data: data, encoding: .utf8)
  /// }.otherwise("No data available")
  /// ```
  ///
  /// - Parameter body: An async throwing closure to execute
  /// - Returns: A Result containing either the value returned by the closure or the thrown error
  public static func Catching(_ body: () async throws -> Success) async -> Result<Success, Failure>
  {
    do {
      return .success(try await body())
    } catch {
      return .failure(error)
    }
  }
}
