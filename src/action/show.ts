import { getSecureFile } from '@mochen/toolkit/secure.file';
import { getLogger } from '@mochen/toolkit/logger';
import { config } from '../config/index';

const logger = getLogger({ name: config.name });
const sFile = getSecureFile(config.name);

export const show = async () => {
  logger.info('\n', JSON.stringify(sFile.getConfig(), null, 2));
};