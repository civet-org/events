import { createContext, useContext } from 'react';

export const ConfigContext = createContext({});
ConfigContext.displayName = 'Events.ConfigContext';
export const useConfigContext = () => useContext(ConfigContext);
