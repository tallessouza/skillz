# Code Examples: Instalando e Configurando o Jest

## Instalacao completa

### Comando de instalacao com versoes fixas
```bash
npm i jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 -D
```

### Verificacao no package.json apos instalacao
```json
{
  "devDependencies": {
    "@types/jest": "29.5.13",
    "jest": "29.7.0",
    "ts-jest": "29.2.5"
  }
}
```

## Arquivo jest.config.ts — Versao da aula

```typescript
import type { Config } from "jest"

const config: Config = {
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
}

export default config
```

## Variacoes do jest.config.ts

### Com paths customizados para testes
```typescript
import type { Config } from "jest"

const config: Config = {
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
}

export default config
```

### Com cobertura de codigo habilitada
```typescript
import type { Config } from "jest"

const config: Config = {
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
}

export default config
```

### Com path aliases do TypeScript
```typescript
import type { Config } from "jest"

const config: Config = {
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}

export default config
```

### Configuracao minima (sem TypeScript)
```javascript
// jest.config.js — para projetos JavaScript puro
/** @type {import('jest').Config} */
const config = {
  bail: true,
  testEnvironment: "node",
}

module.exports = config
```

## Script no package.json

### Basico
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Com watch mode para desenvolvimento
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Com cobertura
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Estrutura de projeto apos configuracao

```
project-root/
├── jest.config.ts
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts
│   ├── routes/
│   │   └── users.ts
│   └── utils/
│       └── format.ts
└── src/
    └── utils/
        └── format.spec.ts    # Teste ao lado do arquivo
```

### Alternativa: pasta de testes separada
```
project-root/
├── jest.config.ts
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts
│   └── utils/
│       └── format.ts
└── tests/
    └── utils/
        └── format.spec.ts    # Testes em pasta separada
```

## Exemplo de teste basico (para verificar que a configuracao funciona)

```typescript
// src/utils/math.spec.ts
describe("Math operations", () => {
  it("should add two numbers", () => {
    const result = 2 + 3
    expect(result).toBe(5)
  })
})
```

### Executar
```bash
npx jest
# ou
npm test
```

### Output esperado
```
 PASS  src/utils/math.spec.ts
  Math operations
    ✓ should add two numbers (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```