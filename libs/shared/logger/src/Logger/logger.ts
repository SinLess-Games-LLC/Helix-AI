import chalk from 'chalk'
import('chalk')
import { FluentClient } from '@fluent-org/logger'

export interface FluentdOptions {
  host: string
  port: number
  timeout?: number
  tag_prefix: string
}

export interface LoggerOptions {
  serviceName: string
  fluentd: FluentdOptions
}

export class Logger {
  private serviceName: string
  private fluentClient: any

  constructor(options: LoggerOptions) {
    this.serviceName = options.serviceName

    this.fluentClient = new FluentClient(options.fluentd.tag_prefix, {
      socket: {
        host: options.fluentd.host,
        port: options.fluentd.port,
        timeout: options.fluentd.timeout || 3000,
      },
    })
  }

  private logToConsole(level: string, message: string) {
    const levelStyles: Record<string, typeof chalk> = {
      Fatal: chalk.bold.redBright,
      Error: chalk.red,
      Warn: chalk.hex('#FFA500'), // Orange
      Info: chalk.blue,
      Debug: chalk.white,
      Trace: chalk.gray,
      Success: chalk.green,
    }

    const emojiMap: Record<string, string> = {
      Fatal: '💀',
      Error: '❌',
      Warn: '⚠️',
      Info: 'ℹ️',
      Debug: '🐞',
      Trace: '🔍',
      Success: '✅',
    }

    const styledMessage = `${emojiMap[level]} ${levelStyles[level](
      `[${this.serviceName}] [${level}] ${message}`,
    )}`
    console.log(styledMessage)
  }

  private logToFluentd(level: string, message: string) {
    this.fluentClient.emit(level, {
      serviceName: this.serviceName,
      level,
      message,
      timestamp: new Date().toISOString(),
    })
  }

  private log(level: string, message: string) {
    this.logToConsole(level, message)
    this.logToFluentd(level, message)
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
