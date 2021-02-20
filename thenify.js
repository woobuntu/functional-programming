const thenify = (value, f) =>
  value instanceof Promise ? value.then(f) : f(value);

module.exports = thenify;
