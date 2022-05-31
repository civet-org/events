import PropTypes from 'prop-types';
import React from 'react';

import { eventReceiverPropType } from './EventReceiver';
import useEventHandler from './useEventHandler';

function EventHandler({ children, ...props }) {
  useEventHandler(props);

  return <>{children}</>;
}

EventHandler.propTypes = {
  eventReceiver: eventReceiverPropType,
  resource: PropTypes.object,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  onEvent: PropTypes.func,
  onNotify: PropTypes.func,
  children: PropTypes.node,
};

export default EventHandler;
