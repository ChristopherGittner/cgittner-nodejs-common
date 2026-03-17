import { EventEmitter } from "events";
export class CancellationToken extends EventEmitter {
    cancelled = false;
    // Cancels the token
    cancel() {
        if (!this.cancelled) {
            this.cancelled = true;
            this.emit("cancel");
        }
    }
    // Returns true if the token has been cancelled
    isCancelled() {
        return this.cancelled;
    }
}
