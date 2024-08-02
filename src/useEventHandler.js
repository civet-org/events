import { useResourceContext } from '@civet/core';
import deepEquals from 'fast-deep-equal';
import React from 'react';

import { useConfigContext } from './context';

function useEventHandler({
  eventReceiver: eventReceiverProp,
  resource: resourceProp,
  options: optionsProp,
  onEvent,
  onNotify,
}) {
  const configContext = useConfigContext();
  const eventReceiver = eventReceiverProp || configContext.eventReceiver;

  const resourceContext = useResourceContext();
  const resource = resourceProp || resourceContext;

  const [options, setOptions] = React.useState(optionsProp);
  if (!deepEquals(options, optionsProp)) {
    setOptions(optionsProp);
  }

  React.useEffect(() => {
    if (eventReceiver == null) return undefined;
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
  }, [eventReceiver, resource?.request, options, onEvent, onNotify]);
}

export default useEventHandler;
