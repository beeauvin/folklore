import gleam/option.{type Option, None, Some}

pub fn just(value: a) -> Option(a) {
  Some(value)
}

pub fn nothing() -> Option(a) {
  None
}

pub fn is_just(maybe: Option(a)) -> Bool {
  case maybe {
    Some(_) -> True
    None -> False
  }
}

pub fn is_nothing(maybe: Option(a)) -> Bool {
  case maybe {
    Some(_) -> False
    None -> True
  }
}

pub fn map(maybe: Option(a), mapper: fn(a) -> b) -> Option(b) {
  case maybe {
    Some(value) -> Some(mapper(value))
    None -> None
  }
}

pub fn chain(maybe: Option(a), mapper: fn(a) -> Option(b)) -> Option(b) {
  case maybe {
    Some(value) -> mapper(value)
    None -> None
  }
}

pub fn get_or_else(maybe: Option(a), default: a) -> a {
  case maybe {
    Some(value) -> value
    None -> default
  }
}

pub fn or_else(maybe: Option(a), handler: fn() -> Option(a)) -> Option(a) {
  case maybe {
    Some(_) -> maybe
    None -> handler()
  }
}

pub fn unwrap_with(maybe: Option(a), fallback: fn() -> a) -> a {
  case maybe {
    Some(value) -> value
    None -> fallback()
  }
}
