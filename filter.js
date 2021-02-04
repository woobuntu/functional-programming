const filter = (f, iterator) => {
  const response = [];
  for (const value of iterator) {
    if (f(value)) response.push(value);
  }
  return response;
};

module.exports = filter;

// function* generator() {
//   yield [1, 2];
//   yield [3, 4];
//   yield [5, 6];
// }
// console.log(filter(([a, b]) => a < 5, generator()));
