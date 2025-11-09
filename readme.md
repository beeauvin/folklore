# 🍄 Folklore

![license](https://img.shields.io/github/license/beeauvin/folklore)
[![tests](https://github.com/beeauvin/folklore/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/beeauvin/folklore/actions/workflows/continuous-integration)
[![codecov](https://codecov.io/gh/beeauvin/folklore/graph/badge.svg?token=19O67TDUG0)](https://codecov.io/gh/beeauvin/folklore)

[![](https://img.shields.io/endpoint?url=https%3A%2F%2Fswiftpackageindex.com%2Fapi%2Fpackages%2Fbeeauvin%2Ffolklore%2Fbadge%3Ftype%3Dswift-versions)](https://swiftpackageindex.com/beeauvin/folklore)
[![](https://img.shields.io/endpoint?url=https%3A%2F%2Fswiftpackageindex.com%2Fapi%2Fpackages%2Fbeeauvin%2Ffolklore%2Fbadge%3Ftype%3Dplatforms)](https://swiftpackageindex.com/beeauvin/folklore)

🍄 Folklore is a small swift library that provides natural language extensions for core swift types.

## Installation

Add Folklore to your Swift package dependencies:

```swift
// Package Dependencies
dependencies: [
  .package(url: "https://github.com/beeauvin/folklore.git", from: "1.0.0")
]

// Target Dependencies
dependencies: [
  .product(name: "Folklore", package: "folklore")
]
```

## Usage

```swift
import Folklore

// Use Optional extensions
let username: String? = get_username()
let display_name = username.otherwise("Guest")

// Use Result extensions
let api_result: Result<User, APIError> = api.fetch_user()
let user = api_result.otherwise { error in
    default_user_for_error(error)
}

// Convert between types
let user_optional: User? = api_result.transmute()
```

## Features

Folklore provides natural language extensions for Swift's Optional and Result types, plus seamless conversion between them. It transforms how you work with these fundamental types by replacing symbolic operations with expressive, readable methods.

### Optional Extensions

#### `otherwise` - A natural language alternative to nil-coalescing (`??`)

```swift
// Instead of:
let display_name = username ?? "Guest"

// Use:
let display_name = username.otherwise("Guest")
```

Three variants are available:

```swift
// With a direct default value
let result = optional_value.otherwise(defaultValue)

// With a closure for lazy evaluation
let result = optional_value.otherwise {
    perform_expensive_computation()
}

// With an async closure (fully supports actors)
let result = await optional_value.otherwise {
    await perform_async_operation()
}
```

#### `transform` - A natural language alternative to map/flatMap

```swift
// Instead of:
let name_length = username.map { $0.count }

// Use:
let name_length = username.transform { name in
    name.count
}

// For transformations that might return nil (flatMap):
let number = numeric_string.transform { string in
    Int(string)  // Returns Int? (might be nil if string isn't numeric)
}

// With async support:
let user_profile = await user_id.transform { id in
    await user_service.fetch_profile(for: id)
}
```

#### `when` - Conditional execution based on optional presence

```swift
// Execute code when optional contains a value:
user.when(something: { person in
    analytics.log_user_visit(person.id)
})

// Execute code when optional is nil:
user.when(nothing: {
    analytics.log_anonymous_visit()
})

// Handle both cases with a single method:
user.when(
    something: { person in
        analytics.log_user_visit(person.id)
    },
    nothing: {
        analytics.log_anonymous_visit()
    }
)

// With async support:
await user.when(
    something: { person in
        await analytics.log_user_visit_async(person.id)
    },
    nothing: {
        await analytics.log_anonymous_visit_async()
    }
)
```

#### `optionally` - Chaining multiple optionals

```swift
// Instead of:
let result = primary_value ?? backup_value ?? "Default"

// Use:
let result = primary_value.optionally(backup_value).otherwise("Default")

// With lazy evaluation:
let result = cached_result.optionally {
    compute_expensive_fallback()  // Returns another optional
}.otherwise("Default")

// With async support:
let value = await local_value.optionally {
    await remote_service.fetch_optional_value()
}.otherwise("Default")
```

### Result Extensions

#### `otherwise` - Extracting values with fallbacks

```swift
// Extract the success value or use a default:
let computation_result: Result<Int, Error> = perform_risky_computation()
let value = computation_result.otherwise(0)

// With a lazy-evaluated fallback:
let result = computation_result.otherwise {
    perform_fallback_computation()
}

// With access to the error:
let profile = api_result.otherwise { error in
    // Create a fallback profile using error information
    logger.log("Using default profile due to error: \(error)")
    return default_profile
}

// With async support:
let data = await network_result.otherwise {
    await download_from_backup_server()
}
```

#### `transform` - Transforming success values

```swift
// Transform success values while preserving errors:
let string_result: Result<String, Error> = .success("Hello")
let length_result = string_result.transform { string in
    string.count
}

// For transformations that might fail (flatMap equivalent):
let file_contents_result = file_path_result.transform { path in
    read_file(at: path)  // Returns Result<String, Error>
}

// With async support:
let profile_result = await user_id_result.transform { id in
    await user_service.fetch_profile(for: id)
}
```

#### `when` - Handling success and failure cases

```swift
// Execute code only on success:
user_result.when(success: { user in
    display_user_profile(user)
})

// Execute code only on failure:
user_result.when(failure: { error in
    log_error(error)
})

// Handle both cases in one call:
user_result.when(
    success: { user in
        display_user_profile(user)
    },
    failure: { error in
        display_error_message(for: error)
    }
)

// With method chaining (all `when` methods return self):
user_result
    .when(success: { user in log_user_found(user) })
    .when(failure: { error in log_error(error) })

// With async support:
await user_result.when(
    success: { user in
        await user_service.process_user_async(user)
    },
    failure: { error in
        await error_service.handle_error_async(error)
    }
)
```

#### `recover` - Attempting to recover from failures

```swift
// Try to recover from failures by providing an alternative success:
let data_result: Result<Data, NetworkError> = api.fetch_data()
let recovered_result = data_result.recover { error in
    if cache.has_valid_data_for(request) {
        return cache.get_data_for(request)
    } else {
        return nil  // Unable to recover, will maintain failure
    }
}

// Recover with a different error type:
let data_result: Result<Data, ServiceAError> = service_a.fetch_data()
let recovered_result = data_result.recover { error in
    return service_b.fetch_data()  // Returns Result<Data, ServiceBError>
}

// With async support:
let recovered_result = await data_result.recover { error in
    return await backup_service.try_fetch_data()
}
```

#### `reframe` - Transforming error values

```swift
// Transform error types while preserving success values:
let network_result: Result<Data, NetworkError> = .failure(.connectionLost)
let app_result = network_result.reframe { network_error in
    AppError.network(underlying: network_error)
}

// Complex error handling that might produce a success:
let final_result = network_result.reframe { error in
    if error == .notFound {
        // Return a success with default data
        return .success(default_data)
    } else {
        // Return a new error type
        return .failure(AppError.network(underlying: error))
    }
}

// With async support:
let domain_result = await api_result.reframe { api_error in
    await error_processor.convert_to_domain_error(api_error)
}
```

#### `catching` - Creating results from throwing functions

```swift
// Convert a throwing function call into a Result:
let result = Result<Data, Error>.Catching {
    try file_manager.contents(atPath: path)
}

// Chain with other Result extensions:
let text = Result<Data, Error>.Catching {
    try file_manager.contents(atPath: path)
}.transform { data in
    String(data: data, encoding: .utf8)
}.otherwise("Empty file")

// With async support:
let result = await Result<Data, Error>.Catching {
    try await network_service.fetch_data(from: url)
}
```

### Transmutation Between Result and Optional

#### `transmute` - Converting between Result and Optional

```swift
// Convert an Optional to a Result with a specific error:
let username: String? = get_username_from_database()
let result: Result<String, UserError> = username.transmute(as: UserError.missing_username)

// Convert a Result to an Optional (keeping success value):
let user_result: Result<User, APIError> = api.fetch_user(id: user_id)
let user_optional: User? = user_result.transmute()

// Convert a Result to an Optional (keeping error value):
let error_optional: APIError? = user_result.transmute(.error)
```

## License

Folklore is provided under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).

A copy of the MPLv2 is included [license.md](/license.md) file for convenience.
