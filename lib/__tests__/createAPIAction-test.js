'use strict';

var _ = require('../');

var _fluxStandardAction = require('flux-standard-action');

describe.only('createAPIAction()', function () {
  describe('resulting action creator', function () {
    var type = 'TYPE';

    it('returns a valid FSA', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample', function (b) {
        return b;
      });
      var action = actionCreator();
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('uses return value as payload', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample', function (b) {
        return b;
      }, function (b) {
        return b;
      });
      var foobar = { foo: 'bar' };
      var action = actionCreator(9, foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          foo: 'bar',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
    });

    it('uses identity function if actionCreator is not a function', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample');
      var foobar = { foo: 'bar' };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('accepts a second parameter for adding meta to object', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample', null, function (_ref) {
        var cid = _ref.cid;
        return { cid: cid };
      });
      var foobar = { foo: 'bar', cid: 5 };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          cid: 5,
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('sets error to true if payload is an Error object', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample');
      var errObj = new TypeError('this is an error');

      var errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type: type,
        payload: errObj,
        error: true,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(errAction)).to.be.true;

      var foobar = { foo: 'bar', cid: 5 };
      var noErrAction = actionCreator(foobar);
      expect(noErrAction).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(noErrAction)).to.be.true;
    });
  });
});