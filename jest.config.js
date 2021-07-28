module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  projects: [
    '<rootDir>/packages/**/jest.config.js',
  ],
  testMatch: [
    '*.(test|spec).[jt]s',
  ],
};
