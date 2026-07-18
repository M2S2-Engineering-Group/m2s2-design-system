# @m2s2/models Changelog

All notable changes to the shared model interfaces are documented here.

Breaking changes are marked with ⚠️. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

## @m2s2/models [2.5.1](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.5.0...@m2s2/models@2.5.1) (2026-07-18)


### Bug Fixes

* added the ability to infer series total if not provided ([86300dc](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/86300dc62c36a1b09f85ba2dd3b566e58cfd3976))

# @m2s2/models [2.5.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.4.1...@m2s2/models@2.5.0) (2026-07-05)


### Features

* adding charting features ([66f93df](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/66f93df8c9b83a4db60f448a56b30abb0f37d56d))

## @m2s2/models [2.4.1](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.4.0...@m2s2/models@2.4.1) (2026-06-17)


### Bug Fixes

* added eslint and fixed linting issues, added precommit hooks ([0b4877c](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/0b4877c5e26d3081c9488eae0b90b114bc13d2ae))

# @m2s2/models [2.4.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.3.0...@m2s2/models@2.4.0) (2026-06-15)


### Features

* add series handling to blog editor and tests ([905916f](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/905916f903242e746e7b8fdbe4d56894b0f5e96a))

# @m2s2/models [2.3.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.2.0...@m2s2/models@2.3.0) (2026-06-05)


### Features

* adding blog editor ([fa7c69c](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/fa7c69caf3d5fecd1226d8c982709bdfb9852a1c))

# @m2s2/models [2.2.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.1.0...@m2s2/models@2.2.0) (2026-06-03)


### Features

* adding chat component for all libs and update font families ([cf61b05](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/cf61b0560280fd07e27b5de66db9472f5281a3c2))

# @m2s2/models [2.1.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/@m2s2/models@2.0.0...@m2s2/models@2.1.0) (2026-05-29)


### Features

* adding options to the footer ([a9c1bda](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/a9c1bdaac4b6da1da912d48ec5c88ff2e851df4c))

# [2.0.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/models-v1.1.1...models-v2.0.0) (2026-05-22)


### Features

* **ng-lib:** replace authservice with m2s2provider interface ([3339d09](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/3339d09e0b3dc6c14b250e691806dc11e64cd98c))
* **ng-lib:** trigger major release for auth provider refactor ([8871ab8](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/8871ab897ca2959cc5016b682c64bb7d3e331323))


### BREAKING CHANGES

* **ng-lib:** AuthService has been removed. Consumers must implement
M2S2AuthProvider and provide it via the M2S2_AUTH_PROVIDER injection
token.
* **ng-lib:** AuthService has been removed. Consumers must implement
  M2S2AuthProvider and provide it via the M2S2_AUTH_PROVIDER injection token.

## [1.1.1](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/models-v1.1.0...models-v1.1.1) (2026-05-20)


### Bug Fixes

* add readmes to each offering ([b1a147a](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/b1a147a16743d43194d1ce4ef6055f81ae7dab4b))

# [1.1.0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/compare/models-v1.0.0...models-v1.1.0) (2026-05-19)


### Bug Fixes

* vue tests and config updates ([2452694](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/2452694caa69dcdb23989499aaf331a7147cea19))


### Features

* vue-lib addition ([5ab9751](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/5ab975144b92c7b80b938ef3ec61f0129860c32a))

# 1.0.0 (2026-05-18)


### Features

* initial commit for lib ([efd950b](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/efd950bb4823f9631d947111b24e3b22bb82f960))
* initial deployment infra ([c1de188](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/c1de18819dccab9f27e252065f39393c9ed1b1df))
* model package, react lib and angular refactor ([1bc5523](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/1bc5523a70e444c5dd134c2fba325279bb295233))
* **react-lib:** initial release of react lib ([fa112d3](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/fa112d355fab9277cb7396a3f87ac1af85d3139f))
* release of models package with component libs ([b3be85a](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/b3be85a3d68f46969f6fa24cdfffffa6d2ff5877))


### Bug Fixes

* add correct peerdeps to design system ([4023d1b](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/4023d1bac6ce9fe6c159a87c79cc897b2d52c740))
* angular chunk fix ([3e3d05f](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/3e3d05f64bb7c0a3c9f2df52f04e627cd72c4166))
* fix component examples ([eacf575](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/eacf5751d63377a5ec670002479ca8b21dff590a))
* trigger ng-lib release ([12cd9f9](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/12cd9f9921c58b721c2e1358cb3b651054725a60))
* update blog card and more testing ([eea2bf0](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/eea2bf01a722a48d1dbe36a70c46e69a8e6c8c3e))
* update tokens peer dep ([aafb83a](https://github.com/M2S2-Engineering-Group/m2s2-design-system/commit/aafb83a002b8fa853e2ad23f9eb4ca8176a75cf5))
