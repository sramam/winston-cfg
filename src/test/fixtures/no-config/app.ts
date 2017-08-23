
process.env.NODE_CONFIG_DIR = __dirname;
// only needed for testing
require('../utils').unrequire();
// import * as log from 'winston';
import { winstonCfg } from '../../..';

import * as _winston from 'winston';

import * as fs from 'fs';
const transportMap = {
  ItsJustConsole: _winston.transports.Console
};

const winston = winstonCfg(transportMap);

// in case the test case wants to access the log
export const log = winston;

export async function main() {
  let idx = 1;
  log.info(`${idx++} main starting`);
  await new Promise((resolve, reject) => {
    log.debug(`${idx++} promise initialized`);
    setTimeout(() => {
      log.info(`${idx++} timer expired`);
      resolve();
    }, 100);
    log.info(`${idx++} timer started`);
  });
  log.info(`${idx++} program exiting`);
}
