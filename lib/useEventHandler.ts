import { useResourceContext } from '@civet/core';
import deepEquals from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import type {
  GenericEventReceiver,
  InferEvent,
  InferOptions,
  InferResource,
} from './EventReceiver';
import { useConfigContext } from './context';

/**
 * Enables automatic updating for a Resource component or useResource hook by subscribing to an EventReceiver.
 *
 * Necessary configuration that is not directly specified is taken from the ConfigContext and ResourceContext.
 *
 * onEvent can be used to directly access events allowing you to add custom event logic to your components.
 */
export default function useEventHandler<
  EventReceiverI extends GenericEventReceiver,
  ResourceI extends
    InferResource<EventReceiverI> = InferResource<EventReceiverI>,
  OptionsI extends InferOptions<EventReceiverI> = InferOptions<EventReceiverI>,
  EventI extends InferEvent<EventReceiverI> = InferEvent<EventReceiverI>,
>({
  eventReceiver: eventReceiverProp,
  resource: resourceProp,
  disabled,
  options: optionsProp,
  onEvent,
  onNotify,
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
}): void {
  const configContext = useConfigContext<EventReceiverI>();
  const eventReceiver = eventReceiverProp || configContext.eventReceiver;

  const resourceContext = useResourceContext() as ResourceI;
  const currentResource = resourceProp || resourceContext;

  const [resource, setResource] = useState<ResourceI>(currentResource);
  if (currentResource?.request !== resource?.request) {
    setResource(currentResource);
  }

  const [options, setOptions] = useState<OptionsI | undefined>(optionsProp);
  if (!deepEquals(options, optionsProp)) {
    setOptions(optionsProp);
  }

  const isDisabled = Boolean(disabled || currentResource?.isEmpty);

  useEffect(() => {
    if (eventReceiver == null || isDisabled) return undefined;
    const unsubscribe = eventReceiver.subscribe<ResourceI, OptionsI, EventI>(
      resource,
      options,
      (data) => {
        if ((data?.length || 0) === 0) return;
        let unhandledEvents;
        if (typeof onEvent === 'function') {
          unhandledEvents = data.filter((event) => !onEvent(event));
        } else {
          unhandledEvents = data;
        }
        if (
          unhandledEvents.length === 0 ||
          typeof resource?.notify !== 'function'
        ) {
          return;
        }
        const promise = resource.notify();
        if (typeof onNotify === 'function') {
          promise.then((result) => onNotify(result, unhandledEvents));
        }
      },
    );
    return unsubscribe;
  }, [eventReceiver, isDisabled, resource, options, onEvent, onNotify]);
}
