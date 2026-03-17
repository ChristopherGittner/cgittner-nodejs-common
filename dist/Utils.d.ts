import { EventEmitter } from "events";
import { CancellationToken } from "./CancellationToken.js";
/**
 * Returns a Promise that will be resolved after a certain amount of time. Can be used to asynchronously wait for a certain amount of time.
 * @param millis Number of milliseconds to sleep
 */
export declare function sleep(millis: number): Promise<void>;
/**
 * Returns a Promise that will be resolved after a certain amount of time. Can be used to asynchronously wait for a certain amount of time.
 * The sleep can be cancelled by a CancellationToken.
 * When the CancellationToken is cancelled, the Promise will be rejected with a CancelledError.
 * @param millis Number of milliseconds to sleep
 * @param ct Optional CancellationToken to cancel the sleep
 */
export declare function sleepCt(millis: number, ct: CancellationToken): Promise<void>;
/**
 * Encodes a string to hex
 * @param data The data to its Byte hex representation.
 * @example "Hello, World!" --> "48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21"
 * @returns The Byte hex representation of the data
 */
export declare function hexEncode(data: string): string;
/**
 * Creates a Promise that will be resolved when a certain event is emitted
 * @param emitter The event emitter to await the event on
 * @param event The event to await
 * @returns The Promise
 */
export declare function awaitEvent(emitter: EventEmitter, event: string): Promise<unknown>;
/**
 * Converts a signed 13 bit number to an unsigned 16 bit number
 * @param val The signed 13 bit number
 * @returns The unsigned 13 bit number
 */
export declare function signed13FromUnsigned13(val: number): number;
/**
 * Converts a signed 16 bit number to an unsigned 16 bit number
 * @param val The signed 16 bit number
 * @returns The unsigned 16 bit number
 */
export declare function signed16FromUnsigned16(val: number): number;
/**
 * Converts a signed 16 bit number to an unsigned 16 bit number
 * @param val The signed 16 bit number
 * @returns The unsigned 16 bit number
 */
export declare function unsigned16FromSigned16(val: number): number;
/**
 *  Limits a value between a minimum and a maximum value
 * @param min The minimum value
 * @param value The value to limit
 * @param max The maximum value
 * @returns The Value within the Limits
 */
export declare function limit(min: number, value: number, max: number): number;
/**
 * Rounds a number to a certain number of decimals
 * @param value The value to round
 * @param decimals The number of decimals to round to
 * @returns The rounded Number
 */
export declare function round(value: number, decimals: number): number;
/**
 * Gets the error message from an Error.
 * If the Error is a String, the string will be returned.
 * If the Error is from type Error it will return the message from the Error.
 * If the error is a ZodError, it will return the message from the ZodError.
 * @param error The error to get the message from
 * @returns A String with the error message
 */
export declare function getErrorMessage(error: unknown): any;
