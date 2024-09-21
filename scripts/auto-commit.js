const { execSync } = require('child_process');
const fs = require('fs');
const axios = require('axios');

// Define color codes
const BLUE = '\x1b[1;34m';
const ORANGE = '\x1b[0;33m';
const RED = '\x1b[1;31m';
const BOLD_RED = '\x1b[1;31m\x1b[1m';
const RESET = '\x1b[0m';

const logInfo = (message) => console.log(`${BLUE}INFO:${RESET} ${message}`);
const logWarn = (message) => console.log(`${ORANGE}WARN:${RESET} ${message}`);
const logError = (message) => console.log(`${BOLD_RED}ERROR:${RESET} ${message}`);

// Cleanup on exit (handles INT and TERM signals)
const cleanup = () => {
  logInfo('Script interrupted. Cleaning up...');
  if (fs.existsSync('/tmp/auto-commit.lock')) {
    fs.unlinkSync('/tmp/auto-commit.lock');
  }
  process.exit(1);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORG_ID = 'org-wlCKckgkuIxvlsdhXmzeWzkS';
const OPENAI_PROJECT_ID = 'proj_SPeb8ul5y6WNrRw0Ri7SJE0h';
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4';

// Commitlint config file
const COMMITLINT_CONFIG = '../.commitlintrc.js';

// Get types and scopes from commitlint config
const getTypesAndScopes = () => {
  try {
    const config = fs.readFileSync(COMMITLINT_CONFIG, 'utf8');
    const types = config.match(/type-enum.*?\[(.*?)\]/)[1].replace(/['"\n]/g, '').split(',').map(item => item.trim());
    const scopes = config.match(/scope-enum.*?\[(.*?)\]/)[1].replace(/['"\n]/g, '').split(',').map(item => item.trim());
    logInfo(`Valid Scopes: ${scopes.join(', ')}`);
    logInfo(`Valid Types: ${types.join(', ')}`);
    return { types, scopes };
  } catch (error) {
    logError('Error reading commitlint config');
    process.exit(1);
  }
};

// Make API request to OpenAI
const makeRequest = async () => {
  logInfo('Preparing payload for OpenAI API request...');

  // Get the list of changed files
  const changedFiles = execSync('git diff --name-only HEAD').toString().trim();
  const fileDiffs = execSync('git diff HEAD').toString();

  if (!changedFiles) {
    logWarn('No files have changed.');
    return null;
  }

  const escapedChangedFiles = JSON.stringify(changedFiles).replace(/\n/g, '\\n');

  const { types, scopes } = getTypesAndScopes();

  const payload = {
    model: MODEL,
    messages: [
      { role: 'system', content: 'Your job is to create commit messages following commit lint rules.' },
      { role: 'system', content: `Commitlint types: ${types.join(', ')}` },
      { role: 'system', content: `Commitlint scopes: ${scopes.join(', ')}` },
      { role: 'system', content: `Here are the file names that have been modified:\n${escapedChangedFiles}` },
      { role: 'system', content: 'Do not use the following as scopes: scripts, automation' },
      { role: 'system', content: 'Anything in ./scripts falls into CI/CD' },
      { role: 'system', content: 'There can only be one scope' },
      { role: 'user', content: 'Please generate a commit message with both a subject and a body based on these changes.' }
    ],
    temperature: 0.7
  };

  logInfo('Payload created');

  try {
    logInfo('Sending payload to OpenAI API...');
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const reply = response.data.choices[0].message.content.replace(/^"(.+)"$/, '$1');
    if (!reply.includes(':')) {
      logWarn('No valid type or scope detected in the response. Adding default "chore(ci/cd)".');
      return `chore(ci/cd): ${reply}`;
    }

    logInfo(`Commit message generated: ${reply}`);
    return reply;
  } catch (error) {
    logError('Failed to make the request to OpenAI API.');
    process.exit(1);
  }
};

// Function to verify commit message
const verifyCommitMessage = async () => {
  while (true) {
    const commitMessage = await makeRequest();
    if (!commitMessage) continue;

    try {
      logInfo(`Verifying commit message: ${commitMessage}`);
      execSync(`echo "${commitMessage}" | npx commitlint`);
      logInfo('Commit message passed commitlint check.');
      return commitMessage;
    } catch {
      logWarn(`Commitlint check failed with message: ${commitMessage}. Retrying...`);
    }
  }
};

// Function to commit and push changes
const commitAndPush = async (commitMessage) => {
  try {
    logInfo('Committing changes...');
    execSync('git add .');
    execSync(`git commit -m "${commitMessage}"`);
    execSync('git push');
    logInfo('Changes pushed successfully.');
  } catch {
    logError('Failed to commit or push changes.');
    process.exit(1);
  }
};

// Main function
const main = async () => {
  if (fs.existsSync('/tmp/auto-commit.lock')) {
    logWarn('Script is already running. Exiting to prevent multiple instances.');
    process.exit(1);
  }

  // Create a lock file
  fs.writeFileSync('/tmp/auto-commit.lock', '');

  while (true) {
    const commitMessage = await verifyCommitMessage();
    await commitAndPush(commitMessage);

    logInfo('Waiting for 5 minutes before checking again...');
    await new Promise(resolve => setTimeout(resolve, 300000)); // Wait for 5 minutes
  }
};

main().finally(() => {
  if (fs.existsSync('/tmp/auto-commit.lock')) {
    fs.unlinkSync('/tmp/auto-commit.lock');
  }
});
