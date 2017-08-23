
import { expect } from 'chai';
import { merge } from 'lodash';
import * as stdMock from 'std-mocks';
import * as path from 'path';
import * as fs from 'fs';

// Because require'ing config creates and caches a global singleton,
// We have to invalidate the cache to build new object based on the environment variables above
function unrequire(module) {
  delete require.cache[require.resolve(module)];
}

describe('winston-cfg', function () {
  this.timeout(5000);
  it('file-transport', async () => {
    function logSorter(a: string, b: string): number {
      const parts = {
        a: a.split(' '),
        b: b.split(' ')
      };
      return parseInt(parts.a[2]) - parseInt(parts.b[2]);
    }
    // fetch and delete the log file (allows repeated runs of the test case)
    const config = require('../fixtures/file-transport/default');
    const outFname = config.winston.transports[0].filename;
    try { fs.unlinkSync(outFname); } catch (err) { }  /* noop */
    try { fs.unlinkSync(path.dirname(outFname)); } catch (err) { } /* noop */

    const app = require('../fixtures/file-transport/app');
    await app.main();

    // give winston a change to flush the log.
    // hack - could not get flush based waiting to work.
    const logger = app.log.loggers.get('app2');
    await (new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 400);
    }));

    let expected = require('../fixtures/file-transport/expected').default;
    expected = expected.map(
      el => {
        delete el.timestamp;
        return el;
      });
    const output = fs.readFileSync(outFname, 'utf8').toString().trim().split('\n');
    const actual = output.map(
      el => {
        el = JSON.parse(el);
        delete el['timestamp']; // fooling the typesystem
        return el;
      });
    // console.log(expected);
    // console.log(actual);
    expect(expected).to.deep.equal(actual);
  });
});
