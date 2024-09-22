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

export const Types = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'test',
  'chore',
  'revert',
]

export async function getConfig() {
  return {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        Types, // Corrected the variable name from `types` to `Types`
      ],
      'scope-enum': [
        2,
        'always',
        Scopes, // Corrected the variable name from `scopes` to `Scopes`
      ],
    },
    prompt: {
      settings: {
        enableMultipleScopes: true,
        ScopeEnumSeparator: ',', // Fixed key casing: removed quotes from key names
      },
    },
  }
}

// Use ES6 export syntax to export the function
export default getConfig
