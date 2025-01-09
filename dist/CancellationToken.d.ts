import { EventEmitter } from "events";
/**
 * A CancellationToken can be used to cancel asynchronous operations.
 * The token can only be cancelled once.
 * When the token is cancelled, it emits a "cancel" event.
 */
export declare interface CancellationToken {
    emit(event: "cancel"): boolean;
    on(event: "cancel", listener: () => void): this;
    once(event: "cancel", listener: () => void): this;
    off(event: "cancel", listener: () => void): this;
}
export declare class CancellationToken extends EventEmitter {
    cancelled: boolean;
    cancel(): void;
    isCancelled(): boolean;
}
