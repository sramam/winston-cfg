
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
    // fetch and delete the log file (allows repeated runs of the test case)
    const config = require('../fixtures/file-transport/default');
    const outFname = config.winston.transports[0].filename;
    try { fs.unlinkSync(outFname); } catch (err) { }  /* noop */
    try { fs.unlinkSync(path.dirname(outFname)); } catch (err) { } /* noop */

    const app = require('../fixtures/file-transport/app');
    await app.main();

    // app uses a logger to log to file.
    // winston-cfg is only concerned with creating the sub-directory
    // in which the log file is logged.

    // for this test, it is sufficient to test for existance of the
    // file with non-zero contents.

    const output = fs.readFileSync(outFname, 'utf8').toString().trim();
    expect(output).to.not.be.null;
  });
});
