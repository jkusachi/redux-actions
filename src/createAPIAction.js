function identity(t) {
  return t;
}

export default function createAPIAction(type, method, endpoint, actionCreator, metaCreator) {

  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => {

    const action = {
      type,
      payload: finalActionCreator(...args)
    };

    if (action.payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    action.meta = Object.assign(action.meta || {}, {
      api: true,
      endpoint,
      method,
      types: [
        type.concat('_REQUEST'),
        type.concat('_SUCCESS'),
        type.concat('_FAILURE')
      ]
    });

    return action;
  };
}
