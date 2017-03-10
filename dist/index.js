"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const winston = require("winston");
const config = require('config');
;
function winstonCfg(transportMap = {}, defaultCfg) {
    const cfg = lodash_1.merge({
        transports: [{
                type: 'Console'
            }],
        level: 'info'
    }, defaultCfg, (config.has('winston') ? config.get('winston') : {}));
    const { transports, loggers } = cfg, rest = __rest(cfg, ["transports", "loggers"]);
    const _transports = makeTransportsArray(transports, transportMap);
    winston.configure(Object.assign({}, rest, { transports: _transports }));
    winston.loggers.options.transports = _transports;
    addLoggers(loggers, transportMap);
    return winston;
}
exports.winstonCfg = winstonCfg;
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
                }
                else {
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
        return winston.loggers.add(_cfg.id).configure(_cfg);
    });
}
