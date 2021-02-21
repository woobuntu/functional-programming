const isIterable = require('../isIterable');
const thenify = require('../thenify');
const curry = require('../curry');
const listProcessing = require('../listProcessing');
const ignore = require('../ignore');

// 평가를 유보한다는 것은 바꿔 말하면 꼭 필요한 값만 평가하겠다는 것이 된다.
// max나 reduce같은 함수와 결합했을 때 그때 그때 필요한 값만 평가하기 때문에 효율이 높다
const Reserve = {};

Reserve.range = function* (limit) {
  for (let i = 0; i < limit; i++) yield i;
};

Reserve.map = curry(function* (f, iterable) {
  for (const valueOfNext of iterable) yield thenify(valueOfNext, f);
});
// map계열의 함수는 결과를 내는 함수가 아니기 때문에 yield값으로 Promise를 반환해도 된다.
// reduce나 max같이 결과를 내는 함수는 Promise값을 풀어주도록 구현

Reserve.filter = curry(function* (f, iterable) {
  for (const valueOfNext of iterable) {
    const thenified = thenify(valueOfNext, f);
    if (thenified instanceof Promise)
      yield thenified.then(settled =>
        settled ? valueOfNext : Promise.reject(ignore),
      );
    // settled가 true일 때 프라미스를 반환해도 어차피 다른 함수에서 then으로 풀어서 사용해주기 때문에 괜찮다.
    // Kelisli 합성에 따라 다음 함수로 아예 인자가 전달되지 않도록 하기 위해 Promise.reject()를 사용
    else if (thenified) yield valueOfNext;
  }
  // next메소드를 호출할 때마다 다음 yield문까지 실행
});

Reserve.entries = function* (obj) {
  for (const key in obj) yield [key, obj[key]];
};

Reserve.deepFlat = function* deepFlat(iterable) {
  for (const valueOfNext of iterable) {
    if (isIterable(valueOfNext)) yield* deepFlat(valueOfNext);
    // yield* 는 다른 제너레이터 혹은 이터러블에 yield를 위임하는 것이다.
    // 재귀로 호출하기 위해 기명함수로 작성
    else yield valueOfNext;
  }
};

Reserve.deepFlatMap = (f, iterable) =>
  listProcessing(iterable, Reserve.deepFlat, Reserve.map(f));
// 이 경우는 deepFlat의 계층이 깊어 결합법칙이 성립하지 않는다
// 때문에 map과 deepFlat의 순서가 바뀌어서는 안 된다.

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

module.exports = Reserve;
