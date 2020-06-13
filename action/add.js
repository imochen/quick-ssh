const prompt = require('inquirer').createPromptModule();

const { writeFile, readFile } = require('../util/secure.local.file');
const { success, error, warning } = require('../util/xlog');
const { configFilePath } = require('../config/index');

const processFunc = {
  async user() {
    const store = readFile(configFilePath);
    store.user = store.user || {};

    const { user } = await prompt({
      name: 'user',
      message: '请输入用户名：',
      type: 'input',
    });
    const { password } = await prompt({
      name: 'password',
      message: `请为用户[${user}]输入密码：`,
      type: 'input',
    });
    const { alias = 'default' } = await prompt({
      name: 'alias',
      message: '请为这个用户分配一个别名：',
      type: 'input',
      default: 'default',
      validate(v) {
        if (!v) return '别名不能为空';
        if (store.user[v]) return `别名 [${v}] 已存在`;
        return true;
      }
    });
    store.user[alias] = {
      user,
      password,
    }
    writeFile(configFilePath, store);
    success('恭喜，添加成功！');
  },
  async host() {
    const store = readFile(configFilePath);
    store.host = store.host || {};
    store.user = store.user || {};

    if (Object.keys(store.user).length === 0) {
      warning('请先添加一个用户，再添加主机信息');
      process.exit(0);
    }

    const { host } = await prompt({
      name: 'host',
      message: '请输入主机地址或别名，如[10.0.0.12/infa1v.bjtb.org.io]：',
      type: 'input',
    });
    const { port = 22 } = await prompt({
      name: 'password',
      message: `请输入ssh端口：`,
      default: 22,
      type: 'input',
    });
    const { alias } = await prompt({
      name: 'alias',
      message: `为主机 [${host}] 取一个自定义名称：`,
      type: 'input',
      validate(v) {
        if (!v) return '别名不能为空';
        if (store.host[v]) return `别名 [${v}}] 已存在`;
        return true;
      }
    });

    const { user } = await prompt({
      name: 'user',
      message: `分配一个登陆用的账号：`,
      type: 'list',
      choices: Object.keys(store.user),
    });

    store.host[alias] = {
      host,
      port,
      user,
    }
    writeFile(configFilePath, store);
    success('恭喜，添加成功！');
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