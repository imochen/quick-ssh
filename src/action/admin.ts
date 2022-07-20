import { prompt } from 'inquirer';
import { getSecureFile } from '@mochen/toolkit/secure.file';
import { getLogger } from '@mochen/toolkit/logger';
import { config } from '../config/index';
import { lang } from '../config/lang';
import { Config, Host } from '.';

const logger = getLogger({ name: config.name });
const sFile = getSecureFile(config.name);

const Func: Record<string, Function> = {};

const usedHosts = (alias: string, host: Record<string, Host>) => {
  const used = [];
  const hostKeys = Object.keys(host);
  for (let i = 0; i < hostKeys.length; i++) {
    const k = hostKeys[i];
    if (host[k].user === alias) used.push(k);
  }
  return used;
};

Func.user = async function user() {
  const cfg = sFile.getConfig<Config>();
  cfg.user = cfg.user || {};
  cfg.host = cfg.host || {};

  if (Object.keys(cfg.user).length === 0) {
    logger.error(lang.ERROR.RECORD_EMPTY);
    return process.exit(0);
  }

  const { alias } = await prompt({
    name: 'alias',
    message: lang.TIPS.SELECT_RECORD,
    type: 'list',
    choices: Object.keys(cfg.user).map((key) => ({
      name: `${key}(${cfg.user[key].username})`,
      value: key,
    })),
  });

  const { operate } = await prompt({
    name: 'operate',
    message: lang.TIPS.SELECT_OPERATE,
    type: 'list',
    choices: [
      { name: lang.CONST.Update, value: 'update' },
      { name: lang.CONST.Delete, value: 'delete' }
    ]
  });

  const userInfo = cfg.user[alias];

  if (operate === 'update') {
    const { username = userInfo.username } = await prompt({
      name: 'username',
      message: lang.TIPS.USERNAME,
      default: userInfo.username,
      type: 'input',
      validate(v: string) {
        if (v.trim() === '') return lang.ERROR.NO_EMPTY;
        return true;
      }
    });
    const { password = userInfo.password } = await prompt({
      name: 'password',
      message: lang.TIPS.PASSWORD,
      default: userInfo.password,
      type: 'password',
      mask: '*',
      validate(v: string) {
        if (v === '') return lang.ERROR.NO_EMPTY;
        return true;
      }
    });
    cfg.user[alias] = {
      username,
      password,
    };
  }

  if (operate === 'delete') {
    const { bool } = await prompt({
      name: 'bool',
      message: lang.TIPS.DELETE_CONFIRM,
      type: 'confirm',
    });
    if (!bool) return process.exit(0);
    const usedHost = usedHosts(alias, cfg.host);
    if (usedHost.length !== 0) {
      logger.info(usedHost.join('\n'));
      logger.error(lang.ERROR.USER_INUSE);
      return process.exit(0);
    }
    delete cfg.user[alias];
  }

  sFile.setConfig(cfg);

  return logger.success(lang.ERROR.SUCCESS);
};

Func.host = async function host() {
  const cfg = sFile.getConfig<Config>();
  cfg.user = cfg.user || {};

  if (Object.keys(cfg.host).length === 0) {
    logger.error(lang.ERROR.RECORD_EMPTY);
    return process.exit(0);
  }

  const { alias } = await prompt({
    name: 'alias',
    message: lang.TIPS.SELECT_RECORD,
    type: 'list',
    choices: Object.keys(cfg.host).map((key) => ({
      name: `${key}(${cfg.host[key].hostname})`,
      value: key,
    })),
  });

  const { operate } = await prompt({
    name: 'operate',
    message: lang.TIPS.SELECT_OPERATE,
    type: 'list',
    choices: [
      { name: lang.CONST.Update, value: 'update' },
      { name: lang.CONST.Delete, value: 'delete' }
    ]
  });

  const hostInfo = cfg.host[alias];

  if (operate === 'update') {
    const { hostname = hostInfo.hostname } = await prompt({
      name: 'hostname',
      message: lang.TIPS.HOSTNAME,
      default: hostInfo.hostname,
      type: 'input',
      validate(v: string) {
        if (v.trim() === '') return lang.ERROR.NO_EMPTY;
        return true;
      }
    });
    const { port = hostInfo.port } = await prompt({
      name: 'port',
      message: lang.TIPS.PORT,
      default: hostInfo.port,
      type: 'number',
    });

    const { user = hostInfo.user } = await prompt({
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
  }

  if (operate === 'delete') {
    const { bool } = await prompt({
      name: 'bool',
      message: lang.TIPS.DELETE_CONFIRM,
      type: 'confirm',
    });
    if (!bool) return process.exit(0);
    delete cfg.host[alias];
  }

  sFile.setConfig(cfg);

  return logger.success(lang.ERROR.SUCCESS);
};

export const admin = async () => {
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