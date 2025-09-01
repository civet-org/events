import type {
  Constructor,
  GenericDataProvider,
  ResourceContextValue,
} from '@civet/core';

export default abstract class EventReceiver<
  Resource extends ResourceContextValue<GenericDataProvider>,
  Event,
  Options,
> {
  readonly _inferResource!: Resource;
  readonly _inferEvent!: Event;
  readonly _inferOptions!: Options;

  subscribe<
    ResourceI extends Resource = Resource,
    OptionsI extends Options = Options,
    EventI extends Event = Event,
  >(
    resource: ResourceI,
    options: OptionsI | undefined,
    handler: (events: EventI[]) => void,
  ): () => void {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
    const unsubscribe = this.handleSubscribe(
      resource,
      options,
      handler as (events: Event[]) => void,
    );
    if (typeof unsubscribe !== 'function') {
      console.warn(
        'EventReceiver.handleSubscribe should return a callback to cancel the subscription. Ignoring this warning may result in the execution of obsolete handlers and potential memory leaks.',
      );
    }
    return unsubscribe;
  }

  abstract handleSubscribe(
    resource: Resource,
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
  ResourceContextValue<GenericDataProvider>,
  unknown,
  unknown
>;

export type InferResource<EventReceiverI extends GenericEventReceiver> =
  EventReceiverI['_inferResource'];

export type InferEvent<EventReceiverI extends GenericEventReceiver> =
  EventReceiverI['_inferEvent'];

export type InferOptions<EventReceiverI extends GenericEventReceiver> =
  EventReceiverI['_inferOptions'];
