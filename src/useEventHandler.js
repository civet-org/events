import { useResourceContext } from '@civet/core';
import deepEquals from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { useConfigContext } from './context';

function useEventHandler({
  eventReceiver: eventReceiverProp,
  resource: resourceProp,
  disabled,
  options: optionsProp,
  onEvent,
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

  const isDisabled = !!disabled;

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
      if (unhandledEvents.length === 0 || typeof resource?.notify !== 'function') return;
      const promise = resource.notify();
      if (typeof onNotify === 'function') {
        promise.then((result) => onNotify(result, unhandledEvents));
      }
    });
    return unsubscribe;
  }, [eventReceiver, isDisabled, resource, options, onEvent, onNotify]);
}

export default useEventHandler;
