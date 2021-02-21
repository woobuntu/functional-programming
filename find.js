const curry = require('./curry');
const Reserve = require('./Reserve');
const max = require('./max');
const listProcessing = require('./listProcessing');

const find = curry((f, iterable) =>
  listProcessing(
    iterable,
    Reserve.filter(v => f(v)),
    max(1),
    ([found]) => found,
  ),
);
// 조건에 맞춰 filter하고, 최대 1개까지만 꺼내겠다는,
// 아주 이해하기 쉬운 선언적 코드

// listProcessing(
//   [1, 2, 3],
//   find(v => v % 2),
//   console.log,
// );

module.exports = find;
