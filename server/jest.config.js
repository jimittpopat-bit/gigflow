module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  testTimeout: 30000, // 30 seconds timeout for all tests
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};