const curry = require('./curry');
const thenify = require('./thenify');
const dequeue = require('./dequeue');
const reduceHelper = require('./reduceHelper');

const reduce = curry((f, accumulatedValue, iterable) => {
  let wellFormedIterator;
  if (!iterable) {
    wellFormedIterator = accumulatedValue[Symbol.iterator]();
    accumulatedValue = dequeue(wellFormedIterator);
    return reduce(f, accumulatedValue, wellFormedIterator);
  }

  wellFormedIterator = iterable[Symbol.iterator]();
  return thenify(accumulatedValue, function recursive(acc) {
    let cur;
    while (!(cur = wellFormedIterator.next()).done) {
      const { value } = cur;
      acc = reduceHelper(acc, value, f);
      if (acc instanceof Promise) return acc.then(recursive);
    }
    // 만약 acc가 프라미스 값이라면 다시 recursive로 넘긴다.
    // 그렇게 호출된 recursive에서도 iterable은 자신의 상태를 유지하고 있기 때문에
    // 다음 순회값에 f를 적용할 수 있다.
    // 굳이 이렇게 재귀 함수를 만들어 즉시 실행시키는 이유는,
    // listProcessing을 진행하면서 프라미스로 값을 넘기지 않기 위해서이다.
    // listProcessing의 과정 중에서 비동기 값 이후에 동기적으로 적용시킬 함수를 합성할 수도 있기 때문.
    // 그리고 재귀라고 해도 비동기로 적용시키는 함수를 만날 때만 콜스택+1이 되는 것이기에
    // 성능 상의 문제도 걱정하지 않아도 된다.
    return acc;
  });
});
// 자바스크립트 내장 객체인 String객체나
// 웹 API인 NodeList 같은 경우는 이터러블 프로토콜을 따름에도 불구하고
// reduce가 내장 메소드로 구현되어 있지 않아 reduce를 사용할 수 없다.
// 위와 같이 구현한 reduce함수는 적어도 이터러블 프로토콜을 지원하는 모든 데이터에 적용이 가능하다
// (다형성이 높다! 클래스나 프로토타입보다 나은 이유!)
// 그런데 제너레이터 함수를 이용하면 사실상 모든 데이터에 이터러블 프로토콜을 지원할 수 있다는 거!

// const nums = [1, 2, 3, 4, 5];
// console.log(reduce((a, b) => a + b, 0, nums));
// console.log(reduce((a, b) => a + b, nums));

module.exports = reduce;
