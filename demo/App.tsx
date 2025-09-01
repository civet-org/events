import { ConfigProvider } from '@civet/core';
import { useState } from 'react';
import EventConfigProvider from '@/ConfigProvider';
import './App.css';
import DemoDataProvider from './DemoDataProvider';
import DemoEventReceiver from './DemoEventReceiver';
import DemoResource from './DemoResource';

export default function App() {
  const [dataProvider] = useState(() => new DemoDataProvider('demo'));
  const [eventReceiver] = useState(() => new DemoEventReceiver('event demo'));

  return (
    <ConfigProvider dataProvider={dataProvider}>
      <EventConfigProvider eventReceiver={eventReceiver}>
        <DemoResource />
      </EventConfigProvider>
    </ConfigProvider>
  );
}
