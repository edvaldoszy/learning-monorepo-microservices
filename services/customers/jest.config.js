const { name } = require('./package.json');

module.exports = {
  name,
  displayName: name,

  transform: {
    '\\.[jt]s$': ['babel-jest', { cwd: __dirname }],
  },
};
