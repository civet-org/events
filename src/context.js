import React, { useContext } from 'react';

export const ConfigContext = React.createContext({});
export const useConfigContext = () => useContext(ConfigContext);
