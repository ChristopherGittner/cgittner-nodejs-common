import { AsyncLocalStorage } from "async_hooks";
import { format } from "util";

//The different log levels
export enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}

/**
 * Returns the string representation of a LogLevel
 * @param level The LogLevel to convert to a string
 * @returns The string representation of the LogLevel
 */
function logLevelToString(level: LogLevel) {
    switch (level) {
        case LogLevel.TRACE:
            return 'TRACE';
        case LogLevel.DEBUG:
            return 'DEBUG';
        case LogLevel.INFO:
            return 'INFO ';
        case LogLevel.WARN:
            return 'WARN ';
        case LogLevel.ERROR:
            return 'ERROR';
        case LogLevel.FATAL:
            return 'FATAL';
    }
}

/**
 * Returns the correct loglevel from a string. (The level may be case insensitive)
 * @param s The string to convert to a LogLevel
 * @throws Error if the string is not a valid LogLevel
 * @returns The LogLevel from the string
 */
export function logLevelFromString(s: string): LogLevel {
    switch (s.toUpperCase().trim()) {
        case 'TRACE':
            return LogLevel.TRACE;
        case 'DEBUG':
            return LogLevel.DEBUG;
        case 'INFO':
            return LogLevel.INFO;
        case 'WARN':
            return LogLevel.WARN;
        case 'ERROR':
            return LogLevel.ERROR;
        case 'FATAL':
            return LogLevel.FATAL;
        default: throw new Error(`Unknown log level: ${s}`);
    }
}

function logLevelColor(level: LogLevel) {
    switch (level) {
        case LogLevel.TRACE:
            return '\x1b[35m'; // Magenta
        case LogLevel.DEBUG:
            return '\x1b[36m'; // Cyan
        case LogLevel.INFO:
            return '\x1b[32m'; // Green
        case LogLevel.WARN:
            return '\x1b[33m'; // Yellow
        case LogLevel.ERROR:
            return '\x1b[31m'; // Red
        case LogLevel.FATAL:
            return '\x1b[4m\x1b[31m'; // Red underline
    }
}

export type LogConfigArg = {
    // The context of the logger
    context?: string;

    // Whether to color the output
    color?: Boolean;
};

type logCallback_t = (message: string) => void

/**
 * Logger class.
 * Logs can be sent to a Global log (static functions) or to a specific instance of a log.
 * An Optional Context can be set for the global as well as the instance log.
 */
export class Log {
    private static asyncLocalStorage = new AsyncLocalStorage();

    private static globalLog = new Log();

    private static level = LogLevel.INFO;

    private static defaults: LogConfigArg = {};

    private logCallback: logCallback_t;

    private config: {
        context?: string;
        color: Boolean;
    } = {
            color: false
        };

    constructor(arg?: string);
    constructor(arg?: LogConfigArg);
    constructor(arg?: string | LogConfigArg) {
        if (typeof arg === 'string') {
            this.setConfig({
                context: arg,
                color: Log.defaults.color,
            });
        } else if (arg) {
            this.setConfig({
                context: arg.context || Log.defaults.context,
                color: arg.color || Log.defaults.color,
            });
        }
    }

    /**
     * Sets defaults to use when arguments are not explicitly defined when creating new Logs
     * @param defaults Sets the default configuration for all new Created Logs
     */
    static setDefaults(defaults: LogConfigArg) {
        if (defaults.context !== undefined)
            Log.defaults.context = defaults.context;

        if (defaults.color !== undefined)
            Log.defaults.color = defaults.color;
    }

    /**
     * Sets the configuration of this Logger
     * @param config The configuration to set
     */
    setConfig(config: LogConfigArg) {
        this.config.context = config.context;
        if (config.color !== undefined)
            this.config.color = config.color;
    }

    /**
     * Sets the callback for this Logger. All messages will be logged and also be send as a string to the callback
     * @param cb The callback to set
     */
    setLogCallback(cb: logCallback_t) {
        this.logCallback = cb;
    }

    /**
     * Logs a message to this Logger
     * @param message The message to log
     * @param level optional log level, defaults to INFO
     */
    log(message = '', level: LogLevel = LogLevel.INFO, ...args: unknown[]) {
        if (level < Log.level) return;

        const store = Log.asyncLocalStorage.getStore();

        if (args.length > 0) {
            message = format(message, ...args);
        }

        const logMessage = `${new Date().toISOString()} [${logLevelToString(level)}]${store ? ` <${store}>` : ''}${this.config.context ? ` <${this.config.context}>` : ''} ${message}`;

        console.log(`${this.config.color ? logLevelColor(level) : ''}${logMessage}`);

        if (this.logCallback) {
            this.logCallback(logMessage);
        }
    }

    /**
     * Log a message with the level TRACE
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    trace(message = '', ...args: any) {
        this.log(message, LogLevel.TRACE, ...args);
    }

    /**
     * Log a message with the level DEBUG
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    debug(message = '', ...args: any) {
        this.log(message, LogLevel.DEBUG, ...args);
    }

    /**
     * Log a message with the level INFO
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    info(message = '', ...args: any) {
        this.log(message, LogLevel.INFO, ...args);
    }

    /**
     * Log a message with the level WARN
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    warn(message = '', ...args: any) {
        this.log(message, LogLevel.WARN, ...args);
    }

    /**
     * Log a message with the level ERROR
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    error(message = '', ...args: any) {
        this.log(message, LogLevel.ERROR, ...args);
    }

    /**
     * Log a message with the level FATAL
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    fatal(message = '', ...args: any) {
        this.log(message, LogLevel.FATAL, ...args);
    }

    /**
     * Set the Log Level for all Logs (Global and all instances)
     * @param level The log level to set
     */
    setLevel(level: LogLevel | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal') {
        if (typeof level === 'string') {
            Log.level = logLevelFromString(level);
        } else {
            Log.level = level;
        }
    }

    /**
     * Get the current log level
     * @returns The current log level
     */
    getLevel() {
        return Log.level;
    }

    /**
     * Get the context of this Logger
     * @returns The context of this Logger
     */
    getContext() {
        return this.config.context;
    }

    /**
     * Runs a callback and sets the context for it
     * @param context The context to set
     * @param cb The callback to run in the context
     */
    setAsyncContext(context: string, cb: () => void) {
        Log.setAsyncContext(context, cb);
    }

    /**
     * Logs a Message to the global log
     * @param message The message to log
     * @param level Optional log level, defaults to INFO
     * @param args (optional) Arguments to format the message with
     */
    static log(message = '', level: LogLevel = LogLevel.INFO, ...args: any) {
        this.globalLog.log(message, level, ...args);
    }

    /**
     * Log a message to the global log with the level TRACE
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static trace(message = '', ...args: any) {
        this.log(message, LogLevel.TRACE, ...args);
    }

    /**
     * Log a message to the global log with the level DEBUG
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static debug(message = '', ...args: any) {
        this.log(message, LogLevel.DEBUG, ...args);
    }

    /**
     * Log a message to the global log with the level INFO
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static info(message = '', ...args: any) {
        this.log(message, LogLevel.INFO, ...args);
    }

    /**
     * Log a message to the global log with the level WARN
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static warn(message = '', ...args: any) {
        this.log(message, LogLevel.WARN, ...args);
    }

    /**
     * Log a message to the global log with the level ERROR
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static error(message = '', ...args: any) {
        this.log(message, LogLevel.ERROR, ...args);
    }

    /**
     * Log a message to the global log with the level FATAL
     * @param message The message to log
     * @param args (optional) Arguments to format the message with
     */
    static fatal(message = '', ...args: any) {
        this.log(message, LogLevel.FATAL, ...args);
    }

    /**
     * Set the Log Level for all Logs (Global and all instances)
     * @param level The log level to set
     * @param args (optional) Arguments to format the message with
     */
    static setLevel(level: LogLevel | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal') {
        this.globalLog.setLevel(level);
    }

    /**
     * Get the current log level
     * @returns The current log level
     */
    static getLevel() {
        return this.globalLog.getLevel();
    }

    /**
     * Sets a context for the given callback and executes it
     * @param context The context to set
     * @param cb The callback to run in the context
     */
    static setAsyncContext(context: string, cb: () => void) {
        this.asyncLocalStorage.run(context, cb);
    }

    /**
     * Sets the configuration of the global log
     * @param config The configuration to set
     */
    static setGlobalConfig(config: LogConfigArg) {
        this.globalLog.setConfig(config);
    }

    /**
     * Sets the callback for the global log. All messages will be logged and also be send as a string to the callback
     * @param cb The callback to set
     */
    static setlogCallback(cb: logCallback_t) {
        this.globalLog.setLogCallback(cb);
    }
}
