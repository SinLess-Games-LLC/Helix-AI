export const Scopes = [
  'docs',
  'config',
  'core',
  'components',
  'utils',
  'authentication',
  'frontend',
  'backend',
  'ci\/cd',
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
  ...(await getProjects(
    './apps/*',
    ({ name, projectType }) =>
      !name.includes('e2e') && projectType == 'application',
  )),
  ...(await getProjects(
    './libs/*',
    ({ name, projectType }) =>
      !name.includes('e2e') && projectType == 'library',
  )),
]

export const Types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']

async function getConfig() {
  const {
    default: {
      utils: { getProjects },
    },
  } = await import('@commitlint/config-nx-scopes')

  return {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        types,
      ],
      'scope-enum': [
        2,
        'always',
        scopes,
      ]
    },
    propmt: {
      settings: {
        'enableMultipleScopes': true,
        'ScopeEnumSeparator': ',',
      }
    }
  }
}

module.exports = getConfig()
