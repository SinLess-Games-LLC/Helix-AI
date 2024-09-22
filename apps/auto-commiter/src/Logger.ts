import { SystemColors } from '@helix/core'

export interface LoggerOptions {
  serviceName: string
}

type LevelStyles = {
  Fatal: string
  Error: string
  Warn: string
  Info: string
  Debug: string
  Trace: string
  Success: string
}

export class Logger {
  private serviceName: string
  public options: LoggerOptions

  constructor(options: LoggerOptions) {
    this.serviceName = options.serviceName
    this.options = options
  }

  private async logToConsole(level: keyof LevelStyles, message: string) {
    const levelStyles: LevelStyles = {
      Fatal: `${SystemColors.bold}${SystemColors.fg.crimson.ansi}`,
      Error: SystemColors.fg.crimson.ansi,
      Warn: SystemColors.fg.yellow.ansi,
      Info: SystemColors.fg.blue.ansi,
      Debug: SystemColors.fg.white.ansi,
      Trace: SystemColors.fg.gray.ansi,
      Success: SystemColors.fg.green.ansi,
    }

    const emojiMap: Record<keyof LevelStyles, string> = {
      Fatal: '💀',
      Error: '❌',
      Warn: '⚠️',
      Info: 'ℹ️',
      Debug: '🐞',
      Trace: '🔍',
      Success: '✅',
    }

    // Enforce that the `level` is one of the defined keys in `LevelStyles`
    if (level in levelStyles) {
      const styledMessage = `${emojiMap[level]} ${levelStyles[level]} [${this.serviceName}] [${level}] ${SystemColors.reset} ${message}`
      console.log(styledMessage)
    } else {
      console.error(`Invalid log level: ${level}`)
    }
  }

  private log(level: keyof LevelStyles, message: string) {
    this.logToConsole(level, message)
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
