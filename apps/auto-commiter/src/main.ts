import { Logger } from '@helix/logger';
import axios  from 'axios';
import * as fs from 'fs';
import { execSync } from 'child_process';

export const Scopes = [
  'docs',
  'config',
  'core',
  'components',
  'utils',
  'authentication',
  'frontend',
  'backend',
  'ci/cd',
  'docker',
  'kubernetes',
  'testing',
  'linting',
  'formatting',
  'security',
  'dependencies',
  'performance',
  'accessibility',
  'workflow',
  'auto-commit',
]

export const Types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']

const logger = new Logger({
  serviceName: 'backend',
  fluentd: {
    enabled: false,
  },
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

// API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

// Make API request to OpenAI
const makeRequest = async () => {
  logger.info('Preparing payload for OpenAI API request...');

  // Get the list of changed files
  const changedFiles = execSync('git diff --name-only HEAD').toString().trim();


  if (!changedFiles) {
    logger.warn('No files have changed.');
    return null;
  }

  const escapedChangedFiles = JSON.stringify(changedFiles).replace(/\n/g, '\\n');

  logger.debug('Types');

  const payload = {
    model: MODEL,
    messages: [
      { role: 'system', content: 'Your job is to create commit messages following commit lint rules.' },
      { role: 'system', content: `Commitlint types: ${Types}` },
      { role: 'system', content: `Commitlint scopes: ${Scopes}` },
      { role: 'system', content: `Here are the file names that have been modified:\n${escapedChangedFiles}` },
      { role: 'system', content: 'Do not use the following as scopes: scripts, automation' },
      { role: 'system', content: 'Anything in ./scripts falls into CI/CD' },
      { role: 'system', content: 'There can only be one scope' },
      { role: 'user', content: 'Please generate a commit message with both a subject and a body based on these changes.' }
    ],
    temperature: 0.7
  };

  logger.info('Payload created');

  try {
    logger.info('Sending payload to OpenAI API...');
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const reply = response.data.choices[0].message.content.replace(/^"(.+)"$/, '$1');
    if (!reply.includes(':')) {
      logger.warn('No valid type or scope detected in the response. Adding default "chore(ci/cd)".');
      return `chore(ci/cd): ${reply}`;
    }

    logger.info(`Commit message generated: ${reply}`);
    return reply;
  } catch (error) {
    logger.error('Failed to make the request to OpenAI API.');
    process.exit(1);
  }
};

// Function to verify commit message
const run_loop = true
const verifyCommitMessage = async () => {
  while (run_loop) {
    const commitMessage = await makeRequest();
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
const commitAndPush = async (commitMessage) => {
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
