export default {
    transform: {
        '^.+\\.js$': 'babel-jest',  // Use babel-jest to transpile .js files
    },
    testEnvironment: 'jsdom',     // Use jsdom for DOM manipulation tests
    testMatch: ['<rootDir>/tests/**/*.js']
};
