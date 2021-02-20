const curry = require('./curry');
const reduce = require('./reduce');

// join이 reduce를 이용한다는 것은 join이 받을 값을 '지연(유보)'할 수 있다는 것!
// Array.prototype.join보다(=클래스 기반의 추상화보다) 훨씬 유연함!(=다형성 높음!)
const join = curry((separator = ',', iterable) =>
  reduce((prev, cur) => `${prev}${separator}${cur}`, iterable),
);

module.exports = join;
