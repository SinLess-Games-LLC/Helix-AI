import { NestFactory } from '@nestjs/core'
import { Logger, LoggerOptions } from '@helix/logger'
import { ErrorCodes } from '@helix/core'
import { AppModule } from './app/app.module'
import process from 'process'

const loggerOptions: LoggerOptions = {
  serviceName: 'auth-server',
  fluentd: {
    host: process.env.FLUENTD_HOST || 'localhost',
    port: parseInt(process.env.FLUENTD_PORT || '24224', 10),
    tag_prefix: 'auth-server',
  },
}

async function bootstrap() {
  const logger = new Logger(loggerOptions)
  try {
    logger.info('🚀 | Starting the application...')
    const app = await NestFactory.create(AppModule)
    const globalPrefix = 'api'
    app.setGlobalPrefix(globalPrefix)
    const port = process.env.PORT || 3000

    await app.listen(port)
    logger.info(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    )

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      logger.warn('Received SIGTERM, shutting down gracefully...')
      await app.close()
      logger.info('Application has shut down gracefully')
      process.exit(0)
    })
  } catch (error) {
    logger.fatal('Failed to bootstrap the application')
    logger.error(error.message)
    process.exit(ErrorCodes.System.api.AUTH_SERVER_DOWN) // Exit the process with a failure code
  }
}

bootstrap()
