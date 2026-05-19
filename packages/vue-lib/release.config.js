const commitAnalyzer = ['@semantic-release/commit-analyzer', {
  preset: 'angular',
  releaseRules: [
    { type: 'feat',     scope: 'vue-lib', release: 'minor' },
    { type: 'fix',      scope: 'vue-lib', release: 'patch' },
    { type: 'perf',     scope: 'vue-lib', release: 'patch' },
    { type: 'refactor', scope: 'vue-lib', release: 'patch' },
    { breaking: true,   scope: 'vue-lib', release: 'major' },
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
  changelogTitle: '# @m2s2/vue-lib Changelog\n\nAll notable changes to the Vue component library are documented here.\n\nBreaking changes are marked with ⚠️. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).',
}];

const npm = ['@semantic-release/npm', { pkgRoot: '.', npmPublish: true }];

const git = ['@semantic-release/git', {
  assets: ['CHANGELOG.md', 'package.json'],
  message: 'chore(release): @m2s2/vue-lib v${nextRelease.version} [skip ci]',
}];

module.exports = {
  branches: ['main'],
  tagFormat: 'vue-lib-v${version}',

  verifyConditions:  [changelog, npm, git, '@semantic-release/github'],
  analyzeCommits:    [commitAnalyzer],
  generateNotes:     [releaseNotesGenerator],
  prepare:           [changelog, npm, git],
  publish:           [npm, '@semantic-release/github'],
  addChannel:        [npm, '@semantic-release/github'],
  success:           ['@semantic-release/github'],
  fail:              ['@semantic-release/github'],
};
