const _ = require('lodash');
const prompt = require('inquirer').createPromptModule();

const {writeFile, readFile} = require('../util/file');
const {types} = require('../config/index');

const config = {
  async user() {
    const users = readFile('user');
    const {user} = await prompt({
      name: 'user',
      message: '请选择一个用户：',
      type: 'list',
      choices: Object.keys(users)
    });
    const {action} = await prompt({
      name: 'action',
      message: '你希望删除还是修改？',
      type: 'list',
      choices: ['修改', '删除']
    });
    if (action === '删除') {
      const {bool} = await prompt({
        name: 'bool',
        message: '确定要删除吗？',
        type: 'confirm',
      });
      if (!bool) {
        process.exit();
      }
      delete users[user];
      writeFile('user', users);
    } else {
      const result = {};
      const tmp = users[user];
      delete users[user];
      const {newUser} = await prompt({
        name: 'newUser',
        message: '请输入用户名：',
        type: 'input',
        default: tmp.user
      });
      const {newPassword} = await prompt({
        name: 'newPassword',
        message: `请为用户[${newUser}]输入密码：`,
        type: 'input',
        default: tmp.password
      });
      const {newGroup} = await prompt({
        name: 'newGroup',
        message: `请为这个用户分配一个别名：`,
        type: 'input',
        default: user,
        validate(value) {
          if (!value) {
            return `别名不能为空`;
          }
          if (users[value]) {
            return `别名 [${value}] 已存在，如需修改，请使用[qss config]命令`;
          }
          return true;
        }
      });
      result[`${newGroup}`] = {
        user: newUser,
        password: newPassword
      };
      writeFile('user', _.extend(users, result));
    }
  },
  async host() {
    const data = readFile('host');
    const {host} = await prompt({
      name: 'host',
      message: '请选择一个主机：',
      type: 'list',
      choices: Object.keys(data)
    });
    const {action} = await prompt({
      name: 'action',
      message: '你希望删除还是修改？',
      type: 'list',
      choices: ['修改', '删除']
    });
    if (action === '删除') {
      const {bool} = await prompt({
        name: 'bool',
        message: '确定要删除吗？',
        type: 'confirm',
      });
      if (!bool) {
        process.exit();
      }
      delete data[host];
      writeFile('user', data);
    } else {
      const result = {};
      const tmp = data[host];
      delete data[host];
      const {newHost} = await prompt({
        name: 'newHost',
        message: '请输入主机地址或别名，如[192.168.1.0/infa1v.bjtb.org.io]：',
        type: 'input',
        default: tmp.host,
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
      const {newName} = await prompt({
        name: 'newName',
        message: `为主机 [${newHost}] 取一个自定义名称：`,
        type: 'input',
        default: tmp.name,
      });
      const users = readFile('user');
      const {newUser} = await prompt({
        name: 'newUser',
        message: `分配一个登陆用的账号密码：`,
        type: 'list',
        default: tmp.user,
        choices: Object.keys(users),
      });
      result[`${host}`] = {
        host: newHost,
        name: newName,
        user: newUser
      };
      writeFile('host', _.extend(data, result));
    }
  },
};

module.exports = async function() {
  const {type} = await prompt({
    name: 'type',
    message: '你要配置用户还是主机信息？',
    type: 'list',
    choices: ['用户', '主机'],
  });
  config[`${types[type]}`]();
}