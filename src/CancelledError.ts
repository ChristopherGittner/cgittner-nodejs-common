/**
 * Error thrown when an operation is cancelled.
 */
export class CancelledError extends Error {
    constructor() {
        super("Cancelled");
    }
}