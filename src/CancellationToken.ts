import { EventEmitter } from "events";
import { off } from "process";

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

export class CancellationToken extends EventEmitter {
    cancelled = false;

    // Cancels the token
    cancel() {
        if (!this.cancelled) {
            this.cancelled = false;
            this.emit("cancel");
            this.off
        }
    }

    // Returns true if the token has been cancelled
    isCancelled() {
        return this.cancelled;
    }
}
