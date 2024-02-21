module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
 }
};
