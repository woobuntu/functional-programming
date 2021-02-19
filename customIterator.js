const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i == 0 ? { val: i, done: true } : { val: i--, done: false };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  },
  // Symbol.iterator와 '이터레이터'를 구분할 것
  // 보통 말하는 '이터레이터'는 Symbol.iterator를 호출한 결과로 반환되는 객체이다.
};
