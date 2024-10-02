import { Logger } from '@helix/logger'
import { exec } from 'child_process'
import { Openai } from '@helix/core'
import { promisify } from 'util'
import chokidar from 'chokidar'
import { OpenAI, ClientOptions } from 'openai'

const execAsync = promisify(exec)

export class Daemon {
  private logger: Logger
  private isRunning: boolean
  private commitMessage: string | null | undefined
  private lastCommit: Date | null
  private lockfilePresent: boolean
  private fileChangeQueue: Set<string>
  private debouncedHandleFileChange: NodeJS.Timeout | null
  openai: OpenAI

  constructor() {
    this.logger = new Logger({
      serviceName: 'AutoCommiter-Daemon',
      fluentd: { enabled: false },
    })
    this.isRunning = false
    this.fileChangeQueue = new Set()
    this.debouncedHandleFileChange = null
    this.lastCommit = null
    const options: ClientOptions = {
      apiKey: Openai.api_key,
    }

    this.openai = new OpenAI(options)
  }

  public async start() {
    await this.createLockfile()
    if (this.lockfilePresent) {
      if (this.isRunning) {
        this.logger.warn('Daemon is already running.')
        return
      }

      this.logger.info('Starting daemon...')
      this.isRunning = true

      try {
        await this.runLoop()
      } catch (error) {
        this.logger.error(`Error occurred while starting the daemon: ${error}`)
        this.stop()
      }
    } else {
      this.logger.error('Daemon cannot start without a lockfile.')
    }
  }

  public stop() {
    if (!this.isRunning) {
      this.logger.warn('Daemon is not running.')
      return
    }

    this.logger.info('Stopping the daemon...')
    this.isRunning = false
  }

  private async createLockfile() {
    try {
      this.logger.info('Creating lockfile...')
      await execAsync('touch /tmp/auto-commiter.lock')
      this.lockfilePresent = true
      this.logger.info('Lockfile created.')
    } catch (error) {
      this.lockfilePresent = false
      this.logger.error(`Failed to create lockfile: ${error}`)
    }
  }

  private async runLoop() {
    this.logger.info('Daemon is running...')

    const watcher = chokidar.watch(['./**/*'], {
      ignored: /(^|[/\\])\..|node_modules|dist|tmp|\.data/,
      persistent: true,
    })

    watcher.on('all', async (event, path) => {
      this.logger.info(`${event} detected on ${path}.`)
      this.fileChangeQueue.add(path)

      if (this.debouncedHandleFileChange) {
        clearTimeout(this.debouncedHandleFileChange)
      }

      this.debouncedHandleFileChange = setTimeout(
        () => this.handleFileChange(),
        1000,
      ) // Debounce for 1 second
    })

    await new Promise((resolve) => watcher.on('ready', resolve))

    while (this.isRunning) {
      await this.sleep(5000) // Sleep if nothing to do
    }

    this.logger.info('Daemon has stopped running.')
  }

  private async handleFileChange() {
    try {
      const now = new Date()

      // If the last commit was less than 5 minutes ago, skip the commit
      if (
        this.lastCommit &&
        now.getTime() - this.lastCommit.getTime() < 300000
      ) {
        this.logger.info(
          `Less than 5 minutes since last commit. Skipping commit...`,
        )
        return
      }

      const changedFiles = Array.from(this.fileChangeQueue).join('\n')
      // this.logger.info(`Files have changed: \n${changedFiles}`)

      // Retry logic for generating a valid commit message
      let attempts = 0
      const maxAttempts = 4
      let commitValid = false

      while (attempts < maxAttempts && !commitValid) {
        this.logger.info(
          `Attempt ${attempts + 1} to generate commit message...`,
        )
        this.commitMessage = await this.getCommitMessage(changedFiles)

        if (!this.commitMessage) {
          this.logger.warn('No commit message was generated.')
          attempts++
          continue
        }

        this.logger.info(`Generated commit message: ${this.commitMessage}`)

        // Validate the commit message using commitlint
        commitValid = await this.validateCommitMessage(this.commitMessage)

        if (commitValid) {
          this.logger.info('Commit message is valid.')
        } else {
          this.logger.warn('Commit message is invalid.')
        }

        attempts++
      }

      // If all attempts fail, wait 5 minutes before trying again
      if (!commitValid) {
        this.logger.error(
          'All attempts to generate a valid commit message failed. Waiting 5 minutes...',
        )
        await this.sleep(300000) // Sleep for 5 minutes
        return
      }

      // If valid, proceed with committing and pushing the changes
      this.logger.info('Committing changes...')
      await this.commitChanges(this.commitMessage)
      this.lastCommit = new Date()
      this.logger.info(`Changes committed at ${this.lastCommit}.`)

      this.logger.info('Pushing changes...')
      await this.pushChanges()
      this.logger.info('Changes pushed.')
      this.fileChangeQueue.clear()
    } catch (error) {
      this.logger.error(`Failed to handle file change: ${error}`)
    }
  }

  private async pushChanges() {
    try {
      this.logger.info('Pushing changes...')
      await execAsync('git push')
      this.logger.info('Changes pushed.')
    } catch (error) {
      this.logger.error(`Failed to push changes: ${error}`)
    }
  }

  private async commitChanges(message: string | null | undefined) {
    try {
      this.logger.info('Committing changes...')
      await execAsync(`git add . && git commit -m "${message}"`)
      this.logger.info('Changes committed.')
    } catch (error) {
      this.logger.error(`Failed to commit changes: ${error}`)
    }
  }

  private async getCommitMessage(changedFiles: string) {
    try {
      this.logger.info('Preparing payload for OpenAI API request...')

      if (!changedFiles) {
        this.logger.warn('No files have changed.')
        return null
      }

      const escapedChangedFiles = JSON.stringify(changedFiles).replace(
        /\n/g,
        '\\n',
      )

      // Include your commitlint rules in the message
      this.logger.info('Payload created. Sending request to OpenAI...')
      const response = await this.openai.chat.completions.create({
        model: Openai.models.gpt4o,
        messages: [
          {
            role: 'system',
            content:
              'Your job is to create commit messages following commitlint rules.',
          },
          {
            role: 'system',
            content:
              "Commitlint types: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert'].",
          },
          {
            role: 'system',
            content:
              "Commitlint scopes: ['docs', 'config', 'core', 'components', 'utils', 'authentication', 'frontend', 'backend', 'ci/cd', 'docker', 'kubernetes', 'testing', 'linting', 'formatting', 'security', 'dependencies', 'performance', 'accessibility', 'workflow', 'auto-commit'].",
          },
          {
            role: 'system',
            content:
              'Each commit message must include a body. The body should describe the changes in detail.',
          },
          {
            role: 'system',
            content: `Here are the file names that have been modified:\n${escapedChangedFiles}`,
          },
          {
            role: 'user',
            content:
              'Please generate a commit message with both a subject and a body based on these changes. Make sure the message follows the specified commitlint rules.',
          },
        ],
        temperature: 0.7,
      })

      return response.choices[0].message.content
    } catch (error) {
      this.logger.error(`Failed to send payload to OpenAI API: ${error}`)
      return null
    }
  }

  // Validate the commit message using commitlint
  private async validateCommitMessage(message: string): Promise<boolean> {
    try {
      const { stderr } = await execAsync(
        `echo "${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}" | npx commitlint --verbose`,
      )
      if (stderr) {
        this.logger.error(`Commitlint validation failed: ${stderr}`)
        return false
      }
      return true
    } catch (error) {
      this.logger.error(`Error during commitlint validation: ${error}`)
      return false
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const totalSeconds = Math.floor(ms / 1000)
      let remainingSeconds = totalSeconds

      this.logger.info(
        `Sleeping for ${Math.floor(totalSeconds / 60)} minutes and ${
          totalSeconds % 60
        } seconds...`,
      )

      const interval = setInterval(() => {
        remainingSeconds--

        // Calculate minutes and seconds
        const minutes = Math.floor(remainingSeconds / 60)
        const seconds = remainingSeconds % 60

        // Display the countdown timer on a single line
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
        process.stdout.write(`Time remaining: ${minutes}m ${seconds}s`)

        if (remainingSeconds <= 0) {
          clearInterval(interval)
          process.stdout.clearLine(0)
          process.stdout.cursorTo(0)
          resolve()
        }
      }, 1000)
    })
  }
}
