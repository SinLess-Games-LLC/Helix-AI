import { FluentClient } from '@fluent-org/logger'

type LogLevel =
  | 'Fatal'
  | 'Error'
  | 'Warn'
  | 'Info'
  | 'Debug'
  | 'Trace'
  | 'Success'

export interface FluentdOptions {
  enabled: boolean
  host?: string
  port?: number
  timeout?: number
  tag_prefix?: string
}

export interface LoggerOptions {
  serviceName: string
  fluentd: FluentdOptions
}

export class Logger {
  private serviceName: string
  private fluentClient: any
  public options: LoggerOptions

  constructor(options: LoggerOptions) {
    this.serviceName = options.serviceName
    this.options = options

    this.options.fluentd.enabled = true

    this.fluentClient = new FluentClient(options.fluentd.tag_prefix, {
      socket: {
        host: options.fluentd.host || 'localhost',
        port: options.fluentd.port || 24224,
        timeout: options.fluentd.timeout || 3000,
      },
    })
  }

  private logToConsole(level: LogLevel, message: string) {
    const levelStyles: Record<LogLevel, string> = {
      Fatal: '\x1b[1m\x1b[38;5;196m',
      Error: '\x1b[1m\x1b[31m',
      Warn: '\x1b[38;5;208m\x1b[1m',
      Info: '\x1b[1m\x1b[34m',
      Debug: '\x1b[1m\x1b[37m',
      Trace: '\x1b[1m\x1b[33m',
      Success: '\x1b[1m\x1b[32m',
    }

    const emojiMap: Record<LogLevel, string> = {
      Fatal: '💀',
      Error: '❌',
      Warn: '⚠️',
      Info: '📘', // Changed emoji
      Debug: '🐞',
      Trace: '🔍',
      Success: '✅',
    }

    const colorReset = '\x1b[0m'

    // Handle object messages
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message) : message

    const styledMessage = `${emojiMap[level]} ${levelStyles[level]} | [${this.serviceName}] | [${level}] |${colorReset} ${formattedMessage}`
    console.log(styledMessage)
  }

  private logToFluentd(level: LogLevel, message: string) {
    this.fluentClient.emit(level, {
      serviceName: this.serviceName,
      level,
      message,
      timestamp: new Date().toISOString(),
    })
  }

  private log(level: LogLevel, message: string) {
    this.logToConsole(level, message)

    if (this.options.fluentd.enabled === true) {
      this.logToFluentd(level, message)
    }
  }

  fatal(message: string) {
    this.log('Fatal', message)
  }

  error(message: string) {
    this.log('Error', message)
  }

  warn(message: string) {
    this.log('Warn', message)
  }

  info(message: string) {
    this.log('Info', message)
  }

  debug(message: string) {
    this.log('Debug', message)
  }

  trace(message: string) {
    this.log('Trace', message)
  }

  success(message: string) {
    this.log('Success', message)
  }
}

export default Logger
