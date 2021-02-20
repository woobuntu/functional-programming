const range = limit => {
  const response = [];
  for (let i = 0; i < limit; i++) response.push(i);
  return response;
};

module.exports = range;
