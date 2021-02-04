const map = (f, iterator) => {
  const response = [];
  for (const value of iterator) {
    response.push(f(value));
  }
  return response;
};

module.exports = map;
// 자바스크립트 내장 객체인 String객체나
// 웹 API인 NodeList 같은 경우는 이터러블 프로토콜을 따름에도 불구하고
// map이 내장 메소드로 구현되어 있지 않아 map을 사용할 수 없다.
// 위와 같이 구현한 map함수는 적어도 이터러블 프로토콜을 지원하는 모든 데이터에 적용이 가능하다
// (다형성이 높다! 클래스나 프로토타입보다 나은 이유!)
// 그런데 제너레이터 함수를 이용하면 사실상 모든 데이터에 이터러블 프로토콜을 지원할 수 있다는 거!

// function* generator() {
//   yield [1, 2];
//   yield [3, 4];
//   yield [5, 6];
// }
// console.log(map(([a, b]) => a, generator()));
