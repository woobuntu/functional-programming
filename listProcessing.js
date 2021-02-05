const reduce = require("./reduce");

const listProcessing = (...args) =>
  reduce((iterator, func) => func(iterator), args);

module.exports = listProcessing;

// listProcessing은
// listProcessing(
//   0,
//   (a) => a + 1,
//   (a) => a + 10,
//   (a) => a + 100,
//   console.log
// );
// 와 같이 이터레이터에 적용할 함수를 순차적으로 작성할 수 있게끔 하는 함수이다.
// 즉, 첫번째 인자로 주어지는 이터레이터에 함수를 누적적으로 적용시키는 과정이므로 일종의 reduce이다.
// 그리고 listProcessing에 전달되는 인자들을 나머지 연산자를 이용하여 배열로 잡아내면 이 역시 이터레이터이다.

// const reduce = (f, previous, iterator) => {
//   // 1. f = (iterator, func) => func(iterator)
//   // 1. previous = args
//   // 1. iterator = undefined
//   if (!iterator) {
//     iterator = previous[Symbol.iterator]();
//     previous = iterator.next().value;
//   }
//   // 2. iterator = args[Symbol.iterator]();
//   // 2. previous = args.next().value // 즉, args의 0번째 값
//   for (const current of iterator) {
//     previous = f(previous, current);
//     // previous = ((iterator, func) => func(iterator))(함수 적용이 누적된 이터레이터, 적용할 함수)
//   }
//   return previous;
// };
