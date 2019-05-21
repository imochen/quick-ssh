const os = require('os');
const fs = require('fs-extra');
const path = require('path');

const {userConfFile, hostConfFile} = require('../config/index');

const homedir = os.homedir();

const readFile = function(type) {
  const filePath = path.join(homedir, type === 'host' ? hostConfFile : userConfFile);
  if (!fs.pathExistsSync(filePath)) {
    fs.mkdirpSync(path.dirname(filePath));
    fs.writeJsonSync(filePath, {});
    return {};
  }
  return fs.readJsonSync(filePath);
}

const writeFile = function(type, data) {
  const json = readFile(type);
  const filePath = path.join(homedir, type === 'host' ? hostConfFile : userConfFile);
  fs.writeJsonSync(filePath, data);
}

module.exports = {
  readFile,
  writeFile
}

