//// Folklore - Functional patterns for safer code
////
//// This module provides types for handling optional values and errors
//// in a type-safe way.

import folklore/option
import folklore/result

// Re-export option functions (used by TypeScript Maybe wrapper)
pub const just = option.just

pub const nothing = option.nothing

pub const is_just = option.is_just

pub const is_nothing = option.is_nothing

// Re-export result functions
pub const ok = result.ok

pub const error = result.error

pub const is_ok = result.is_ok

pub const is_error = result.is_error
