const max = require('./max');
const thenify = require('./thenify');

const dequeue = iterator => thenify(max(1, iterator), ([head]) => head);

module.exports = dequeue;
