const infinity = require("./infinity");
const limit = require("./limit");

function* odds(end) {
  for (const num of limit(end, infinity())) {
    if (num % 2) yield num;
    if (num == limit) return "done";
  }
}

module.exports = odds;
