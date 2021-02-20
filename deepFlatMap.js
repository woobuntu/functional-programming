const curry = require('./curry');
const compoundFunctions = require('./compoundFunctions');
const Reserve = require('./Reserve');
const takeAll = require('./takeAll');

const deepFlatMap = curry(compoundFunctions(Reserve.deepFlatMap, takeAll));
// listProcessing(
//   [1, 2, [3, [4], 5], 6, 7],
//   deepFlatMap(v => v * v * v),
//   console.log,
// );

module.exports = deepFlatMap;
