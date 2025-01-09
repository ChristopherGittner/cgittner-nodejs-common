import { CancellationToken } from "./CancellationToken.js";

/**
 * A Deferred is a Promise that can be resolved or rejected at a later time.
 * It can optionally be cancelled by a CancellationToken.
 * It stores the Promise and the resolve and reject functions.
 */
export class Deferred<T> {
    private timeout?: NodeJS.Timeout;
    private ct?: CancellationToken;

    private promise: Promise<T>;
    private res?: (value: T | PromiseLike<T>) => void;
    private rej?: (reason?: any) => void;

    constructor(params?: { timeout?: number, ct?: CancellationToken, executor?: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void }) {
        this.promise = new Promise<T>((resolve, reject) => {
            this.res = resolve;
            this.rej = reject;
        });

        if (params) {
            if (params.executor) {
                (params.executor)(this.resolve.bind(this), this.reject.bind(this));
            }

            if (params.timeout && params.timeout > 0) {
                this.timeout = setTimeout(() => {
                    this.reject(new Error("Timed out"));
                }, params.timeout);
            }

            if (params.ct) {
                this.ct = params.ct;
                this.ct.once("cancel", this.cancelFunc.bind(this));
            }
        }
    }

    /**
     * Resolves the Promise
     * @param value The Value to use when resolving the Promise
     */
    resolve(value: T | PromiseLike<T>) {
        if (this.res) {
            this.res(value);
        }

        this.cleanup();
    }

    /**
     * Rejects the Promise with a reason
     * @param reason The reason why the Promise was rejected
     */
    reject(reason?: any) {
        if (this.rej) {
            this.rej(reason);
        }

        this.cleanup();
    }

    /**
     * Returns the Promise of this deferred
     * @returns The Promise
     */
    getPromise() {
        return this.promise;
    }

    private cancelFunc = () => {
        this.reject(new Error("Cancelled"));
    }

    private cleanup() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (this.ct) {
            this.ct.off("cancel", this.cancelFunc);
        }
    }
}
