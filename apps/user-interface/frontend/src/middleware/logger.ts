import { Logger, LoggerOptions } from '@helix/logger'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const loggerOptions: LoggerOptions = {
    serviceName: 'frontend',
    fluentd: {
      host: 'localhost',
      port: 24224,
      tag_prefix: 'helix',
    },
  }

  const logger = new Logger(loggerOptions)

  try {
    logger.info(`Request received: ${req.url}`)

    // Continue to the next middleware or route handler
    return NextResponse.next()
  } catch (error: any) {
    logger.error(`Error processing request: ${error.message}`)

    // Return a 500 error response if something goes wrong
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
