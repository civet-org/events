import {
  Notifier,
  type Constructor,
  type GenericDataProvider,
  type ResourceContextValue,
} from '@civet/core';

export default abstract class EventReceiver<
  Event,
  Resource extends ResourceContextValue<GenericDataProvider>,
  Options,
> {
  readonly _inferEvent!: Event;
  readonly _inferResource!: Resource;
  readonly _inferOptions!: Options;

  subscribe<
    EventI extends Event = Event,
    ResourceI extends Resource = Resource,
    OptionsI extends Options = Options,
  >(
    resource: Notifier<[ResourceI | undefined]> | undefined,
    options: OptionsI | undefined,
    handler: (events: EventI[]) => void,
  ): () => void {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
    const hasResource = resource != null;
    if (!hasResource) resource = new Notifier();
    const unsubscribe = this.handleSubscribe(
      resource as Notifier<[Resource | undefined]>,
      options,
      handler as (events: Event[]) => void,
    );
    if (!hasResource) resource?.trigger(undefined);
    if (typeof unsubscribe !== 'function') {
      console.warn(
        'EventReceiver.handleSubscribe should return a callback to cancel the subscription. Ignoring this warning may result in the execution of obsolete handlers and potential memory leaks.',
      );
    }
    return unsubscribe;
  }

  abstract handleSubscribe(
    resource: Notifier<[Resource | undefined]>,
    options: Options | undefined,
    handler: (events: Event[]) => void,
  ): () => void;
}

export const isEventReceiver = (eventReceiver: unknown): boolean =>
  eventReceiver instanceof EventReceiver;

export type EventReceiverImplementation<
  EventReceiverI extends GenericEventReceiver,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ConstructorArgs extends any[],
> = Constructor<
  ConstructorArgs,
  EventReceiverI & {
    handleSubscribe(
      resource: InferResource<EventReceiverI>,
      options: InferOptions<EventReceiverI> | undefined,
      handler: (events: InferEvent<EventReceiverI>[]) => void,
    ): () => void;
  }
>;

export type GenericEventReceiver = EventReceiver<
  unknown,
  ResourceContextValue<GenericDataProvider>,
  unknown
>;

export type InferEvent<EventReceiverI extends GenericEventReceiver> =
  EventReceiverI['_inferEvent'];

export type InferResource<EventReceiverI extends GenericEventReceiver> =
  EventReceiverI['_inferResource'];

export type InferOptions<EventReceiverI extends GenericEventReceiver> =
  EventReceiverI['_inferOptions'];
