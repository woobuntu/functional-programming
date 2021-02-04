function* infinity(start = 0) {
  while (true) yield start++;
}

module.exports = infinity;
