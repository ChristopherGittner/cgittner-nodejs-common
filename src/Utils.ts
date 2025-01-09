import { EventEmitter } from "events";
import { CancellationToken } from "./CancellationToken.js";
import { CancelledError } from "./CancelledError.js";
import { fromError } from "zod-validation-error";

/**
 * Returns a Promise that will be resolved after a certain amount of time. Can be used to asynchronously wait for a certain amount of time.
 * @param millis Number of milliseconds to sleep
 */
export function sleep(millis: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, millis);
    });
}

/**
 * Returns a Promise that will be resolved after a certain amount of time. Can be used to asynchronously wait for a certain amount of time.
 * The sleep can be cancelled by a CancellationToken.
 * When the CancellationToken is cancelled, the Promise will be rejected with a CancelledError.
 * @param millis Number of milliseconds to sleep
 * @param ct Optional CancellationToken to cancel the sleep
 */
export function sleepCt(millis: number, ct: CancellationToken) {
    return new Promise<void>((resolve, reject) => {
        let timeoutFunc = () => {
            clearTimeout(timeout);
            reject(new CancelledError());
        };

        let timeout = setTimeout(() => {
            resolve();
            ct.off("cancel", timeoutFunc);
        }, millis);

        ct.once("cancel", timeoutFunc);
    });
}

/**
 * Encodes a string to hex
 * @param data The data to its Byte hex representation.
 * @example "Hello, World!" --> "48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21"
 * @returns The Byte hex representation of the data
 */
export function hexEncode(data: string) {
    return data.split("").map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
}

/**
 * Creates a Promise that will be resolved when a certain event is emitted
 * @param emitter The event emitter to await the event on
 * @param event The event to await
 * @returns The Promise
 */
export function awaitEvent(emitter: EventEmitter, event: string) {
    return new Promise((resolve) => {
        emitter.once(event, resolve);
    });
}

/**
 * Converts a signed 13 bit number to an unsigned 16 bit number
 * @param val The signed 13 bit number
 * @returns The unsigned 13 bit number
 */
export function signed13FromUnsigned13(val: number) {
    let ret = val & 0x0FFF;
    if (val & 0x1000) {
        return ret - 0x1000;
    }
    return ret;
}

/**
 * Converts a signed 16 bit number to an unsigned 16 bit number
 * @param val The signed 16 bit number
 * @returns The unsigned 16 bit number
 */
export function signed16FromUnsigned16(val: number) {
    let ret = val & 0x7FFF;
    if (val & 0x8000) {
        return ret - 0x8000;
    }
    return ret;
}

/**
 * Converts a signed 16 bit number to an unsigned 16 bit number
 * @param val The signed 16 bit number
 * @returns The unsigned 16 bit number
 */
export function unsigned16FromSigned16(val: number) {
    if (val >= 0) {
        return val & 0x7FFF;
    } else {
        return (val & 0x7FFF) | 0x8000;
    }
}

/**
 *  Limits a value between a minimum and a maximum value
 * @param min The minimum value
 * @param value The value to limit
 * @param max The maximum value
 * @returns The Value within the Limits
 */
export function limit(min: number, value: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a certain number of decimals
 * @param value The value to round
 * @param decimals The number of decimals to round to
 * @returns The rounded Number
 */
export function round(value: number, decimals: number) {
    let exp = Math.round(parseFloat(`${value}e${decimals}`));
    return parseFloat(`${exp}e-${decimals}`);
}

/**
 * Gets the error message from an Error.
 * If the Error is a String, the string will be returned.
 * If the Error is from type Error it will return the message from the Error.
 * If the error is a ZodError, it will return the message from the ZodError.
 * @param error The error to get the message from
 * @returns A String with the error message
 */
export function getErrorMessage(error: unknown) {
    if (error && error.constructor.name === "ZodError" && (error as any).name === "ZodError") {
        return fromError(error).message;
    }
    else if (error instanceof Error) return error.message;
    else if (typeof ((error as any).message) === "string") return (error as any).message;
    return String(error);
}