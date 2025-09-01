import {
  createContext,
  useContext,
  type ConsumerProps,
  type ExoticComponent,
  type ReactNode,
} from 'react';
import type { GenericEventReceiver } from './EventReceiver';

export type ConfigContextValue<EventReceiverI extends GenericEventReceiver> = {
  eventReceiver?: EventReceiverI;
};

export const ConfigContext = createContext<
  ConfigContextValue<GenericEventReceiver>
>({});
ConfigContext.displayName = 'Events.ConfigContext';
export const ConfigConsumer =
  ConfigContext.Consumer as ExoticComponent<GenericEventReceiver> & {
    <DataProviderI extends GenericEventReceiver>(
      props: ConsumerProps<ConfigContextValue<DataProviderI>>,
    ): ReactNode;
  };
export const useConfigContext = <
  DataProviderI extends GenericEventReceiver,
>() => useContext(ConfigContext) as ConfigContextValue<DataProviderI>;
