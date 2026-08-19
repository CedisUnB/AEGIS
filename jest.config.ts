import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Caminho para a pasta raiz do app Next.js
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Mapeia aliases como @/ para a raiz do projeto
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Procura por arquivos .test.ts ou .spec.ts
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

export default createJestConfig(config);