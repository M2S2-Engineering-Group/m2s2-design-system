const pkgRoot = 'packages/tokens';

const commitAnalyzer = ['@semantic-release/commit-analyzer', {
  preset: 'angular',
  releaseRules: [
    { type: 'feat',     release: 'minor' },
    { type: 'fix',      release: 'patch' },
    { type: 'perf',     release: 'patch' },
    { type: 'refactor', release: 'patch' },
    { breaking: true,   release: 'major' },
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
  changelogFile: 'packages/tokens/CHANGELOG.md',
  changelogTitle: '# @m2s2/tokens Changelog\n\nAll notable changes to the design token system are documented here.\n\nBreaking changes are marked with ⚠️. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).',
}];

const npm = ['@semantic-release/npm', { pkgRoot, npmPublish: true }];

const git = ['@semantic-release/git', {
  assets: [
    'packages/tokens/CHANGELOG.md',
    'packages/tokens/package.json',
  ],
  message: 'chore(release): @m2s2/tokens v${nextRelease.version} [skip ci]',
}];

module.exports = {
  branches: ['main'],
  tagFormat: 'tokens-v${version}',

  verifyConditions:  [changelog, npm, git, '@semantic-release/github'],
  analyzeCommits:    [commitAnalyzer],
  generateNotes:     [releaseNotesGenerator],
  prepare:           [changelog, npm, git],
  publish:           [npm, '@semantic-release/github'],
  addChannel:        [npm, '@semantic-release/github'],
  success:           ['@semantic-release/github'],
  fail:              ['@semantic-release/github'],
};
