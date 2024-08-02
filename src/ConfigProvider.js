import React from 'react';
import PropTypes from 'prop-types';

import { ConfigContext } from './context';
import { eventReceiverPropType } from './EventReceiver';

const ConfigProvider = ({ eventReceiver, children }) => (
  <ConfigContext.Provider value={{ eventReceiver }}>{children}</ConfigContext.Provider>
);

ConfigProvider.propTypes = {
  eventReceiver: eventReceiverPropType,
  children: PropTypes.node,
};

export default ConfigProvider;
