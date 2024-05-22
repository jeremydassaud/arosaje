import type { Config } from '@jest/types';
import nextJest from 'next/jest.js';

console.log("Jest config is being used");
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config.InitialOptions = {
  coverageProvider: 'babel',
  testEnvironment: 'jsdom',
};

module.exports = {
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
  ],

  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '@next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
    'next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
    'server-only': `<rootDir>/__mocks__/empty.js`,
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
export default createJestConfig(config);