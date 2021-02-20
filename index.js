const Reserve = require('./Reserve');
const compoundFunctions = require('./compoundFunctions');
const curry = require('./curry');
const deepFlat = require('./deepFlat');
const deepFlatMap = require('./deepFlatMap');
const dequeue = require('./dequeue');
const filter = require('./filter');
const find = require('./find');
const ignore = require('./ignore');
const isIterable = require('./isIterable');
const join = require('./join');
const listProcessing = require('./listProcessing');
const map = require('./map');
const max = require('./max');
const objectToQueryString = require('./objectToQueryString');
const range = require('./range');
const reduce = require('./reduce');
const reduceHelper = require('./reduceHelper');
const takeAll = require('./takeAll');
const thenify = require('./thenify');

module.exports = {
  compoundFunctions,
  curry,
  deepFlat,
  deepFlatMap,
  dequeue,
  filter,
  find,
  ignore,
  isIterable,
  join,
  listProcessing,
  map,
  max,
  objectToQueryString,
  range,
  reduce,
  reduceHelper,
  takeAll,
  thenify,
  Reserve,
};
listProcessing(
  [1, 2, 3, 4],
  Reserve.map(a => Promise.resolve(a * a)),
  Reserve.filter(a => Promise.resolve(a % 2)),
  reduce((a, b) => a + b),
  console.log,
);
