import React, { useContext } from 'react';

export const ConfigContext = React.createContext({});
ConfigContext.displayName = 'Events.ConfigContext';
export const useConfigContext = () => useContext(ConfigContext);
