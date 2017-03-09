
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
debug: [app] 11 timer expired
debug: [app] 2 main starting
debug: [app] 5 promise initialized
error: [def] 9 app2: timer started
info: [app] 14 program exiting
info: [app] 8 timer started
info: [def] 1 main starting
info: [def] 10 timer expired
info: [def] 12 app2: timer expired
info: [def] 13 program exiting
info: [def] 15 app2: program exiting
info: [def] 3 app2: main starting
info: [def] 7 timer started`;

describe('winston-cfg', () => {
  it('core-transport', async () => {
    function logSorter(a: string, b: string): number {
      const parts = {
        a: a.split(' '),
        b: b.split(' ')
      };
      return parseInt(parts.a[2]) - parseInt(parts.b[2]);
    }
    const app = require('../fixtures/simple/app');
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
