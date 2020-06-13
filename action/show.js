const { readFile } = require('../util/secure.local.file');
const { configFilePath } = require('../config/index');
const { info } = require('../util/xlog');

module.exports = async function () {
  const store = readFile(configFilePath);
  info(`\n${JSON.stringify(store, null, 2)}`);
}