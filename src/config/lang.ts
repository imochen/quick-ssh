import osLocale from 'os-locale';
import { zh_CN } from './zh_CN';
import { en_US } from './en_US';

const maps: Record<string, typeof zh_CN> = {
  zh_CN,
  en_US,
};

const locale = osLocale.sync().replace(/-/g, '_');

export const lang = maps[locale] ? maps[locale] : maps.en_US;