import { createAPIAction } from '../';
import { isFSA } from 'flux-standard-action';

describe.only('createAPIAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';

    it('returns a valid FSA', () => {
      const actionCreator = createAPIAction(type, 'GET', '/sample', b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(isFSA(action)).to.be.true;
    });

    it('uses return value as payload', () => {
      const actionCreator = createAPIAction(type, 'GET', '/sample', b => b, b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          foo: 'bar',
          endpoint: '/sample',
          types: [
            type.concat('_GET_REQUEST'),
            type.concat('_GET_SUCCESS'),
            type.concat('_GET_FAILURE')
          ]
        }
      });
    });

    it('uses identity function if actionCreator is not a function', () => {
      const actionCreator = createAPIAction(type, 'GET', '/sample');
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [
            type.concat('_GET_REQUEST'),
            type.concat('_GET_SUCCESS'),
            type.concat('_GET_FAILURE')
          ]
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('accepts a second parameter for adding meta to object', () => {
      const actionCreator = createAPIAction(type, 'GET', '/sample', null, ({ cid }) => ({ cid }));
      const foobar = { foo: 'bar', cid: 5 };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          cid: 5,
          types: [
            type.concat('_GET_REQUEST'),
            type.concat('_GET_SUCCESS'),
            type.concat('_GET_FAILURE')
          ]
        }
      });
      expect(isFSA(action)).to.be.true;
    });


    it('sets error to true if payload is an Error object', () => {
      const actionCreator = createAPIAction(type, 'GET', '/sample');
      const errObj = new TypeError('this is an error');

      const errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type,
        payload: errObj,
        error: true,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [
            type.concat('_GET_REQUEST'),
            type.concat('_GET_SUCCESS'),
            type.concat('_GET_FAILURE')
          ]
        }
      });
      expect(isFSA(errAction)).to.be.true;

      const foobar = { foo: 'bar', cid: 5 };
      const noErrAction = actionCreator(foobar);
      expect(noErrAction).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [
            type.concat('_GET_REQUEST'),
            type.concat('_GET_SUCCESS'),
            type.concat('_GET_FAILURE')
          ]
        }
      });
      expect(isFSA(noErrAction)).to.be.true;
    });


  });
});
