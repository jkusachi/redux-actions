'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleAction;
function isFunction(val) {
  return typeof val === 'function';
}

function handleAction(type, reducers) {
  return function (state, action) {
    // If action type does not match, return previous state
    if (action.type !== type) return state;

    var handlerKey = action.error === true ? 'throw' : 'next';

    // If function is passed instead of map, use as reducer
    if (isFunction(reducers)) {
      reducers.next = reducers.throw = reducers;
    }

    // Otherwise, assume an action map was passed
    var reducer = reducers[handlerKey];

    return isFunction(reducer) ? reducer(state, action) : state;
  };
}