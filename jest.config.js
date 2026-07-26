/**
 * Jest configuration.
 *
 * Sources use explicit `.js` extensions in relative imports so that the ES
 * module build works under Node. ts-jest compiles to CommonJS, so those
 * specifiers are mapped back to their extensionless form here.
 *
 * @type {import("jest").Config}
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          isolatedModules: false,
          noUnusedLocals: false,
          noUnusedParameters: false,
        },
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/_generated.ts"],
  clearMocks: true,
  restoreMocks: true,
};
