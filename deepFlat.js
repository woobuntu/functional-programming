const compoundFunctions = require('./compoundFunctions');
const Reserve = require('./Reserve');
const takeAll = require('./takeAll');

const deepFlat = compoundFunctions(Reserve.deepFlat, takeAll);
// listProcessing([1, 2, [3, [4], 5], 6, 7], deepFlat, console.log);

module.exports = deepFlat;
