import React from 'react';

export const ConfigContext = React.createContext({});
ConfigContext.displayName = 'Events.ConfigContext';
export const useConfigContext = () => React.useContext(ConfigContext);
