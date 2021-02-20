const curry = require('./curry');
const listProcessing = require('./listProcessing');
const Reserve = require('./Reserve');
const takeAll = require('./takeAll');

const filter = curry((f, iterable) =>
  listProcessing(iterable, Reserve.filter(f), takeAll),
);

module.exports = filter;
