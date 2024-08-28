export interface FluentdOptions {
    host: string;
    port: number;
    timeout?: number;
    tag_prefix: string;
}
export interface LoggerOptions {
    serviceName: string;
    fluentd: FluentdOptions;
}
export declare class Logger {
    private serviceName;
    private fluentClient;
    constructor(options: LoggerOptions);
    private logToConsole;
    private logToFluentd;
    private log;
    fatal(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    trace(message: string): void;
    success(message: string): void;
}
export default Logger;
