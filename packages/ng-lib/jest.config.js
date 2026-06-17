module.exports = {
  passWithNoTests: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@smithy|rxjs|@testing-library|marked)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/packages/ng-lib/jest.setup.ts'],
  moduleNameMapper: {
    '^@m2s2/models$': '<rootDir>/packages/models/src/index.ts',
    '^@m2s2/utils$': '<rootDir>/packages/utils/src/index.ts',
    '^@m2s2/utils/testing$': '<rootDir>/packages/utils/src/testing.ts',
  },
};
