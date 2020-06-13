const path = require('path');
const { execSync } = require('child_process');
const prompt = require('inquirer').createPromptModule();
const { configFilePath } = require('../config/index');
const { readFile } = require('../util/secure.local.file');
const { error, warning, info } = require('../util/xlog');

module.exports = async () => {
  const store = readFile(configFilePath);
  store.host = store.host || {};
  if (Object.keys(store.host).length === 0) {
    warning('请先添加一个用户和主机信息');
    process.exit(0);
  }
  const { alias } = await prompt({
    name: 'alias',
    message: '选择登录的主机',
    type: 'list',
    choices: Object.keys(store.host).map(key => {
      return {
        name: `${key}(${store.host[key].host})`,
        value: key,
      };
    })
  });
  const hostInfo = store.host[alias];
  const userInfo = store.user[hostInfo.user];
  if (!userInfo) {
    error(`${hostInfo.user}已被删除，请修改主机信息`);
    process.exit(0);
  }
  info(`ssh ${userInfo.user}@${hostInfo.host} -p ${hostInfo.port}`);
  try {
    execSync(`${path.resolve(__dirname, '../shell/login.sh')} '${userInfo.user}' '${hostInfo.host}' '${userInfo.password}' ${hostInfo.port}`, {
      stdio: 'inherit'
    });
  } catch (e) {
    error(e.message);
  };
}