export interface LoggerOptions {
  serviceName: string;
}

export class Logger {
  private serviceName: string;
  public options: LoggerOptions;

  constructor(options: LoggerOptions) {
    this.serviceName = options.serviceName;
    this.options = options;
  }

  private async logToConsole(level: string, message: string) {
    const chalk = (await import('chalk')).default;  // Dynamically import chalk
    const levelStyles: Record<string, typeof chalk> = {
      Fatal: chalk.bold.redBright,
      Error: chalk.red,
      Warn: chalk.hex('#FFA500'), // Orange
      Info: chalk.blue,
      Debug: chalk.white,
      Trace: chalk.gray,
      Success: chalk.green,
    };

    const emojiMap: Record<string, string> = {
      Fatal: '💀',
      Error: '❌',
      Warn: '⚠️',
      Info: 'ℹ️',
      Debug: '🐞',
      Trace: '🔍',
      Success: '✅',
    };

    const styledMessage = `${emojiMap[level]} ${levelStyles[level](
      `[${this.serviceName}] [${level}] ${message}`
    )}`;
    console.log(styledMessage);
  }

  private log(level: string, message: string) {
    this.logToConsole(level, message);
  }

  fatal(message: string) {
    this.log('Fatal', message);
  }

  error(message: string) {
    this.log('Error', message);
  }

  warn(message: string) {
    this.log('Warn', message);
  }

  info(message: string) {
    this.log('Info', message);
  }

  debug(message: string) {
    this.log('Debug', message);
  }

  trace(message: string) {
    this.log('Trace', message);
  }

  success(message: string) {
    this.log('Success', message);
  }
}

export default Logger;
