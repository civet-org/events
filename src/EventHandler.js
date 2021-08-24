import { ResourceConsumer } from '@civet/core';
import deepEquals from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ConfigContext } from './context';
import { eventReceiverPropType } from './EventReceiver';

class EventHandler extends Component {
  componentDidMount() {
    const { eventReceiver, resource, options } = this.props;
    if (eventReceiver == null) return;
    this.unsubscribe = eventReceiver.subscribe(resource, options, (data) =>
      this.handleNotify(data),
    );
  }

  componentDidUpdate(prevProps) {
    const { eventReceiver, resource, options } = this.props;

    const prevRequest = (prevProps.resource || {}).request;
    const currentRequest = (resource || {}).request;

    if (
      eventReceiver == null ||
      prevProps.eventReceiver !== eventReceiver ||
      prevRequest !== currentRequest ||
      !deepEquals(prevProps.options, options)
    ) {
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = undefined;
      if (eventReceiver == null) return;
      this.unsubscribe = eventReceiver.subscribe(resource, options, (data) =>
        this.handleNotify(data),
      );
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    if (this.unsubscribe) this.unsubscribe();
  }

  handleNotify(data) {
    const { eventReceiver, resource, onEvent, onNotify } = this.props;
    if (eventReceiver == null || data == null || (data.length || 0) === 0) return;
    let unhandledEvents;
    if (typeof onEvent === 'function') {
      unhandledEvents = data.filter((event) => !onEvent(event));
    } else {
      unhandledEvents = data;
    }
    if (unhandledEvents.length === 0 || resource == null || typeof resource.notify !== 'function') {
      return;
    }
    const promise = resource.notify();
    if (typeof onNotify === 'function') promise.then((result) => onNotify(result, unhandledEvents));
  }

  render() {
    return <>{this.props.children}</>;
  }
}

EventHandler.propTypes = {
  eventReceiver: eventReceiverPropType.isRequired,
  resource: PropTypes.object,
  options: PropTypes.object,
  onEvent: PropTypes.func,
  onNotify: PropTypes.func,
  children: PropTypes.node,
};

const composeHandlers =
  (...handlers) =>
  (...args) =>
    handlers.reduce(
      (sum, handler) => sum || (typeof handler === 'function' ? handler(...args) : false),
      false,
    );

/* eslint-disable react/jsx-props-no-spreading */
const withResource = (ChildComponent) => {
  const WithResource = (props) => (
    <ResourceConsumer>
      {(resource) => <ChildComponent resource={resource} {...props} />}
    </ResourceConsumer>
  );
  return WithResource;
};
/* eslint-enable react/jsx-props-no-spreading */

/* eslint-disable react/jsx-props-no-spreading */
const withContext = (ChildComponent) => {
  const WithContext = (props) => (
    <ConfigContext.Consumer>
      {({ eventReceiver }) => <ChildComponent eventReceiver={eventReceiver} {...props} />}
    </ConfigContext.Consumer>
  );
  return WithContext;
};
/* eslint-enable react/jsx-props-no-spreading */

export default withContext(withResource(EventHandler));
export { composeHandlers };
