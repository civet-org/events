import type { ReactNode } from 'react';
import type {
  GenericEventReceiver,
  InferEvent,
  InferOptions,
  InferResource,
} from './EventReceiver';
import useEventHandler from './useEventHandler';

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
}: {
  /** EventReceiver to be used */
  eventReceiver?: EventReceiverI;
  /** ResourceContext to be used */
  resource?: ResourceI;
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
  children?: ReactNode;
}) {
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
