const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");

module.exports = {
  ...jestConfig,
  modulePathIgnorePatterns: ["<rootDir>/.localdevserver", "/staticresources"],
  moduleNameMapper: {
    "^lightning/messageService$":
      "<rootDir>/force-app/tests/jest-mocks/lightning/messageService",
    "^lightning/navigation$":
      "<rootDir>/force-app/tests/jest-mocks/lightning/navigation"
  }
};
