const ignore = require('./ignore');

const reduceHelper = (acc, cur, f) =>
  cur instanceof Promise
    ? cur.then(
        settled => f(acc, settled),
        error => (error == ignore ? acc : Promise.reject(error)),
      )
    : f(acc, cur);
// 얘를 recursive안에서 구현하니까 acc가 cur.then의 결과물인 Promise<pending>으로 잡히는 현상이 발생함;;
// 비동기라서 cur.then안에서 잡히는 acc가 cur.then스스로이기 때문에 발생한 문제였음;;
// 그래서 이렇게 함수로 분리하여 스코프를 구분해줘야 한다.

module.exports = reduceHelper;
