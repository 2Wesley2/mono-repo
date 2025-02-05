export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/'],
};
