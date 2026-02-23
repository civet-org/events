import type { Notifier, ResourceContextValue } from '@civet/core';
import EventReceiver from '@/EventReceiver';
import type { DemoDataProviderType } from './DemoDataProvider';

export type DemoOptions = {
  eventDemo?: boolean;
};

export type DemoEvent = {
  id: string;
  [key: string]: unknown;
};

export default class DemoEventReceiver extends EventReceiver<
  DemoEvent,
  ResourceContextValue<DemoDataProviderType>,
  DemoOptions
> {
  static TEST = true;

  constructor(demoText: string) {
    super();
    console.log(demoText);
  }

  handleSubscribe(
    resourceNotifier: Notifier<
      [ResourceContextValue<DemoDataProviderType> | undefined]
    >,
    _options: DemoOptions | undefined,
    handler: (events: DemoEvent[]) => void,
  ): () => void {
    let interval: number;

    const unsub = resourceNotifier.subscribe((resource) => {
      if (interval != null) {
        unsub();
        return;
      }

      interval = setInterval(() => {
        switch (resource?.name) {
          case 'haha':
            handler([
              { id: 'a', name: 'A' },
              { id: 'b', name: 'B' },
            ]);
            break;

          default:
            handler([{ id: 'a' }, { id: 'b' }]);
        }
      }, 5000);
    });

    return () => {
      clearInterval(interval);
    };
  }
}
