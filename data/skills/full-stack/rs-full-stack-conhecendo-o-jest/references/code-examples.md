# Code Examples: Conhecendo o Jest

## Setup completo — JavaScript

```bash
# 1. Instalar
npm install -D jest

# 2. Adicionar script
# package.json -> "test": "jest"

# 3. Criar primeiro teste
mkdir -p src
```

```javascript
// src/sum.js
function sum(a, b) {
  return a + b
}
module.exports = { sum }
```

```javascript
// src/sum.test.js
const { sum } = require('./sum')

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })
})
```

```bash
# 4. Rodar
npm test
```

## Setup completo — TypeScript

```bash
# 1. Instalar
npm install -D jest @types/jest ts-jest

# 2. Gerar config
npx ts-jest config:init
```

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
}
```

```typescript
// src/sum.ts
export function sum(a: number, b: number): number {
  return a + b
}
```

```typescript
// src/sum.spec.ts
import { sum } from './sum'

describe('sum', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(sum(-3, 3)).toBe(0)
  })
})
```

## Variacoes de jest.config.ts

### Minima

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
}
```

### Com paths e coverage

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/*.spec.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### Com path aliases (tsconfig paths)

```typescript
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}
```

## Scripts uteis no package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose",
    "test:ci": "jest --ci --coverage --forceExit"
  }
}
```

## Estrutura de pastas recomendada

```
src/
├── modules/
│   ├── users/
│   │   ├── users.service.ts
│   │   ├── users.service.spec.ts    # teste ao lado do codigo
│   │   ├── users.controller.ts
│   │   └── users.controller.spec.ts
│   └── orders/
│       ├── orders.service.ts
│       └── orders.service.spec.ts
├── utils/
│   ├── sum.ts
│   └── sum.spec.ts
└── app.ts
```