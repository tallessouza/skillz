# Code Examples: Configurando o Jest

## Exemplo 1: Configuracao minima para TypeScript + Node

```typescript
// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

## Exemplo 2: Sem path aliases (projeto simples)

```typescript
// jest.config.ts — quando nao usa @ imports
import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
};

export default config;
```

## Exemplo 3: Com cobertura habilitada

```typescript
// jest.config.ts — quando precisa de relatorio de cobertura
import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

## Exemplo 4: Usando convencao .spec.ts

```typescript
// jest.config.ts — se o projeto prefere .spec.ts
import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

## Exemplo 5: tsconfig.json correspondente

```json
// tsconfig.json — o moduleNameMapper do Jest espelha estes paths
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Exemplo 6: package.json com script de teste

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

## Exemplo 7: Inicializacao passo a passo via CLI

```bash
# 1. Instalar dependencias
npm install -D jest ts-jest @types/jest

# 2. Inicializar (opcional — pode criar o arquivo manualmente)
npx jest --init

# 3. Limpar o arquivo gerado e aplicar a configuracao minima

# 4. Verificar que funciona
npx jest --version
```

## Exemplo 8: Estrutura de pastas esperada

```
project/
├── jest.config.ts          # Configuracao do Jest
├── tsconfig.json           # TypeScript config com paths
├── package.json
└── src/
    ├── entities/
    │   ├── User.ts
    │   └── User.test.ts    # Teste junto ao codigo
    ├── use-cases/
    │   ├── CreateUser.ts
    │   └── CreateUser.test.ts
    └── repositories/
        └── UserRepository.ts
```