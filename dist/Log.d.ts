export declare enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}
/**
 * Returns the correct loglevel from a string. (The level may be case insensitive)
 * @param s The string to convert to a LogLevel
 * @throws Error if the string is not a valid LogLevel
 * @returns The LogLevel from the string
 */
export declare function logLevelFromString(s: string): LogLevel;
export type LogConfigArg = {
    context?: string;
    color?: Boolean;
};
type logCallback_t = (message: string, // The logged message
level: LogLevel) => void;
/**
 * Logger class.
 * Logs can be sent to a Global log (static functions) or to a specific instance of a log.
 * An Optional Context can be set for the global as well as the instance log.
 */
export declare class Log {
    private static asyncLocalStorage;
    private static globalLog;
    private static level;
    private logCallback;
    private static globalLogCallback;
    private config;
    constructor(arg?: string);
    constructor(arg?: LogConfigArg);
    /**
     * Sets defaults to use when arguments are not explicitly defined when creating new Logs
     * @param defaults Sets the default configuration for all new Created Logs
     */
    static setDefaults(defaults: LogConfigArg): void;
    /**
     * Sets the configuration of this Logger
     * @param config The configuration to set
     */
    setConfig(config: LogConfigArg): void;
    /**
     * Sets the callback for this Logger. All messages will be logged and also be send as a string to the callback
     * @param cb The callback to set
     */
    setLogCallback(cb: logCallback_t): void;
    /**
     * Logs a message to this Logger
     * @param message The message to log
     * @param level optional log level, defaults to INFO
     */
    log(message?: string, level?: LogLevel, ...args: unknown[]): void;
    /**
     * Log a message with the level TRACE
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    trace(message?: string, ...args: any): void;
    /**
     * Log a message with the level DEBUG
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    debug(message?: string, ...args: any): void;
    /**
     * Log a message with the level INFO
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    info(message?: string, ...args: any): void;
    /**
     * Log a message with the level WARN
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    warn(message?: string, ...args: any): void;
    /**
     * Log a message with the level ERROR
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    error(message?: string, ...args: any): void;
    /**
     * Log a message with the level FATAL
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    fatal(message?: string, ...args: any): void;
    /**
     * Set the Log Level for all Logs (Global and all instances)
     * @param level The log level to set
     */
    setLevel(level: LogLevel | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'): void;
    /**
     * Get the current log level
     * @returns The current log level
     */
    getLevel(): LogLevel;
    /**
     * Get the context of this Logger
     * @returns The context of this Logger
     */
    getContext(): string;
    /**
     * Runs a callback and sets the context for it
     * @param context The context to set
     * @param cb The callback to run in the context
     */
    setAsyncContext(context: string, cb: () => void): void;
    /**
     * Logs a Message to the global log
     * @param message The message to log
     * @param level Optional log level, defaults to INFO
     * @param args (optional) Arguments to format the message with
     */
    static log(message?: string, level?: LogLevel, ...args: any): void;
    /**
     * Log a message to the global log with the level TRACE
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static trace(message?: string, ...args: any): void;
    /**
     * Log a message to the global log with the level DEBUG
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static debug(message?: string, ...args: any): void;
    /**
     * Log a message to the global log with the level INFO
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static info(message?: string, ...args: any): void;
    /**
     * Log a message to the global log with the level WARN
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static warn(message?: string, ...args: any): void;
    /**
     * Log a message to the global log with the level ERROR
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static error(message?: string, ...args: any): void;
    /**
     * Log a message to the global log with the level FATAL
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static fatal(message?: string, ...args: any): void;
    /**
     * Set the Log Level for all Logs (Global and all instances)
     * @param level The log level to set
     * @param args (optional) Arguments to format the message with
     */
    static setLevel(level: LogLevel | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'): void;
    /**
     * Get the current log level
     * @returns The current log level
     */
    static getLevel(): LogLevel;
    /**
     * Sets a context for the given callback and executes it
     * @param context The context to set
     * @param cb The callback to run in the context
     */
    static setAsyncContext(context: string, cb: () => void): void;
    /**
     * Sets the configuration of the global log
     * @param config The configuration to set
     */
    static setGlobalConfig(config: LogConfigArg): void;
    /**
     * Sets the callback for the global log. All messages will be logged and also be send as a string to the callback
     * @param cb The callback to set
     */
    static setlogCallback(cb: logCallback_t): void;
    /**
     * Sets the callback for all logs (instances and global). All messages will be logged and also be send as a string to the callback
     * @param cb The callback that is called for all logs (instances and global)
     */
    static setGlobalLogCallback(cb: logCallback_t): void;
}
export {};
