import { useMemo, type PropsWithChildren, type ReactNode } from 'react';
import { type GenericEventReceiver } from './EventReceiver';
import { ConfigContext } from './context';

/**
 * Provides general configuration to its descendants using React's context API.
 */
export default function ConfigProvider<
  EventReceiverI extends GenericEventReceiver,
>({
  eventReceiver,
  children,
}: PropsWithChildren<{ eventReceiver: EventReceiverI }>): ReactNode {
  const context = useMemo(() => ({ eventReceiver }), [eventReceiver]);

  return (
    <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>
  );
}
