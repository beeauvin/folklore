import gleam/option

pub fn just(value: a) -> option.Option(a) {
  option.Some(value)
}

pub fn nothing() -> option.Option(a) {
  option.None
}

pub fn is_just(maybe: option.Option(a)) -> Bool {
  case maybe {
    option.Some(_) -> True
    option.None -> False
  }
}

pub fn is_nothing(maybe: option.Option(a)) -> Bool {
  case maybe {
    option.Some(_) -> False
    option.None -> True
  }
}

pub fn map(maybe: option.Option(a), mapper: fn(a) -> b) -> option.Option(b) {
  case maybe {
    option.Some(value) -> option.Some(mapper(value))
    option.None -> option.None
  }
}

pub fn chain(
  maybe: option.Option(a),
  mapper: fn(a) -> option.Option(b),
) -> option.Option(b) {
  case maybe {
    option.Some(value) -> mapper(value)
    option.None -> option.None
  }
}

pub fn get_or_else(maybe: option.Option(a), default: a) -> a {
  case maybe {
    option.Some(value) -> value
    option.None -> default
  }
}

pub fn or_else(
  maybe: option.Option(a),
  handler: fn() -> option.Option(a),
) -> option.Option(a) {
  case maybe {
    option.Some(_) -> maybe
    option.None -> handler()
  }
}

pub fn unwrap_with(maybe: option.Option(a), fallback: fn() -> a) -> a {
  case maybe {
    option.Some(value) -> value
    option.None -> fallback()
  }
}
