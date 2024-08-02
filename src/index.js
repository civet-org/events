import { ConfigContext, useConfigContext } from './context';

export const { Consumer: ConfigConsumer } = ConfigContext;
export { useConfigContext };

export { default as ConfigProvider } from './ConfigProvider';
export { default as EventHandler, composeHandlers } from './EventHandler';
export { default as EventReceiver, isEventReceiver, eventReceiverPropType } from './EventReceiver';
