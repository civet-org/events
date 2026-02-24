import {
  createPlugin,
  type DataProviderExtend,
  type GenericDataProvider,
  type GenericDataProviderImplementation,
  type ResourceContextValue,
} from '@civet/core';
import type {
  GenericEventReceiver,
  InferEvent,
  InferOptions,
  InferResource,
} from './EventReceiver';
import useEventHandler, { type EventProps } from './useEventHandler';

type EventPluginContextProps = {
  events?:
    | Omit<
        EventProps<
          GenericEventReceiver,
          InferEvent<GenericEventReceiver>,
          InferResource<GenericEventReceiver>,
          InferOptions<GenericEventReceiver>
        >,
        'resource'
      >
    | boolean;
};

const eventPlugin = createPlugin<
  GenericDataProviderImplementation,
  unknown,
  EventPluginContextProps
>(
  (baseDataProviderClass) =>
    class EventDataProvider extends baseDataProviderClass {
      extend(extend: DataProviderExtend): void {
        super.extend(extend);
        extend.context(
          (
            context: ResourceContextValue<GenericDataProvider>,
            { events = false }: EventPluginContextProps,
          ) => {
            useEventHandler(
              typeof events === 'boolean'
                ? { disabled: !events, resource: context }
                : { ...events, resource: context },
            );

            return context;
          },
        );
      }
    },
);

export default eventPlugin;
