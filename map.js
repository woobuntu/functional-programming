const curry = require('./curry');
const Reserve = require('./Reserve');
const takeAll = require('./takeAll');
const listProcessing = require('./listProcessing');

const map = curry((f, iterable) =>
  listProcessing(iterable, Reserve.map(f), takeAll),
);
// 아래처럼 축약할 수도 있지만 다시 볼 때 바로 이해 안 될 것 같아서 그냥 위의 형태 유지
// const map = curry((f, iterable) =>
//   listProcessing(Reserve.map(f, iterable), takeAll),
// );
// const map = curry(compoundFunctions(Reserve.map, takeAll));

module.exports = map;
