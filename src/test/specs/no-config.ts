
import { expect } from 'chai';
import { merge } from 'lodash';
import * as stdMock from 'std-mocks';
import * as path from 'path';

// Because require'ing config creates and caches a global singleton,
// We have to invalidate the cache to build new object based on the environment variables above
function unrequire(module) {
  delete require.cache[require.resolve(module)];
}

const fixture = `
info: 1 main starting
info: 3 timer started
info: 4 timer expired
info: 5 program exiting`;

describe('winston-cfg', () => {
  it('no-config', async () => {
    function logSorter(a: string, b: string): number {
      const parts = {
        a: a.split(' '),
        b: b.split(' ')
      };
      return parseInt(parts.a[2]) - parseInt(parts.b[2]);
    }
    const app = require('../fixtures/no-config/app');
    stdMock.use();
    await app.main();
    stdMock.restore();
    const { stdout, stderr } = stdMock.flush();
    const actual = (stdout.concat(stderr))
      .join('')
      .trim()
      .split('\n')
      .sort(logSorter);
    const expected = fixture.trim().split('\n').sort(logSorter);
    expect(expected).to.deep.equal(actual);
  });
});
