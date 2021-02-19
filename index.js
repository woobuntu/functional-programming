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

const map = curry((f, iterable) => {
  const response = [];
  for (const valueOfNext of iterable) {
    // for of문의 of가 iterable의 [Symbol.iterator]를 호출한다.
    // 그 결과 반환되는 것이 well-formed 이터레이터이므로 연속해서 [Symbol.iterator]를 호출해도 계속
    // well-formed 이터레이터 자신이 반환되므로 순회가 가능한 것
    response.push(f(valueOfNext));
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

const filter = curry((f, iterable) => {
  const response = [];
  for (const valueOfNext of iterable) {
    if (f(valueOfNext)) response.push(valueOfNext);
  }
  return response;
});
// function* generator() {
//   yield [1, 2];
//   yield [3, 4];
//   yield [5, 6];
// }
// console.log(filter(([a, b]) => a < 5, generator()));

const reduce = curry((f, accumulatedValue, iterable) => {
  if (!iterable) {
    iterable = accumulatedValue[Symbol.iterator]();
    accumulatedValue = iterable.next().value;
  }
  for (const valueOfNext of iterable) {
    accumulatedValue = f(accumulatedValue, valueOfNext);
    // 누적 값과 현재 값의 연산이라 이렇게 이름 지음
  }
  return accumulatedValue;
});
// const nums = [1, 2, 3, 4, 5];
// console.log(reduce((a, b) => a + b, 0, nums));
// console.log(reduce((a, b) => a + b, nums));

const listProcessing = (...args) => reduce((iterable, f) => f(iterable), args);
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

const range = limit => {
  const response = [];
  for (let i = 0; i < limit; i++) response.push(i);
  return response;
};

// 주어진 이터러블에서 최대 limit만큼만 잘라서 반환하는 함수
const max = curry((limit, iterable) => {
  const response = [];
  for (const valueOfNext of iterable) {
    response.push(valueOfNext);
    if (response.length == limit) return response;
  }
  // 이터러블의 모든 값을 순회해도 limit에 못 미치는 경우가 있으니
  return response;
});

const objectToQueryString = compoundFunctions(
  Object.entries,
  map(([key, value]) => `${key}=${value}`),
  reduce((prevQuery, curQuery) => `${prevQuery}&${curQuery}`),
);
console.log(objectToQueryString({ limit: 10, offset: 10, type: 'notice' }));

// 평가를 유보한다는 것은 바꿔 말하면 꼭 필요한 값만 평가하겠다는 것이 된다.
// max나 reduce같은 함수와 결합했을 때 그때 그때 필요한 값만 평가하기 때문에 효율이 높다
const Reserve = {
  *range(limit) {
    for (let i = 0; i < limit; i++) yield i;
  },
  map: curry(function* (f, iterable) {
    for (const valueOfNext of iterable) yield f(valueOfNext);
  }),
  filter: curry(function* (f, iterable) {
    for (const valueOfNext of iterable) if (f(valueOfNext)) yield next;
    // next메소드를 호출할 때마다 다음 yield문까지 실행
    // 즉, 이 경우 f(iterable)이 true일 때만 yield하므로
    // f(iterable)이 false인 경우 f(iterable)
  }),
};

// listProcessing(
//   range(10),
//   map(a => {
//     console.log('map : ', a);
//     return a + 10;
//   }),
//   filter(a => {
//     console.log('filter : ', a);
//     return a % 2;
//   }),
//   max(2),
//   console.log,
// );

// listProcessing(
//   Reserve.range(10),
//   // well-formed 이터레이터 반환
//   Reserve.map(a => {
//     console.log('map : ', a);
//     return a + 10;
//   }),
//   // well-formed 이터레이터 반환
//   Reserve.filter(a => {
//     console.log('filter : ', a);
//     return a % 2;
//   }),
//   // well-formed 이터레이터 반환
//   max(2),
//   console.log,
// );
// for of문으로 next메소드가 호출될 때마다 next의 value값을 산정하기 위해
// 이터레이터를 거슬러 올라가고, yield문을 실행하면서 next의 value값을
// 뱉으면서 내려온다.
// 재귀가 콜스택을 쌓아올려가는 반면, 제너레이터는 yield로 제어권을 즉각 반환하므로
// 콜스택이 많이 쌓이지 않는다.

module.exports = {
  map,
  filter,
  reduce,
  listProcessing,
  compoundFunctions,
  curry,
  range,
  max,
  Reserve,
};
