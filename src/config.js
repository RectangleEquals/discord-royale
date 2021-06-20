const config = require('../config/config.json');

function conf(key) {
  return eval("process.env." + key + " || config." + key);
};

module.exports = { config: conf };