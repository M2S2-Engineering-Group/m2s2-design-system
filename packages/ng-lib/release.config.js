const commitAnalyzer = ['@semantic-release/commit-analyzer', {
  preset: 'angular',
  releaseRules: [
    { type: 'feat',     scope: 'ng-lib', release: 'minor' },
    { type: 'fix',      scope: 'ng-lib', release: 'patch' },
    { type: 'perf',     scope: 'ng-lib', release: 'patch' },
    { type: 'refactor', scope: 'ng-lib', release: 'patch' },
    { breaking: true,   scope: 'ng-lib', release: 'major' },
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
  changelogTitle: '# @m2s2/ng-lib Changelog\n\nAll notable changes to the Angular component library are documented here.\n\nBreaking changes are marked with ⚠️. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).',
}];

// Bumps packages/ng-lib/package.json so the next build embeds the right version.
const npmSource = ['@semantic-release/npm', { pkgRoot: '.', npmPublish: false }];

// Updates dist/m2s2-ng-lib/package.json and publishes from there.
const npmDist = ['@semantic-release/npm', { pkgRoot: '../../dist/m2s2-ng-lib', npmPublish: true }];

const git = ['@semantic-release/git', {
  assets: ['CHANGELOG.md', 'package.json'],
  message: 'chore(release): @m2s2/ng-lib v${nextRelease.version} [skip ci]',
}];

module.exports = {
  branches: ['main'],

  verifyConditions:  [changelog, npmDist, git, '@semantic-release/github'],
  analyzeCommits:    [commitAnalyzer],
  generateNotes:     [releaseNotesGenerator],
  prepare:           [changelog, npmSource, npmDist, git],
  publish:           [npmDist, '@semantic-release/github'],
  addChannel:        [npmDist, '@semantic-release/github'],
  success:           ['@semantic-release/github'],
  fail:              ['@semantic-release/github'],
};
