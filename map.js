const map = (f, iterator) => {
  const response = [];
  for (const value of iterator) {
    response.push(f(value));
  }
  return response;
};

module.exports = map;

// const a = [
//   { b: 1, c: "a" },
//   { b: 2, c: "b" },
//   { b: 3, c: "c" },
//   { b: 4, c: "d" },
//   { b: 5, c: "e" },
// ];

// console.log(map(({ b, c }) => c, a));
