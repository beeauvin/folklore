pub fn ok(value: value) -> Result(value, error) {
  Ok(value)
}

pub fn error(err: error) -> Result(value, error) {
  Error(err)
}

pub fn is_ok(res: Result(value, error)) -> Bool {
  case res {
    Ok(_) -> True
    Error(_) -> False
  }
}

pub fn is_error(res: Result(value, error)) -> Bool {
  case res {
    Ok(_) -> False
    Error(_) -> True
  }
}

pub fn map(
  res: Result(value, error),
  mapper: fn(value) -> other,
) -> Result(other, error) {
  case res {
    Ok(v) -> Ok(mapper(v))
    Error(e) -> Error(e)
  }
}

pub fn map_error(
  res: Result(value, error),
  mapper: fn(error) -> other_error,
) -> Result(value, other_error) {
  case res {
    Ok(v) -> Ok(v)
    Error(e) -> Error(mapper(e))
  }
}

pub fn chain(
  res: Result(value, error),
  mapper: fn(value) -> Result(other, error),
) -> Result(other, error) {
  case res {
    Ok(v) -> mapper(v)
    Error(e) -> Error(e)
  }
}

pub fn get_or_else(res: Result(value, error), default: value) -> value {
  case res {
    Ok(v) -> v
    Error(_) -> default
  }
}

pub fn or_else(
  res: Result(value, error),
  handler: fn(error) -> Result(value, error),
) -> Result(value, error) {
  case res {
    Ok(_) -> res
    Error(e) -> handler(e)
  }
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
