import type { EventMap } from './events';

type EventHandler<T> = (data: T) => void;

class TypedEventBus {
  private emitter = new EventTarget();

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.emitter.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    const listener = (e: Event) => handler((e as CustomEvent).detail);
    this.emitter.addEventListener(event, listener);
    return () => this.emitter.removeEventListener(event, listener);
  }

  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const listener = (e: Event) => handler((e as CustomEvent).detail);
    this.emitter.addEventListener(event, listener, { once: true });
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.emitter.removeEventListener(event, handler as unknown as EventListener);
  }
}

export const eventBus = new TypedEventBus();
