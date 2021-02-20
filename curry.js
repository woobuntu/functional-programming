const curry = f => (callBack, ...restArguments) =>
  // 여기서 restArguments를 굳이 전개 연산자로 받는 이유는
  // 혹시 넘겨주는 인자 값이 이터러블이 아닐 수도 있으니 해당 값을 이터러블로 만들어주기 위함
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
//   (iterator) => filter((valueOfNext) => valueOfNext > 1, iterator),
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
//   (iterator) => filter((valueOfNext) => valueOfNext > 1)(iterator),
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
//   filter((valueOfNext) => valueOfNext > 1),
//   reduce((prev, cur) => prev + cur),
//   console.log
// );
// 이렇게 작성할 수 있다는 것으로, 훨씬 가독성이 좋다.
// 즉, map, filter, reduce함수에 callBack만 전달해두면,
// listProcessing하면서 futureArguments를 받을 때 해당 함수가 평가되는 것

module.exports = curry;
