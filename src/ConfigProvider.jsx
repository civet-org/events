import PropTypes from 'prop-types';
import { eventReceiverPropType } from './EventReceiver';
import { ConfigContext } from './context';

const ConfigProvider = ({ eventReceiver, children }) => (
  <ConfigContext.Provider value={{ eventReceiver }}>
    {children}
  </ConfigContext.Provider>
);

ConfigProvider.propTypes = {
  eventReceiver: eventReceiverPropType,
  children: PropTypes.node,
};

export default ConfigProvider;
