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

    const targetUserInfo = store.user[alias];

    const { user = targetUserInfo.user } = await prompt({
      name: 'user',
      message: '请输入用户名：',
      default: targetUserInfo.user,
      type: 'input',
    });
    const { password = targetUserInfo.password } = await prompt({
      name: 'password',
      message: `请为用户[${user}]输入密码：`,
      default: targetUserInfo.password,
      type: 'input',
    });

    store.user[alias] = {
      user,
      password,
    }
    writeFile(configFilePath, store);
    success('恭喜，修改成功！');
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

    const targetHostInfo = store.host[alias];

    const { host = targetHostInfo.host } = await prompt({
      name: 'host',
      message: '请输入主机地址或别名，如[10.0.0.12/infa1v.bjtb.org.io]：',
      default: targetHostInfo.host,
      type: 'input',
    });
    const { port = targetHostInfo.port } = await prompt({
      name: 'password',
      message: `请输入ssh端口：`,
      default: targetHostInfo.port,
      type: 'input',
    });

    const { user = targetHostInfo.user } = await prompt({
      name: 'user',
      message: `分配一个登陆用的账号：`,
      type: 'list',
      default: targetHostInfo.user,
      choices: Object.keys(store.user),
    });

    store.host[alias] = {
      host,
      port,
      user,
    }
    writeFile(configFilePath, store);
    success('恭喜，修改成功！');
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