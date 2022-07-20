import { prompt } from 'inquirer';
import { getSecureFile } from '@mochen/toolkit/secure.file';
import { getLogger } from '@mochen/toolkit/logger';
import { config } from '../config/index';
import { lang } from '../config/lang';
import { Config } from '.';

const logger = getLogger({ name: config.name });
const sFile = getSecureFile(config.name);

const Func: Record<string, Function> = {};

Func.user = async function user() {
  const cfg = sFile.getConfig<Config>();
  cfg.user = cfg.user || {};

  const { username } = await prompt({
    name: 'username',
    message: lang.TIPS.USERNAME,
    type: 'input',
    validate(v: string) {
      if (v.trim() === '') return lang.ERROR.NO_EMPTY;
      return true;
    }
  });

  const { password } = await prompt({
    name: 'password',
    message: lang.TIPS.PASSWORD,
    type: 'password',
    mask: '*',
    validate(v: string) {
      if (v === '') return lang.ERROR.NO_EMPTY;
      return true;
    }
  });

  const { alias } = await prompt({
    name: 'alias',
    message: lang.TIPS.ALIAS,
    type: 'input',
    validate(v: string) {
      if (v.trim() === '') return lang.ERROR.NO_EMPTY;
      if (cfg.user[v.trim()]) return lang.ERROR.EXIST;
      return true;
    }
  });

  cfg.user[alias] = {
    username,
    password,
  };

  sFile.setConfig(cfg);

  return logger.success(lang.ERROR.SUCCESS);
};

Func.host = async function host() {
  const cfg = sFile.getConfig<Config>();
  cfg.host = cfg.host || {};
  cfg.user = cfg.user || {};

  if (Object.keys(cfg.user).length === 0) {
    logger.error(lang.ERROR.NO_USER);
    return process.exit(0);
  }

  const { hostname } = await prompt({
    name: 'hostname',
    message: lang.TIPS.HOSTNAME,
    type: 'input',
    validate(v: string) {
      if (v.trim() === '') return lang.ERROR.NO_EMPTY;
      return true;
    }
  });

  const { port = 22 } = await prompt({
    name: 'port',
    message: lang.TIPS.PORT,
    default: 22,
    type: 'number',
  });

  const { alias } = await prompt({
    name: 'alias',
    message: lang.TIPS.ALIAS,
    type: 'input',
    validate(v: string) {
      if (v.trim() === '') return lang.ERROR.NO_EMPTY;
      if (cfg.host[v.trim()]) return lang.ERROR.EXIST;
      return true;
    }
  });

  const { user } = await prompt({
    name: 'user',
    message: lang.TIPS.LOGIN_USER,
    type: 'list',
    choices: Object.keys(cfg.user)
  });

  cfg.host[alias] = {
    hostname,
    port,
    user,
  };

  sFile.setConfig(cfg);

  return logger.success(lang.ERROR.SUCCESS);
};

export const add = async () => {
  const { type } = await prompt({
    name: 'type',
    message: lang.TIPS.SELECT,
    type: 'list',
    choices: [
      { name: lang.CONST.User, value: 'user' },
      { name: lang.CONST.Host, value: 'host' }
    ]
  });

  if (!['user', 'host'].includes(type)) {
    logger.error(lang.ERROR.SELECT_ERROR);
    return process.exit(0);
  }

  await Func[type]();
  return process.exit(0);
};