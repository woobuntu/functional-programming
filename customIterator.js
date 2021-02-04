const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i == 0 ? { value: i, done: true } : { value: i--, done: false };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};
// 위와 같이 이터레이터가 '{ value, done }객체를 반환하는' next메소드와 '자기 자신을 반환하는' 이터레이터 메소드를
// 프로퍼티로 가지는 객체를 반환할 때, 이를 well-formed 이터레이터라고 한다.
