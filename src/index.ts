
import { merge } from 'lodash';
import * as winston from 'winston';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

const config = require('config');

export type Fn = (level: string, msg: string, meta: any) => void;
export interface Config {
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
}

function initWinstonCfg(transportMap = {}, defaultCfg?: Config) {
  const cfg = merge(
    {
      transports: [{
        type: 'Console'
      }],
      level: 'info'
    },
    defaultCfg,
    (config.has('winston') ? config.get('winston') : {})
  );

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

let _logger = null;
/**
 * Initializes a winston logger using application configuration.
 * Details in [README](../README.md). Provides a singleton instance.
 *
 * @param {any} [transportMap={}]
 * @param {Config} [defaultCfg]
 * @returns
 */
export function winstonCfg(transportMap = {}, defaultCfg?: Config) {
  _logger = _logger || initWinstonCfg(transportMap, defaultCfg);
  return _logger;
}

function makeTransportsArray(transports = [], transportMap) {
  return transports.map(t => {
    let colorize = t.colorize || false;
    switch (t.type) {
      case 'Console': {
        colorize = true;
        break;
      }
      case 'File': {
        // ensure that log directory exists. winston refuses
        // to auto-create https://github.com/winstonjs/winston/issues/579
        mkdirp(path.dirname(t.filename));
        break;
      }
      // case 'Http':
      // case 'Memory':
      // default:
    }
    const Transport = winston.transports[t.type] || transportMap[t.type] || null;
    if (Transport) {
      const transport = new Transport(t);
      transport.colorize = colorize;
      return transport;
    } else {
      throw new Error(`Unknown transport '${t.type}' in map:'${JSON.stringify(transportMap)}'`);
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
