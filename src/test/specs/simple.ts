
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
\u001b[32minfo\u001b[39m: [def] 1 main starting
\u001b[34mdebug\u001b[39m: [app] 2 main starting
\u001b[32minfo\u001b[39m: [def] 3 app2: main starting
\u001b[34mdebug\u001b[39m: [app] 5 promise initialized
\u001b[32minfo\u001b[39m: [def] 7 timer started
\u001b[32minfo\u001b[39m: [app] 8 timer started
\u001b[31merror\u001b[39m: [def] 9 app2: timer started
\u001b[32minfo\u001b[39m: [def] 10 timer expired
\u001b[34mdebug\u001b[39m: [app] 11 timer expired
\u001b[32minfo\u001b[39m: [def] 12 app2: timer expired
\u001b[32minfo\u001b[39m: [def] 13 program exiting
\u001b[32minfo\u001b[39m: [app] 14 program exiting
\u001b[32minfo\u001b[39m: [def] 15 app2: program exiting`;

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
      .map(r => r.trim()) // removes `\r` on windows
      .sort(logSorter);
    const expected = fixture.trim().split('\n').sort(logSorter);
    expect(expected).to.deep.equal(actual);
  });
});
