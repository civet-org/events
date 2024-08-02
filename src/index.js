import { ConfigContext, useConfigContext } from './context';

export const { Consumer: ConfigConsumer } = ConfigContext;
export { default as composeHandlers } from './composeHandlers';
export { default as ConfigProvider } from './ConfigProvider';
export { default as EventHandler } from './EventHandler';
export { default as EventReceiver, eventReceiverPropType, isEventReceiver } from './EventReceiver';
export { default as useEventHandler } from './useEventHandler';
export { useConfigContext };
