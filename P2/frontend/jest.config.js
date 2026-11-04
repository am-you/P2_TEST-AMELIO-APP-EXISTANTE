
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // Am.Yo : rapport HTML, objectif 80 % sur le code de l'app
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
  ],
  coverageReporters: ['html', 'text-summary'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
};
