import gleam/result

pub fn ok(value: value) -> Result(value, error) {
  Ok(value)
}

pub fn error(err: error) -> Result(value, error) {
  Error(err)
}

pub fn is_ok(res: Result(value, error)) -> Bool {
  result.is_ok(res)
}

pub fn is_error(res: Result(value, error)) -> Bool {
  result.is_error(res)
}

pub fn map(
  res: Result(value, error),
  mapper: fn(value) -> other,
) -> Result(other, error) {
  result.map(res, mapper)
}

pub fn map_error(
  res: Result(value, error),
  mapper: fn(error) -> other_error,
) -> Result(value, other_error) {
  result.map_error(res, mapper)
}

pub fn chain(
  res: Result(value, error),
  mapper: fn(value) -> Result(other, error),
) -> Result(other, error) {
  result.try(res, mapper)
}

pub fn get_or_else(res: Result(value, error), default: value) -> value {
  result.unwrap(res, default)
}

pub fn or_else(
  res: Result(value, error),
  handler: fn(error) -> Result(value, error),
) -> Result(value, error) {
  result.try_recover(res, handler)
}

pub fn unwrap_ok_with(
  res: Result(value, error),
  fallback: fn(error) -> value,
) -> value {
  case res {
    Ok(v) -> v
    Error(e) -> fallback(e)
  }
}

pub fn unwrap_error_with(
  res: Result(value, error),
  fallback: fn(value) -> error,
) -> error {
  case res {
    Ok(v) -> fallback(v)
    Error(e) -> e
  }
}

pub fn match_with(
  res: Result(value, error),
  on_ok: fn(value) -> a,
  on_error: fn(error) -> a,
) -> a {
  case res {
    Ok(v) -> on_ok(v)
    Error(e) -> on_error(e)
  }
}

pub fn merge(res: Result(a, a)) -> a {
  case res {
    Ok(v) -> v
    Error(e) -> e
  }
}

pub fn map_error_replace(
  res: Result(value, error),
  new_error: other_error,
) -> Result(value, other_error) {
  case res {
    Ok(v) -> Ok(v)
    Error(_) -> Error(new_error)
  }
}
