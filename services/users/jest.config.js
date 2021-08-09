const { name } = require('./package.json');

module.exports = {
  name,
  displayName: name,
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/src/setup.ts',
  ],
  transform: {
    '\\.[jt]s$': ['babel-jest', { cwd: __dirname }],
  },
};
