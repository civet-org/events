// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function composeHandlers<Args extends any[]>(
  ...handlers: ((...args: Args) => boolean)[]
): (...args: Args) => boolean {
  return (...args) =>
    handlers.reduce(
      (sum, handler) =>
        sum || (typeof handler === 'function' ? handler(...args) : false),
      false,
    );
}
