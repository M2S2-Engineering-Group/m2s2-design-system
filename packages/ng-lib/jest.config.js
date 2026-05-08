module.exports = {
  passWithNoTests: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@smithy|rxjs)/)',
  ],
};
