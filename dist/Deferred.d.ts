import { CancellationToken } from "./CancellationToken.js";
/**
 * A Deferred is a Promise that can be resolved or rejected at a later time.
 * It can optionally be cancelled by a CancellationToken.
 * It stores the Promise and the resolve and reject functions.
 */
export declare class Deferred<T> {
    private timeout?;
    private ct?;
    private promise;
    private res?;
    private rej?;
    constructor(params?: {
        timeout?: number;
        ct?: CancellationToken;
        executor?: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
    });
    /**
     * Resolves the Promise
     * @param value The Value to use when resolving the Promise
     */
    resolve(value: T | PromiseLike<T>): void;
    /**
     * Rejects the Promise with a reason
     * @param reason The reason why the Promise was rejected
     */
    reject(reason?: any): void;
    /**
     * Returns the Promise of this deferred
     * @returns The Promise
     */
    getPromise(): Promise<T>;
    private cancelFunc;
    private cleanup;
}
