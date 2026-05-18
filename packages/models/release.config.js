const commitAnalyzer = ['@semantic-release/commit-analyzer', {
  preset: 'angular',
  releaseRules: [
    { type: 'feat',     scope: 'models', release: 'minor' },
    { type: 'fix',      scope: 'models', release: 'patch' },
    { type: 'perf',     scope: 'models', release: 'patch' },
    { type: 'refactor', scope: 'models', release: 'patch' },
    { breaking: true,   scope: 'models', release: 'major' },
  ],
}];

const releaseNotesGenerator = ['@semantic-release/release-notes-generator', {
  preset: 'angular',
  writerOpts: {
    groupBy: 'type',
    commitGroupsSort: ['feat', 'fix', 'perf', 'refactor'],
    commitsSort: ['scope', 'subject'],
  },
}];

const changelog = ['@semantic-release/changelog', {
  changelogFile: 'CHANGELOG.md',
  changelogTitle: '# @m2s2/models Changelog\n\nAll notable changes to the shared model interfaces are documented here.\n\nBreaking changes are marked with ⚠️. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).',
}];

const npm = ['@semantic-release/npm', { pkgRoot: '.', npmPublish: true }];

const git = ['@semantic-release/git', {
  assets: ['CHANGELOG.md', 'package.json'],
  message: 'chore(release): @m2s2/models v${nextRelease.version} [skip ci]',
}];

module.exports = {
  branches: ['main'],
  tagFormat: 'models-v${version}',

  verifyConditions:  [changelog, npm, git, '@semantic-release/github'],
  analyzeCommits:    [commitAnalyzer],
  generateNotes:     [releaseNotesGenerator],
  prepare:           [changelog, npm, git],
  publish:           [npm, '@semantic-release/github'],
  addChannel:        [npm, '@semantic-release/github'],
  success:           ['@semantic-release/github'],
  fail:              ['@semantic-release/github'],
};
