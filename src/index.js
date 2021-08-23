import { ConfigContext, useConfigContext } from './context';

export const { Consumer: ConfigConsumer } = ConfigContext;
export { default as ConfigProvider } from './ConfigProvider';
export { composeHandlers, default as EventHandler } from './EventHandler';
export { default as EventReceiver, eventReceiverPropType, isEventReceiver } from './EventReceiver';
export { useConfigContext };
