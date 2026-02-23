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
} from './EventReceiver';
import useEventHandler from './useEventHandler';

type EventProps<
  EventReceiverI extends GenericEventReceiver,
  EventI extends InferEvent<EventReceiverI> = InferEvent<EventReceiverI>,
  OptionsI extends InferOptions<EventReceiverI> = InferOptions<EventReceiverI>,
> = {
  events?:
    | {
        /** EventReceiver to be used */
        eventReceiver?: EventReceiverI;
        /** Disables the event handler */
        disabled?: boolean;
        /** Options for the EventReceiver */
        options?: OptionsI;
        /** Callback to filter events and handle your own event logic - if true is returned, the event does not cause the resource to update */
        onEvent?: (event: EventI) => boolean;
        /** Provides information on when the resource has been requested to update - events contains the events that lead to the update */
        onNotify?: (
          next: { request: string; revision: string },
          events: EventI[],
        ) => void;
      }
    | boolean;
};

const eventPlugin = createPlugin<
  GenericDataProviderImplementation,
  unknown,
  EventProps<GenericEventReceiver>
>(
  (baseDataProviderClass) =>
    class EventDataProvider extends baseDataProviderClass {
      extend(extend: DataProviderExtend): void {
        super.extend(extend);
        extend.context(
          (
            context: ResourceContextValue<GenericDataProvider>,
            { events = false }: EventProps<GenericEventReceiver>,
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
