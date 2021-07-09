import type {Config} from '@jest/types';
import {pathsToModuleNameMapper} from 'ts-jest/utils';

import {compilerOptions} from '../tsconfig.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testTimeout: 30000,
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: ['<rootDir>/src/**/test/large/*.test.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverage: true,
  coverageDirectory: './coverage/large',
  coveragePathIgnorePatterns: ['.entities.ts'],
  reporters: ['default', ['jest-junit', {outputDirectory: 'coverage/large'}]],
};
export default config;
