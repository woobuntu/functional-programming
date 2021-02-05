const curry = (f) => (callBack, ...restArguments) =>
  restArguments.length
    ? f(callBack, ...restArguments)
    : (...futureArguments) => f(callBack, ...futureArguments);
// curry는 특정 함수의 평가 시점을 조정하기 위한 함수이다.
// 여기서는 map, filter, reduce등의 함수가 콜백과 이터레이터를 나눠서 전달받을 수 있게끔 함으로써
// listProcessing과 compoundFunctions의 가독성과 코드 작성의 편의성을 높이기 위한 것이다.
// map, filter, reduce등의 함수에 curry함수를 적용해주기 전에는,
// listProcessing(
//   [
//     { a: 1, b: "a" },
//     { a: 2, b: "b" },
//     { a: 3, b: "c" },
//   ],
//   (iterator) => map(({ a, b }) => a, iterator),
//   (iterator) => filter((value) => value > 1, iterator),
//   (iterator) => reduce((prev, cur) => prev + cur, iterator),
//   console.log
// );
// 이렇게 작성해야 했다면,
// curry 함수를 적용하여 map, filter, reduce를 리팩토링한 이후에는
// listProcessing(
//   [
//     { a: 1, b: "a" },
//     { a: 2, b: "b" },
//     { a: 3, b: "c" },
//   ],
//   (iterator) => map(({ a, b }) => a)(iterator),
//   (iterator) => filter((value) => value > 1)(iterator),
//   (iterator) => reduce((prev, cur) => prev + cur)(iterator),
//   console.log
// );
// 이렇게 작성할 수 있다는 것이고,
// 이렇게 (인자)=>함수(인자)의 형태로 표현한 것은
// listProcessing(
//   [
//     { a: 1, b: "a" },
//     { a: 2, b: "b" },
//     { a: 3, b: "c" },
//   ],
//   map(({ a, b }) => a),
//   filter((value) => value > 1),
//   reduce((prev, cur) => prev + cur),
//   console.log
// );
// 이렇게 작성할 수 있다는 것으로, 훨씬 가독성이 좋다.
// 즉, map, filter, reduce함수에 callBack만 전달해두면,
// listProcessing하면서 futureArguments를 받을 때 해당 함수가 평가되는 것

const map = curry((f, iterator) => {
  const response = [];
  for (const value of iterator) {
    response.push(f(value));
  }
  return response;
});
// 자바스크립트 내장 객체인 String객체나
// 웹 API인 NodeList 같은 경우는 이터러블 프로토콜을 따름에도 불구하고
// map이 내장 메소드로 구현되어 있지 않아 map을 사용할 수 없다.
// 위와 같이 구현한 map함수는 적어도 이터러블 프로토콜을 지원하는 모든 데이터에 적용이 가능하다
// (다형성이 높다! 클래스나 프로토타입보다 나은 이유!)
// 그런데 제너레이터 함수를 이용하면 사실상 모든 데이터에 이터러블 프로토콜을 지원할 수 있다는 거!

// function* generator() {
//   yield [1, 2];
//   yield [3, 4];
//   yield [5, 6];
// }
// console.log(map(([a, b]) => a, generator()));

const filter = curry((f, iterator) => {
  const response = [];
  for (const value of iterator) {
    if (f(value)) response.push(value);
  }
  return response;
});
// function* generator() {
//   yield [1, 2];
//   yield [3, 4];
//   yield [5, 6];
// }
// console.log(filter(([a, b]) => a < 5, generator()));

const reduce = curry((f, accumulatedValue, iterator) => {
  if (!iterator) {
    iterator = accumulatedValue[Symbol.iterator]();
    accumulatedValue = iterator.next().value;
  }
  for (const currentValue of iterator) {
    accumulatedValue = f(accumulatedValue, currentValue);
    // 누적 값과 현재 값의 연산이라 이렇게 이름 지음
  }
  return accumulatedValue;
});
// const nums = [1, 2, 3, 4, 5];
// console.log(reduce((a, b) => a + b, 0, nums));
// console.log(reduce((a, b) => a + b, nums));

const listProcessing = (...args) => reduce((iterator, f) => f(iterator), args);
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

// const reduce = curry((f, previous, iterator) => {
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
// });

const compoundFunctions = (firstFunction, ...restFunctions) => (...iterator) =>
  listProcessing(firstFunction(...iterator), ...restFunctions);
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

module.exports = {
  map,
  filter,
  reduce,
  listProcessing,
  compoundFunctions,
  curry,
};
