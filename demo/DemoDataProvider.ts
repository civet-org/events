import {
  DataProvider,
  Meta,
  type ContinuousGet,
  type GenericObject,
} from '@civet/core';
import eventPlugin from '@/eventPlugin';

export type DemoQuery =
  | {
      query?: string;
    }
  | undefined;

export type DemoOptions = {
  demo?: boolean;
};

export type DemoItem = {
  id: string;
  [key: string]: unknown;
};

export type DemoInstance = {
  instanceID: string;
};

class DemoDataProvider extends DataProvider<
  DemoItem,
  DemoQuery,
  DemoOptions,
  Meta<GenericObject, DemoInstance>,
  DemoItem[]
> {
  static TEST = true;

  constructor(demoText: string) {
    super();
    console.log(demoText);
  }

  createInstance(): DemoInstance | undefined {
    return { instanceID: Date.now().toString() };
  }

  createEmptyResponse(): DemoItem[] {
    return [];
  }

  handleGet(
    resourceName: string,
  ): DemoItem[] | Promise<DemoItem[]> | ContinuousGet<DemoItem[]> {
    switch (resourceName) {
      case 'haha':
        return [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ];

      default:
        return [{ id: 'a' }, { id: 'b' }];
    }
  }
}

const DemoDataProviderWithEvents = eventPlugin(DemoDataProvider);

export type DemoDataProviderType = InstanceType<
  typeof DemoDataProviderWithEvents
>;

export default DemoDataProviderWithEvents;
