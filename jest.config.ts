module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    testEnvironment: "node",
    globals: {},
    transformIgnorePatterns: ["/node_modules/(?!MODULE_NAME_HERE).+\\.js$"],
};
