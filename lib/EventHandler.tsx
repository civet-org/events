import type { PropsWithChildren } from 'react';
import type {
  GenericEventReceiver,
  InferEvent,
  InferOptions,
  InferResource,
} from './EventReceiver';
import useEventHandler, { type EventProps } from './useEventHandler';

/**
 * Enables automatic updating for a Resource component or useResource hook by subscribing to an EventReceiver.
 *
 * Necessary configuration that is not directly specified is taken from the ConfigContext and ResourceContext.
 *
 * onEvent can be used to directly access events allowing you to add custom event logic to your components.
 */
export default function EventHandler<
  EventReceiverI extends GenericEventReceiver,
  EventI extends InferEvent<EventReceiverI> = InferEvent<EventReceiverI>,
  ResourceI extends InferResource<EventReceiverI> =
    InferResource<EventReceiverI>,
  OptionsI extends InferOptions<EventReceiverI> = InferOptions<EventReceiverI>,
>({
  eventReceiver,
  resource,
  disabled,
  options,
  onEvent,
  onNotify,
  children,
}: PropsWithChildren<EventProps<EventReceiverI, EventI, ResourceI, OptionsI>>) {
  useEventHandler({
    eventReceiver,
    resource,
    disabled,
    options,
    onEvent,
    onNotify,
  });

  return <>{children}</>;
}
