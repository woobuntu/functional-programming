function* limit(end, wellFormedIterator) {
  for (const num of wellFormedIterator) {
    yield num;
    if (num == end) return;
  }
}
// 전달한 이터레이터를 인자로 전달한 지점까지만 순회하도록 하는 역할

module.exports = limit;
