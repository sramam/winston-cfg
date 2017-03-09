"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const pkg = require('../package');
const _version = process.version;
exports.version = ((desired = (pkg.engines.node || _version)) => {
    if (!semver.satisfies(exports.version, desired)) {
        const msg = `${pkg.name} requires node version ${desired}. Currently running an unsatisfactory ${exports.version}. Aborting.`;
        throw (new Error(msg));
    }
    return exports.version;
})();
