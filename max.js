const curry = require('./curry');
const ignore = require('./ignore');

// 주어진 이터러블에서 최대 limit만큼만 잘라서 반환하는 함수
const max = curry((limit, iterable) => {
  const response = [];
  const wellFormedIterator = iterable[Symbol.iterator]();
  return (function recursive() {
    let cur;
    while (!(cur = wellFormedIterator.next()).done) {
      // for of문에서 return을 사용하면 제너레이터가 closed상태가 되는 상황이 발생
      // for of문에서 return문을 사용할 경우 해당 이터레이터(제너레이터)의
      // return메소드를 호출한다고 한다.
      const { value } = cur;
      if (value instanceof Promise)
        return value.then(
          settled =>
            // 이게 무슨 문법...?
            (response.push(settled), response).length == limit
              ? response
              : recursive(),
          error => (error == ignore ? recursive() : Promise.reject(error)),
        );
      response.push(value);
      if (response.length == limit) return response;
    }
    return response;
  })();
});

module.exports = max;
