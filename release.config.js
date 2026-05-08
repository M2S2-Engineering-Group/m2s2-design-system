module.exports = {
  branches: ['main'],

  tagFormat: 'ng-lib-v${version}',

  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        { type: 'feat',     release: 'minor' },
        { type: 'fix',      release: 'patch' },
        { type: 'perf',     release: 'patch' },
        { type: 'refactor', release: 'patch' },
        { breaking: true,   release: 'major' },
      ],
    }],

    ['@semantic-release/release-notes-generator', {
      preset: 'angular',
      writerOpts: {
        groupBy: 'type',
        commitGroupsSort: ['feat', 'fix', 'perf', 'refactor'],
        commitsSort: ['scope', 'subject'],
      },
    }],

    ['@semantic-release/changelog', {
      changelogFile: 'packages/ng-lib/CHANGELOG.md',
      changelogTitle: '# @m2s2/ng-lib Changelog\n\nAll notable changes to the component library are documented here.\n\nBreaking changes are marked with ⚠️. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).',
    }],

    ['@semantic-release/npm', {
      pkgRoot: 'dist/m2s2-ng-lib',
      npmPublish: true,
    }],

    ['@semantic-release/git', {
      assets: [
        'packages/ng-lib/CHANGELOG.md',
        'packages/ng-lib/package.json',
      ],
      message: 'chore(release): @m2s2/ng-lib v${nextRelease.version} [skip ci]',
    }],

    '@semantic-release/github',
  ],
};
