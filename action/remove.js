const prompt = require('inquirer').createPromptModule();

const { writeFile, readFile } = require('../util/secure.local.file');
const { success, error, warning } = require('../util/xlog');
const { configFilePath } = require('../config/index');

const processFunc = {
  async user() {
    const store = readFile(configFilePath);
    store.user = store.user || {};

    if (Object.keys(store.user).length === 0) {
      warning('您还没有添加过用户信息');
      process.exit(0);
    }

    const { alias } = await prompt({
      name: 'alias',
      message: '请选择要修改的记录',
      type: 'list',
      choices: Object.keys(store.user).map(key => {
        return {
          name: `${key}(${store.user[key].user})`,
          value: key,
        }
      }),
    });
    const { bool } = await prompt({
      name: 'bool',
      message: `将要移除 ${alias}, 请确认`,
      type: 'confirm',
    });
    if (!bool) process.exit(0);

    delete store.user[alias];
    writeFile(configFilePath, store);
    success('恭喜，删除成功！');
  },
  async host() {
    const store = readFile(configFilePath);
    store.host = store.host || {};
    store.user = store.user || {};

    if (Object.keys(store.host).length === 0) {
      warning('您还没有添加过主机信息');
      process.exit(0);
    }

    const { alias } = await prompt({
      name: 'alias',
      message: '请选择要修改的记录',
      type: 'list',
      choices: Object.keys(store.host).map(key => {
        return {
          name: `${key}(${store.host[key].host})`,
          value: key,
        }
      }),
    });
    const { bool } = await prompt({
      name: 'bool',
      message: `将要移除 ${alias}, 请确认`,
      type: 'confirm',
    });
    if (!bool) process.exit(0);
    delete store.host[alias];
    writeFile(configFilePath, store);
    success('恭喜，删除成功！');
  }
}

module.exports = async function () {
  const { type } = await prompt({
    name: 'type',
    message: '请选择要操作的信息类别：',
    type: 'list',
    choices: [
      { name: '用户', value: 'user' },
      { name: '主机', value: 'host' }
    ]
  });
  const func = processFunc[type];
  if (!func) return error(`${type} is invalid`)
  func();
}