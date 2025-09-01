import type { ResourceContextValue } from '@civet/core';
import EventReceiver from '@/EventReceiver';
import type DemoDataProvider from './DemoDataProvider';

export type DemoOptions = {
  eventDemo?: boolean;
};

export type DemoEvent = {
  id: string;
  [key: string]: unknown;
};

export default class DemoEventReceiver extends EventReceiver<
  ResourceContextValue<DemoDataProvider>,
  DemoEvent,
  DemoOptions
> {
  static TEST = true;

  constructor(demoText: string) {
    super();
    console.log(demoText);
  }

  handleSubscribe(
    resource: ResourceContextValue<DemoDataProvider>,
    _options: DemoOptions | undefined,
    handler: (events: DemoEvent[]) => void,
  ): () => void {
    const interval = setInterval(() => {
      switch (resource.name) {
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

    return () => {
      clearInterval(interval);
    };
  }
}
