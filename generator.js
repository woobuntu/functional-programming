function* generator() {
  yield 1;
  yield 2;
  yield 3;
  return 100;
}

const iterator = generator();
