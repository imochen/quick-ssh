import path from 'path';
import { getSecureFile } from '@mochen/toolkit/secure.file';
import { prompt } from 'inquirer';
import { execSync } from 'child_process';
import { getLogger } from '@mochen/toolkit/logger';
import { config } from '../config/index';
import { Config } from '.';
import { lang } from '../config/lang';

const logger = getLogger({ name: config.name });
const sFile = getSecureFile(config.name);

export const main = async () => {
  const { host = {}, user } = sFile.getConfig<Config>();
  if (Object.keys(host).length === 0) {
    logger.warn(lang.ERROR.NO_HOST);
    return process.exit(0);
  }

  const { alias } = await prompt({
    name: 'alias',
    message: '选择登录的主机',
    type: 'list',
    choices: Object.keys(host).map((key) => ({
      name: `${key}(${host[key].hostname})`,
      value: key,
    }))
  });

  const hostInfo = host[alias];
  const userInfo = user[hostInfo.user];

  if (!userInfo) {
    logger.error(lang.ERROR.USER_NOT_EXIST);
    process.exit(0);
  }

  logger.info(`ssh ${userInfo.username}@${hostInfo.hostname} -p ${hostInfo.port}`);

  try {
    execSync(`${path.resolve(__dirname, '../../shell/login.sh')} '${userInfo.username}' '${hostInfo.hostname}' '${userInfo.password}' ${hostInfo.port}`, {
      stdio: 'inherit'
    });
  } catch (e) {
    logger.error(e.message);
  }

  return process.exit(0);
};