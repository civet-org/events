import { useResource, type ResourceContextValue } from '@civet/core';
import useEventHandler from '@/useEventHandler';
import DemoDataProvider, { type DemoItem } from './DemoDataProvider';
import type { DemoEvent, DemoOptions } from './DemoEventReceiver';
import type DemoEventReceiver from './DemoEventReceiver';

type HahaItem = DemoItem & {
  name: string;
};

type HahaEvent = DemoEvent & {
  name: string;
};

export default function DemoResource() {
  const resource = useResource<DemoDataProvider, HahaItem>({
    name: 'haha',
    query: undefined,
  });

  useEventHandler<
    DemoEventReceiver,
    ResourceContextValue<DemoDataProvider>,
    DemoOptions,
    HahaEvent
  >({
    resource,
    onEvent: (event: HahaEvent) => {
      console.log('Got event', event.name);
      return false;
    },
  });

  return (
    <>
      <h1>
        {resource.request} - {resource.revision}
      </h1>

      {resource.data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </>
  );
}
