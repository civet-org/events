import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResourceConsumer } from '@civet/core';
import deepEquals from 'fast-deep-equal';

import { ConfigContext } from './context';
import { eventReceiverPropType } from './EventReceiver';

class EventHandler extends Component {
  componentDidMount() {
    const { eventReceiver, resource, options } = this.props;
    if (eventReceiver == null) return;
    this.unsubscribe = eventReceiver.subscribe(resource, options, data => this.handleNotify(data));
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
      this.unsubscribe = eventReceiver.subscribe(resource, options, data =>
        this.handleNotify(data),
      );
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    if (this.unsubscribe) this.unsubscribe();
  }

  handleNotify(data) {
    const { eventReceiver, resource, onEvent } = this.props;
    if (eventReceiver == null || data == null || (data.length || 0) === 0) return;
    if (typeof onEvent === 'function') {
      const allEventsHandled = data.reduce(
        (othersHandled, event) => onEvent(event) && othersHandled,
        true,
      );
      if (allEventsHandled) return;
    }
    if (resource == null || typeof resource.notify !== 'function') return;
    resource.notify();
  }

  render() {
    const { children } = this.props;
    if (children == null) return null;
    return children;
  }
}

EventHandler.propTypes = {
  eventReceiver: eventReceiverPropType.isRequired,
  resource: PropTypes.object,
  options: PropTypes.object,
  onEvent: PropTypes.func,
  children: PropTypes.node,
};

const composeHandlers = (...handlers) => (...args) =>
  handlers.reduce(
    (sum, handler) => sum || (typeof handler === 'function' ? handler(...args) : false),
    false,
  );

const withResource = ChildComponent => {
  const WithResource = props => (
    <ResourceConsumer>
      {resource => <ChildComponent resource={resource} {...props} />}
    </ResourceConsumer>
  );
  return WithResource;
};

const withContext = ChildComponent => {
  const WithContext = props => (
    <ConfigContext.Consumer>
      {({ eventReceiver }) => <ChildComponent eventReceiver={eventReceiver} {...props} />}
    </ConfigContext.Consumer>
  );
  return WithContext;
};

export default withContext(withResource(EventHandler));
export { composeHandlers };
