module.exports = {
  passWithNoTests: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@smithy|rxjs|@testing-library|marked)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@m2s2/models$': '<rootDir>/../models/src/index.ts',
    '^@m2s2/utils$': '<rootDir>/../utils/src/index.ts',
    '^@m2s2/utils/testing$': '<rootDir>/../utils/src/testing.ts',
  },
};
