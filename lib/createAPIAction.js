'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAPIAction;
function identity(t) {
  return t;
}

function createAPIAction(type, method, endpoint, actionCreator, metaCreator) {

  var finalActionCreator = typeof actionCreator === 'function' ? actionCreator : identity;

  return function (itemID) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var action = {
      type: type,
      payload: finalActionCreator.apply(undefined, args)
    };

    if (action.payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator.apply(undefined, args);
    }

    action.meta = Object.assign(action.meta || {}, {
      api: true,
      endpoint: endpoint,
      method: method,
      types: [type.concat('_' + method.toUpperCase() + '_REQUEST'), type.concat('_' + method.toUpperCase() + '_SUCCESS'), type.concat('_' + method.toUpperCase() + '_FAILURE')]
    });

    return action;
  };
}