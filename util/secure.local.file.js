// secure local file rw
const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');

const r = 'MC'.length;

const rds = () => new Array(r << r / r)
  .fill()
  .map(() => Math.random().toString((r << r) * r).slice(r))
  .join('')
  .slice(r, (r << r) * r + r);

const encrypt = (salt, iv, data) => {
  const cipher = crypto.createCipheriv('aes-128-cbc', salt, iv);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

const decrypt = (salt, iv, crypted) => {
  const cipher = crypto.createDecipheriv('aes-128-cbc', salt, iv);
  return cipher.update(crypted, 'hex', 'utf8') + cipher.final('utf8');
}

const createFile = (filePath) => {
  if (!fs.pathExistsSync(filePath)) {
    fs.mkdirpSync(path.dirname(filePath));
    fs.writeFileSync(filePath, '', { encoding: 'utf-8' });
    return true;
  }
  return false;
}

const readFile = (filePath) => {
  if (createFile(filePath)) {
    return writeFile(filePath, {});
  }
  const source = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(decrypt(
    source.slice(r >> r, (r << r) * r),
    source.slice(- (r << r) * r),
    source.slice((r << r) * r, -(r << r) * r)
  ));
}

const writeFile = (filePath, content) => {
  createFile(filePath);
  const salt = rds();
  const iv = rds();
  fs.writeFileSync(
    filePath,
    salt + encrypt(salt, iv, JSON.stringify(content)) + iv,
    { encoding: 'utf-8' }
  );
  return content;
}

module.exports = {
  readFile,
  writeFile,
}