const compoundFunctions = require('./compoundFunctions');
const Reserve = require('./Reserve');
const join = require('./join');

const objectToQueryString = compoundFunctions(
  Reserve.entries,
  Reserve.map(([key, value]) => {
    console.log([key, value]);
    return `${key}=${value}`;
  }),
  // Reserve.map으로 넘겨줘도 정상 동작
  join('&'),
);
// console.log(objectToQueryString({ limit: 10, offset: 10, type: 'notice' }));

module.exports = objectToQueryString;
