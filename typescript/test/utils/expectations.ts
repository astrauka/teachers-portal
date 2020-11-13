import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';

chai.use(chaiAsPromised);
chai.use(sinonChai);

export { chai };

export const expect = chai.expect;

// tslint:disable-next-line:ban-types
export function getErrorOf(fn: Function): Error {
  try {
    fn();
  } catch (e) {
    return e;
  }
}
