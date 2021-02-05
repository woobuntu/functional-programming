const {
  map,
  filter,
  reduce,
  listProcessing,
  compoundFunctions,
  curry,
} = require("./index");

const products = [
  { name: "a", price: 10000, quantity: 1 },
  { name: "b", price: 15000, quantity: 2 },
  { name: "c", price: 20000, quantity: 3 },
  { name: "d", price: 25000, quantity: 4 },
  { name: "e", price: 30000, quantity: 5 },
];

const add = (a, b) => a + b;

const sum = curry((f, iter) => listProcessing(iter, map(f), reduce(add)));
// const sum = (f) => compoundFunctions(map(f), reduce(add));
// 둘 다 결과는 같은데 왜 굳이 예시를 위에 걸로 들었을까...?
// 결국 sum이 반환하는 값이 함수여야 한다면 compoundFunctions를 쓰는 게 더 목적적합한 거 아닐까?

const total_quantity = sum((p) => p.quantity);
const total_price = sum((p) => p.price * p.quantity);
console.log(total_quantity(products));
console.log(total_price(products));
