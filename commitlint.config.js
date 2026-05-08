module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature → minor bump
        'fix',      // bug fix → patch bump
        'docs',     // documentation only
        'style',    // formatting, no logic change
        'refactor', // neither fix nor feature
        'perf',     // performance improvement → patch bump
        'test',     // adding or updating tests
        'chore',    // build process, tooling
        'revert',   // reverts a previous commit
        'ci',       // CI/CD changes
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
