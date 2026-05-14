module.exports = {
  passWithNoTests: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@smithy|rxjs|@testing-library)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/packages/ng-lib/jest.setup.ts'],
  moduleNameMapper: {
    '^@m2s2/models$': '<rootDir>/packages/models/src/index.ts',
  },
};
