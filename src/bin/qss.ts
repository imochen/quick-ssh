#! /usr/bin/env node

import yargs from 'yargs';

import { lang } from '../config/lang';

import { add } from '../action/add';
import { show } from '../action/show';
import { admin } from '../action/admin';
import { main } from '../action/main';

const noop = () => { };

// eslint-disable-next-line no-unused-expressions
yargs.command('$0', '', noop, main)
  .command('add', lang.ACTION.ADD, noop, add)
  .command('admin', lang.ACTION.ADMIN, noop, admin)
  .command('show', lang.ACTION.SHOW, noop, show)
  .version()
  .help('help').argv;
