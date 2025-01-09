/**
 * A Deferred is a Promise that can be resolved or rejected at a later time.
 * It can optionally be cancelled by a CancellationToken.
 * It stores the Promise and the resolve and reject functions.
 */
export class Deferred {
    timeout;
    ct;
    promise;
    res;
    rej;
    constructor(params) {
        this.promise = new Promise((resolve, reject) => {
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
    resolve(value) {
        if (this.res) {
            this.res(value);
        }
        this.cleanup();
    }
    /**
     * Rejects the Promise with a reason
     * @param reason The reason why the Promise was rejected
     */
    reject(reason) {
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
    cancelFunc = () => {
        this.reject(new Error("Cancelled"));
    };
    cleanup() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.ct) {
            this.ct.off("cancel", this.cancelFunc);
        }
    }
}
