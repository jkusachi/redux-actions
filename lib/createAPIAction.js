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

  return function () {

    var action = {
      type: type,
      payload: finalActionCreator.apply(undefined, arguments)
    };

    if (action.payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator.apply(undefined, arguments);
    }

    action.meta = Object.assign(action.meta || {}, {
      api: true,
      endpoint: endpoint,
      method: method,
      types: [type.concat('_REQUEST'), type.concat('_SUCCESS'), type.concat('_FAILURE')]
    });

    return action;
  };
}