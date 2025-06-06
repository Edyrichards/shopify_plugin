export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/client/**/__tests__/**/*.test.jsx'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.jsx']
};
