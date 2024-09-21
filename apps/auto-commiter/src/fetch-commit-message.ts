import { Logger } from '@helix/logger';
import { execSync } from 'child_process';
import axios  from 'axios';

const logger = new Logger({
  serviceName: 'auto-commiter',
  fluentd: {
    enabled: false,
  },
});

export async function FetchCommitMessage() {
  const Scopes = [
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

  const Types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']

  // API Configuration
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const MODEL = 'gpt-4o';

  // Make API request to OpenAI
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
}
