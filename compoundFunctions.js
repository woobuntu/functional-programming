const listProcessing = require('./listProcessing');

const compoundFunctions = (firstFunction, ...restFunctions) => (...iterable) =>
  listProcessing(firstFunction(...iterable), ...restFunctions);
// compoundFunctions는
// const f = compoundFunctions(
//   (a, b) => a + b,
//   (a) => a + 1,
//   (a) => a + 10,
//   (a) => a + 100,
//   console.log
// );
// 와 같이 함수를 합성하여 반환하는 함수이다.
// f(0, 1);
// 즉, listProcessing의 평가 시점을 지연시키는 함수라고 볼 수 있다.
// 주의해야할 점이 하나 있다면, listProcessing에서는
// const add = (a, b) => a + b;
// listProcessing(
//   add(3, 5),
//   (a) => a + 1,
//   (a) => a + 10,
//   (a) => a + 100,
//   console.log
// );
// 와 같이 순환시킬 값을 두 개 이상의 인자를 넘겨서 만들 수 있기에,
// compoundFunctions에서도 동일하게 작동하게끔 하기 위해서는
// 첫번째로 적용시킬 함수를 따로 빼서 순환시킬 값에 적용시켜 도출된 값을 이후의 함수에 적용해야 한다는 것이다.

module.exports = compoundFunctions;
