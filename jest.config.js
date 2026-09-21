module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
 }
};
