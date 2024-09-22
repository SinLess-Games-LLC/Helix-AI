import { Daemon } from './daemon'

// Create an instance of your daemon
const daemon = new Daemon()

// Gracefully shutdown the daemon
async function shutdown() {
  try {
    console.log('Shutting down the daemon gracefully...')
    await daemon.stop()
    console.log('Daemon has been stopped.')
    process.exit(0) // Exit gracefully
  } catch (error) {
    console.error('Error while stopping the daemon:', error)
    process.exit(1) // Exit with error
  }
}

// Handle startup logic
async function startDaemon() {
  try {
    console.log('Starting the daemon...')
    await daemon.start()
    console.log('Daemon started successfully.')
  } catch (error) {
    console.error('Error while starting the daemon:', error)
    process.exit(1) // Exit with error if daemon fails to start
  }
}

// Handle OS signals to gracefully stop the daemon
process.on('SIGINT', shutdown) // Handle CTRL+C
process.on('SIGTERM', shutdown) // Handle termination signals (e.g., from Docker, Kubernetes)

// Start the daemon
startDaemon()
