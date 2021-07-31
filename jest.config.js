module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  projects: [
    '<rootDir>/packages/**/jest.config.js',
    '<rootDir>/services/**/jest.config.js',
  ],
  testMatch: [
    '*.(test|spec).[jt]s',
  ],
};
