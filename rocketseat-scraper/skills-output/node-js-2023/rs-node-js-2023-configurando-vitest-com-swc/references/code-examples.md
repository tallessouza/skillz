# Code Examples: Configurando Vitest com SWC no NestJS

## Instalacao completa de dependencias

```bash
pnpm add -D vitest unplugin-swc @swc/core @vitest/coverage-v8 vite-tsconfig-paths
```

Pacotes:
- `vitest` — test runner
- `unplugin-swc` — plugin que integra SWC com Vite/Vitest
- `@swc/core` — o compilador SWC em si
- `@vitest/coverage-v8` — cobertura de testes (antes era c8, agora v8)
- `vite-tsconfig-paths` — resolve aliases do tsconfig no Vite/Vitest

## vitest.config.ts completo

```typescript
import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
```

## vitest.config.e2e.ts completo

```typescript
import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
```

A unica diferenca e o `include` que filtra apenas arquivos `.e2e-spec.ts`.

## tsconfig.json — ajustes necessarios

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals"]
  }
}
```

Pontos importantes:
- `target` em minuscula
- `paths` com alias `@/`
- `types` incluindo `vitest/globals`

## package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:debug": "vitest --inspect-brk --inspect --logHeapUsage --threads=false",
    "test:e2e": "vitest run --config ./vitest.config.e2e.ts",
    "test:e2e:watch": "vitest --config ./vitest.config.e2e.ts"
  }
}
```

- `pnpm run test` — roda testes unitarios (nao pega `.e2e-spec.ts`)
- `pnpm run test:e2e` — roda apenas testes e2e

## Exemplo de teste e2e basico (validacao)

```typescript
// src/controllers/create-account.controller.e2e-spec.ts

// Com globals: true, nao precisa importar describe/test/expect

test('should pass basic validation', () => {
  expect(1 + 1).toBe(2)
})
```

Este teste simples serve para validar que toda a cadeia de configuracao esta funcionando:
- SWC compilando corretamente
- Vitest rodando
- globals funcionando
- tsconfig paths resolvendo

## Convertendo imports existentes para usar path alias

**Antes:**
```typescript
import { PrismaService } from '../prisma/prisma.service'
import { CreateAccountBody } from '../dto/create-account.dto'
import { AuthModule } from '../../auth/auth.module'
```

**Depois:**
```typescript
import { PrismaService } from '@/prisma/prisma.service'
import { CreateAccountBody } from '@/dto/create-account.dto'
import { AuthModule } from '@/auth/auth.module'
```

Para encontrar imports que precisam ser convertidos, busque por imports comecando com `src/` — esses sao os que ficam "estranhos" conforme mencionado pelo instrutor.

## NodeTargetMapping — referencia rapida

| Node Version | Recommended Target |
|-------------|-------------------|
| 16 | es2021 |
| 18 | es2022 |
| 20 | es2023 |

Fonte: https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping

Sempre use a versao LTS que vai rodar em producao para decidir o target.