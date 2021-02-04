const reduce = (f, previous, iterator) => {
  if (!iterator) {
    iterator = previous[Symbol.iterator]();
    previous = iterator.next().value;
  }
  for (const current of iterator) {
    previous = f(previous, current);
    // 이전 값과 현재 값의 연산이라 이렇게 이름 지음
  }
  return previous;
};

module.exports = reduce;

// const nums = [1, 2, 3, 4, 5];

// console.log(reduce((a, b) => a + b, 0, nums));
// console.log(reduce((a, b) => a + b, nums));
