const composeHandlers =
  (...handlers) =>
  (...args) =>
    handlers.reduce(
      (sum, handler) => sum || (typeof handler === 'function' ? handler(...args) : false),
      false,
    );

export default composeHandlers;
