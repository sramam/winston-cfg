
process.env.NODE_CONFIG_DIR = __dirname;

// only needed for testing
require('../utils').unrequire();

import { winstonCfg } from '../../..';
import * as fs from 'fs';
const winston = winstonCfg();

const log = winston;
const app = winston.loggers.get('app');
const app2 = winston.loggers.get('app2');

export async function main() {
  let idx = 1;
  log.info(`${idx++} main starting`);
  app.debug(`${idx++} main starting`);
  app2.info(`${idx++} app2: main starting`);
  await new Promise((resolve, reject) => {
    log.debug(`${idx++} promise initialized`);
    app.debug(`${idx++} promise initialized`);
    app2.debug(`${idx++} app2: promise initialized`);
    setTimeout(() => {
      log.info(`${idx++} timer expired`);
      app.debug(`${idx++} timer expired`);
      app2.info(`${idx++} app2: timer expired`);
      resolve();
    }, 100);
    log.info(`${idx++} timer started`);
    app.info(`${idx++} timer started`);
    app2.error(`${idx++} app2: timer started`);
  });
  log.info(`${idx++} program exiting`);
  app.info(`${idx++} program exiting`);
  app2.info(`${idx++} app2: program exiting`);
};
