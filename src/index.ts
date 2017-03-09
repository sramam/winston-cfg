
import { merge } from 'lodash';
import * as winston from 'winston';

const config = require('config');

type Fn = (level: string, msg: string, meta: any) => void;
interface Config {
  /**
   *
   * @type {string}
   * @default info
   */
  level?: string;
  /**
   * (default is null)
   * @type {string}
   * @default
   */
  id?: string;
  /**
   *
   * @type {boolean}
   * @default false
   */
  emitErrs?: boolean;
  /**
   *
   * @type {boolean}
   * @default false
   */
  stripColors?: boolean;
  /**
   *
   * @type {boolean}
   * @default true
   */
  exitOnError?: boolean;
  /**
   *
   * @type {boolean}
   * @default false
   */
  padLevels?: boolean;
  /**
   * (default null)
   * @type {any[]}
   * default
   */
  transports?: any[];

  levels?: string[];
  colors?: string[];
  rewriters?: Fn[];
  filters?: Fn[];
};

export function winstonCfg(transportMap = {}) {
  const cfg = merge({
    transports: [{
      type: 'Console'
    }],
    level: 'info'
  }, (config.has('winston') ? config.get('winston') : {}));

  const { transports, loggers, ...rest } = cfg;
  const _transports = makeTransportsArray(transports, transportMap);
  // configure default logger
  winston.configure(<Config>{
    ...rest,
    transports: _transports
  });

  // configure default transports for all loggers.
  winston.loggers.options.transports = _transports;
  addLoggers(loggers, transportMap);

  return winston;
}


function makeTransportsArray(transports = [], transportMap) {
  return transports.map(t => {
    switch (t.type) {
      case 'Console':
      case 'File':
      case 'Http':
      case 'Memory':
        return new winston.transports[t.type](t);
      default: {
        if (t.type in transportMap) {
          return new transportMap[t.type](t);
        } else {
          throw new Error(`Unknown transport '${t.type}' in map:'${JSON.stringify(transportMap)}'`);
        }
      }
    }
  });
}

function addLoggers(cfg = [], transportMap) {
  cfg.map(_cfg => {
    _cfg.transports = _cfg.transports
      ? makeTransportsArray(_cfg.transports, transportMap)
      : winston.loggers.options.transports;
    // loggers.add() with config treats the config differently than
    // winston.configure. So we don't pass _cfg to tha add() call,
    // but make a logger.configure() call to achieve the purpose.
    // This allows both the default/global level config to be
    // identical in structure to the custom-per-logger config.
    // Incredible, how long it took to find it the first time.
    // Hopefully it saves you some time!
    return winston.loggers.add(_cfg.id).configure(_cfg);
  });
}
