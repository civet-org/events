import { useResource } from '@civet/core';
import { type DemoDataProviderType, type DemoItem } from './DemoDataProvider';
import type { DemoEvent } from './DemoEventReceiver';

type HahaItem = DemoItem & {
  name: string;
};

type HahaEvent = DemoEvent & {
  name: string;
};

function onEvent(event: unknown) {
  console.log('Got event', (event as HahaEvent).name);
  return false;
}

export default function DemoResource() {
  const resource = useResource<DemoDataProviderType, HahaItem[]>({
    name: 'haha',
    query: undefined,
    events: { onEvent },
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
