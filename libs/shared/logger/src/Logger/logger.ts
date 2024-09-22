import { FluentClient } from '@fluent-org/logger'
import { SystemColors } from '@helix/core'

interface levelStyles {
  Fatal: string
  Error: { ansi: string; hex: string; rgb: string; rgba: string }
  Warn: { ansi: string; hex: string; rgb: string; rgba: string }
  Info: { ansi: string; hex: string; rgb: string; rgba: string }
  Debug: { ansi: string; hex: string; rgb: string; rgba: string }
  Trace: { ansi: string; hex: string; rgb: string; rgba: string }
  Success: { ansi: string; hex: string; rgb: string; rgba: string }
}

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

  private logToConsole(level: string, message: string) {
    const levelStyles: levelStyles = {
      Fatal: `${SystemColors.bold}${SystemColors.fg.crimson}`,
      Error: SystemColors.fg.crimson,
      Warn: SystemColors.fg.yellow,
      Info: SystemColors.fg.blue,
      Debug: SystemColors.fg.white,
      Trace: SystemColors.fg.gray,
      Success: SystemColors.fg.green,
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

    const styledMessage = `${emojiMap[level]} ${levelStyles[level]} [${this.serviceName}] [${level}] ${SystemColors.reset} ${message}`
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
