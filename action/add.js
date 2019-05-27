const _ = require('lodash');
const prompt = require('inquirer').createPromptModule();

const { writeFile, readFile } = require('../util/file');
const { types } = require('../config/index');

const write = {
  async user() {
    const result = {};
    const data = readFile('user');

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
    const { group } = await prompt({
      name: 'group',
      message: `请为这个用户分配一个别名：`,
      type: 'input',
      default: 'default',
      validate(value) {
        if (!value) {
          return `别名不能为空`;
        }
        if (data[value]) {
          return `别名 [${value}] 已存在，如需修改，请使用[qss config]命令`;
        }
        return true;
      }
    });
    result[`${group}`] = {
      user,
      password
    };

    writeFile('user', _.extend(data, result));
  },
  async host() {
    const result = {};
    const data = readFile('host');
    const { host } = await prompt({
      name: 'host',
      message: '请输入主机地址或别名，如[192.168.1.0/infa1v.bjtb.org.io]：',
      type: 'input',
      validate(value) {
        if (!value) {
          return `主机地址不能为空`;
        }
        if (data[value]) {
          return `主机 [${value}] 已存在，如需修改，请使用[qss config]命令`;
        }
        return true;
      }
    });
    const { port } = await prompt({
      name: 'password',
      message: `请输入ssh端口：`,
      default: 22,
      type: 'input',
    });
    const { name } = await prompt({
      name: 'name',
      message: `为主机 [${host}] 取一个自定义名称：`,
      type: 'input',
    });
    const users = readFile('user');
    const { user } = await prompt({
      name: 'user',
      message: `分配一个登陆用的账号密码：`,
      type: 'list',
      choices: Object.keys(users),
    });
    result[`${host}`] = {
      host,
      name,
      user,
      port
    };

    writeFile('host', _.extend(data, result));
  }
};

module.exports = async function () {
  const { type } = await prompt({
    name: 'type',
    message: '你要配置用户还是主机信息？',
    type: 'list',
    choices: ['用户', '主机'],
  });
  write[`${types[type]}`]();
}