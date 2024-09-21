import { Logger } from './Logger';
import { FetchCommitMessage } from './fetch-commit-message';
import * as fs from 'fs';
import { execSync } from 'child_process';

const logger = new Logger({
  serviceName: 'auto-commiter',
});

// Cleanup on exit (handles INT and TERM signals)
const cleanup = () => {
  logger.info('Script interrupted. Cleaning up...');
  if (fs.existsSync('/tmp/auto-commit.lock')) {
    fs.unlinkSync('/tmp/auto-commit.lock');
  }
  process.exit(1);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);



// Function to verify commit message
const run_loop = true
const verifyCommitMessage = async () => {
  while (run_loop) {
    const commitMessage = await FetchCommitMessage();
    if (!commitMessage) continue;

    try {
      logger.info(`Verifying commit message: ${commitMessage}`);
      execSync(`echo "${commitMessage}" | npx commitlint`);
      logger.info('Commit message passed commitlint check.');
      return commitMessage;
    } catch {
      logger.warn(`Commitlint check failed with message: ${commitMessage}. Retrying...`);
    }
  }
};

// Function to commit and push changes
const commitAndPush = async (commitMessage: string) => {
  try {
    logger.info('Committing changes...');
    execSync('git add .');
    execSync(`git commit -m "${commitMessage}"`);
    execSync('git push');
    logger.info('Changes pushed successfully.');
  } catch {
    logger.error('Failed to commit or push changes.');
    process.exit(1);
  }
};

// Main function
const main = async () => {
  if (fs.existsSync('/tmp/auto-commit.lock')) {
    logger.warn('Script is already running. Exiting to prevent multiple instances.');
    process.exit(1);
  }

  // Create a lock file
  fs.writeFileSync('/tmp/auto-commit.lock', '');

  while (run_loop) {
    const commitMessage = await verifyCommitMessage();
    await commitAndPush(commitMessage);

    logger.info('Waiting for 5 minutes before checking again...');
    await new Promise(resolve => setTimeout(resolve, 300000)); // Wait for 5 minutes
  }
};

main().finally(() => {
  if (fs.existsSync('/tmp/auto-commit.lock')) {
    fs.unlinkSync('/tmp/auto-commit.lock');
  }
});
