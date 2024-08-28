
const Configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']],
    'scope-enum': [2, 'always', [
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
    ]]
  }
}
