

export class Logger {
  private static instance: Logger;
  private logLevel: 'info' | 'warn' | 'error' | 'debug'

  private constructor(logLevel) {
    this.logLevel = logLevel;
  }

  public static getInstance(logLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }
  public setLogLevel(level: 'info' | 'warn' | 'error' | 'debug') {
    this.logLevel = level;
  }

  public info(message: string): void {
    if (this.logLevel === 'info' || this.logLevel === 'warn' || this.logLevel === 'error' || this.logLevel === 'debug') {
      console.info(`[INFO] ${message}`);
    }
  }

  public warn(message: string): void {
    if (this.logLevel === 'warn' || this.logLevel === 'error' || this.logLevel === 'debug') {
      console.warn(`[WARN] ${message}`);
    }
  }

  public error(message: string): void {
    if (this.logLevel === 'error' || this.logLevel === 'debug') {
      console.error(`[ERROR] ${message}`);
    }
  }

  public debug(message: string): void {
    if (this.logLevel === 'info' || this.logLevel === 'warn' || this.logLevel === 'error' || this.logLevel === 'debug') {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  public critical(message: string): void {
    if (this.logLevel === 'info' || this.logLevel === 'warn' || this.logLevel === 'error' || this.logLevel === 'debug') {
      console.error(`[CRITICAL] ${message}`);
    }
  }
}
