import PropTypes from 'prop-types';
import { eventReceiverPropType } from './EventReceiver';
import useEventHandler from './useEventHandler';

const propTypes = {
  /** EventReceiver to be used */
  eventReceiver: eventReceiverPropType,
  /** ResourceContext to be used */
  resource: PropTypes.object,
  /** Disables the event handler */
  disabled: PropTypes.bool,
  /** Options for the EventReceiver */
  options: PropTypes.object,
  /** Callback to filter events and handle your own event logic - if true is returned, the event does not cause the resource to update */
  onEvent: PropTypes.func,
  /** Provides information on when the resource has been requested to update - events contains the events that lead to the update */
  onNotify: PropTypes.func,
  children: PropTypes.node,
};

/**
 * Enables automatic updating for a Resource component or useResource hook by subscribing to an EventReceiver.
 *
 * Necessary configuration that is not directly specified is taken from the ConfigContext and ResourceContext.
 *
 * onEvent can be used to directly access events allowing you to add custom event logic to your components.
 */
function EventHandler({ children, ...props }) {
  useEventHandler(props);

  return <>{children}</>;
}

EventHandler.propTypes = propTypes;

export default EventHandler;
