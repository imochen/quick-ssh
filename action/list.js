const {execSync} = require('child_process');
const path = require('path');
const _ = require('lodash');
const prompt = require('inquirer').createPromptModule();

const {readFile} = require('../util/file');

module.exports = async function() {
  const hosts = readFile('host');
  const users = readFile('user');

  const {key} = await prompt({
    name: 'key',
    message: '请选择你要登录的主机',
    type: 'list',
    choices: Object.keys(hosts).map(k => {
      return {
        name: `${hosts[k].name}(${hosts[k].host})`,
        value: k,
      }
    }),
  });
  const host = hosts[key];
  const user = users[host.user];
  execSync(`${path.resolve(__dirname, '../shell/login.sh')} ${user.user} ${host.host} ${user.password}`, {
    stdio: 'inherit'
  });
}