import PropTypes from 'prop-types';

class EventReceiver {
  subscribe(resource, options, handler) {
    if (typeof handler !== 'function') throw new Error('Handler must be a function');
    const unsubscribe = this.handleSubscribe(resource, options, handler);
    if (typeof unsubscribe !== 'function') {
      console.warn(
        'EventReceiver.handleSubscribe should return a callback to cancel the subscription. Ignoring this warning may result in the execution of obsolete handlers and potential memory leaks.',
      );
    }
    return unsubscribe;
  }
}

const isEventReceiver = (eventReceiver) => eventReceiver instanceof EventReceiver;

const eventReceiverPropType = PropTypes.instanceOf(EventReceiver);

export default EventReceiver;
export { isEventReceiver, eventReceiverPropType };
