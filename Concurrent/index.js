const reduce = require('../reduce');
const curry = require('../curry');
const max = require('../max');
const Reserve = require('../Reserve');
const compoundFunctions = require('../compoundFunctions');

function doNoting() {}
const catchIgnore = arr => (
  arr.forEach(v => (v instanceof Promise ? v.catch(doNoting) : v)), arr
  // 이게 무슨 문법일까... 앞에 것 평가하고 평가하고 난 다음의 뒤에 것을 반환?
  //   표현식의 일종인가....
);
// 이렇게 forEach를 돌며 미리 catch를 해주는 이유는
// reduce를 돌 때 uncaught에러 로그가 뜨지 않도록 해주기 위함이다.
// 물론 로그가 남도록 해도 작동에는 문제가 없기는 하다.
// map이 아니라 forEach로 한 것은, catch 메소드를 걸어두기 위함이지
// 이미 에러를 잡은 프라미스를 전달하려는 것이 아니기 때문이다.
// 이미 에러를 잡은 프라미스를 전달해버리면, 이미 settled된 프라미스이기 때문에
// 다시 catch로 에러를 잡는 것이 불가능해진다.
// (솔직히 제대로 이해하진 못함)
// 일단 핵심은 '평가가 이루어진 스코프에서 에러핸들링을 해놔야 핸들링 안 된 에러를 브라우저에
// 찍지 않는다'는 것이다.
// 한 콜스택 내에서 에러핸들링이 이루어져야 한다는 의미이기도 한 듯 한데...

const Concurrent = {};

Concurrent.reduce = curry((f, acc, iterable) =>
  iterable
    ? reduce(f, acc, catchIgnore([...iterable]))
    : reduce(f, catchIgnore([...acc])),
);
// reduce앞에서 평가를 지연시켜두었다면, reduce로 넘겨지는 것은 제너레이터가 반환한 이터레이터일 것이다.
// 해당 이터레이터에 전개연산자를 적용하면 해당 이터레이터의 끝까지 전부 순회시켜두는 것이다.
// 일반적인 reduce에서는 recursive의 acc.then에서 현재 비동기의 결과를 기다렸다가
// 값이 도착하면 다시 next를 실행하여 이전의 지연된 이터레이터의 평가를 하기 때문에
// 이터레이터가 비동기의 간격만큼 순차적으로 순회되는 반면,
// Concurrent.reduce는 전달받은 이터레이터를 이미 다 순회를 시켜놓고 시작하기 때문에
// 이터레이터가 간격 없이 순차적으로 실행되어 사실상 동시 출발이나 다름 없게 되는 것

Concurrent.max = curry((limit, iterable) =>
  max(limit, catchIgnore([...iterable])),
);

Concurrent.takeAll = Concurrent.max(Infinity);

Concurrent.map = curry(compoundFunctions(Reserve.map, Concurrent.takeAll));

Concurrent.filter = curry(
  compoundFunctions(Reserve.filter, Concurrent.takeAll),
);

module.exports = Concurrent;
// 오해해서는 안 되는 것이, Concurrent가 만능인 것은 아니라는 것.
// 지연 평가는 최소한의 평가를 통한 효율성을 얻고자 함이고,
// 동시 평가는 컴퓨터 자원은 최대한 많이 쓰되, 최대한 빨리 결과를 얻기 위함이다.
// 즉, 지연 평가 이후 동시 평가로 결과를 내면 사실상 지연 평가의 장점은 잃게 되는 것
// (안 해도 되는 평가까지 모두 해버리니까)
