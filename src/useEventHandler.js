import { useResourceContext } from '@civet/core';
import deepEquals from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { useConfigContext } from './context';

/**
 * Enables automatic updating for a Resource component or useResource hook by subscribing to an EventReceiver.
 *
 * Necessary configuration that is not directly specified is taken from the ConfigContext and ResourceContext.
 *
 * onEvent can be used to directly access events allowing you to add custom event logic to your components.
 */
function useEventHandler({
  /** EventReceiver to be used */
  eventReceiver: eventReceiverProp,
  /** ResourceContext to be used */
  resource: resourceProp,
  /** Disables the event handler */
  disabled,
  /** Options for the EventReceiver */
  options: optionsProp,
  /** Callback to filter events and handle your own event logic - if true is returned, the event does not cause the resource to update */
  onEvent,
  /** Provides information on when the resource has been requested to update - events contains the events that lead to the update */
  onNotify,
}) {
  const configContext = useConfigContext();
  const eventReceiver = eventReceiverProp || configContext.eventReceiver;

  const resourceContext = useResourceContext();
  const currentResource = resourceProp || resourceContext;

  const [resource, setResource] = useState(currentResource);
  if (currentResource?.request !== resource?.request) {
    setResource(currentResource);
  }

  const [options, setOptions] = useState(optionsProp);
  if (!deepEquals(options, optionsProp)) {
    setOptions(optionsProp);
  }

  const isDisabled = Boolean(disabled || currentResource?.isEmpty);

  useEffect(() => {
    if (eventReceiver == null || isDisabled) return undefined;
    const unsubscribe = eventReceiver.subscribe(resource, options, (data) => {
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
    });
    return unsubscribe;
  }, [eventReceiver, isDisabled, resource, options, onEvent, onNotify]);
}

export default useEventHandler;
