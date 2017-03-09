
import { expect } from 'chai';

describe('winston-cfg', () => {
  it('unknown-transport', async () => {
    try {
      const app = require('../fixtures/unknown-transport/app');
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.match(/Unknown transport 'ItsJustConsole' in map:'{}'/);
    }
  });
});
