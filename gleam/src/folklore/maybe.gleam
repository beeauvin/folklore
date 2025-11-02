import gleam/option

pub type Maybe(a) =
  option.Option(a)

pub fn just(value: a) -> Maybe(a) {
  option.Some(value)
}

pub fn nothing() -> Maybe(a) {
  option.None
}

pub fn is_just(maybe: Maybe(a)) -> Bool {
  case maybe {
    option.Some(_) -> True
    option.None -> False
  }
}

pub fn is_nothing(maybe: Maybe(a)) -> Bool {
  case maybe {
    option.Some(_) -> False
    option.None -> True
  }
}

pub fn map(maybe: Maybe(a), mapper: fn(a) -> b) -> Maybe(b) {
  case maybe {
    option.Some(value) -> option.Some(mapper(value))
    option.None -> option.None
  }
}

pub fn chain(maybe: Maybe(a), mapper: fn(a) -> Maybe(b)) -> Maybe(b) {
  case maybe {
    option.Some(value) -> mapper(value)
    option.None -> option.None
  }
}

pub fn get_or_else(maybe: Maybe(a), default: a) -> a {
  case maybe {
    option.Some(value) -> value
    option.None -> default
  }
}

pub fn or_else(maybe: Maybe(a), handler: fn() -> Maybe(a)) -> Maybe(a) {
  case maybe {
    option.Some(_) -> maybe
    option.None -> handler()
  }
}

pub fn unwrap_with(maybe: Maybe(a), fallback: fn() -> a) -> a {
  case maybe {
    option.Some(value) -> value
    option.None -> fallback()
  }
}
