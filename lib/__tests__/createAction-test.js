'use strict';

var _ = require('../');

var _fluxStandardAction = require('flux-standard-action');

describe('createAction()', function () {
  describe('resulting action creator', function () {
    var type = 'TYPE';

    it('returns a valid FSA', function () {
      var actionCreator = (0, _.createAction)(type, function (b) {
        return b;
      });
      var foobar = { foo: 'bar' };
      var action = actionCreator(foobar);
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('uses return value as payload', function () {
      var actionCreator = (0, _.createAction)(type, function (b) {
        return b;
      });
      var foobar = { foo: 'bar' };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar
      });
    });

    it('uses identity function if actionCreator is not a function', function () {
      var actionCreator = (0, _.createAction)(type);
      var foobar = { foo: 'bar' };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar
      });
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('accepts a second parameter for adding meta to object', function () {
      var actionCreator = (0, _.createAction)(type, null, function (_ref) {
        var cid = _ref.cid;
        return { cid: cid };
      });
      var foobar = { foo: 'bar', cid: 5 };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          cid: 5
        }
      });
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('sets error to true if payload is an Error object', function () {
      var actionCreator = (0, _.createAction)(type);
      var errObj = new TypeError('this is an error');

      var errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type: type,
        payload: errObj,
        error: true
      });
      expect((0, _fluxStandardAction.isFSA)(errAction)).to.be.true;

      var foobar = { foo: 'bar', cid: 5 };
      var noErrAction = actionCreator(foobar);
      expect(noErrAction).to.deep.equal({
        type: type,
        payload: foobar
      });
      expect((0, _fluxStandardAction.isFSA)(noErrAction)).to.be.true;
    });
  });
});