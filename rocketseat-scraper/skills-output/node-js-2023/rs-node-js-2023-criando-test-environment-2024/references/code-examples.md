# Code Examples: Criando Test Environment

## 1. Dependencias necessarias

### Remover pacote obsoleto
```bash
npm uninstall @vitest/coverage-c8
```

### Instalar/atualizar dependencias
```bash
npm i -D vitest@latest vite-tsconfig-paths@latest @vitest/ui@latest @vitest/coverage-v8@latest vite tsx@latest
```

Pacotes:
- `vitest@latest` — framework de testes (v3+)
- `vite` — bundler, agora precisa ser instalado separadamente
- `vite-tsconfig-paths` — resolve paths do tsconfig nos testes
- `@vitest/ui` — interface visual para testes
- `@vitest/coverage-v8` — coverage com engine V8 (substitui c8)
- `tsx@latest` — atualizar para evitar conflito de versoes com vite

## 2. Arquivo completo: prisma-test-environment.ts

```typescript
// prisma/vitest-environment-prisma/prisma-test-environment.ts
import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/environments'
import { prisma } from '@/lib/prisma'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    console.log(databaseURL) // debug: ver URL com schema isolado

    execSync('npx prisma db push')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
```

## 3. Arquivo completo: vite.config.mjs

```javascript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/use-cases/**/*.spec.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/*.spec.ts'],
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
})
```

### Nota sobre `workspace` vs `projects`
```javascript
// DEPRECIADO (Vitest < 3.2.0):
test: {
  workspace: [...]
}

// CORRETO (Vitest >= 3.2.0):
test: {
  projects: [...]
}
```

## 4. Scripts do package.json

```json
{
  "scripts": {
    "test": "vitest run --project unit",
    "test:watch": "vitest --project unit",
    "test:e2e": "vitest run --project e2e",
    "test:e2e:watch": "vitest --project e2e"
  }
}
```

- `--project unit`: executa apenas testes do workspace "unit" (use-cases)
- `--project e2e`: executa apenas testes do workspace "e2e" (controllers) com o prisma environment

## 5. Estrutura de pastas

```
projeto/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── vitest-environment-prisma/
│       └── prisma-test-environment.ts   # Custom environment
├── src/
│   ├── use-cases/                       # Testes unitarios (--project unit)
│   │   └── register.spec.ts
│   ├── http/
│   │   └── controllers/                 # Testes e2e (--project e2e)
│   │       └── register.spec.ts
│   └── lib/
│       └── prisma.ts                    # Prisma client singleton
└── vite.config.mjs                      # Config com projects
```

## 6. Fluxo de execucao dos testes e2e

```
npm run test:e2e
  │
  ├── Vitest carrega project "e2e"
  ├── Detecta environment customizado
  │
  ├── SETUP:
  │   ├── randomUUID() → "a1b2c3d4-..."
  │   ├── DATABASE_URL + ?schema=a1b2c3d4-...
  │   ├── process.env.DATABASE_URL = nova URL
  │   └── execSync('npx prisma db push')
  │       └── Cria tabelas no schema isolado
  │
  ├── EXECUTA TESTES
  │   └── Todos os testes usam o schema isolado
  │
  └── TEARDOWN:
      ├── DROP SCHEMA IF EXISTS "a1b2c3d4-..." CASCADE
      └── prisma.$disconnect()
```

## 7. Manipulacao da URL com construtor URL

```typescript
// Entrada:
const original = 'postgresql://docker:docker@localhost:5432/apisolid?schema=public'

// Manipulacao:
const url = new URL(original)
url.searchParams.set('schema', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')

// Saida:
url.toString()
// → 'postgresql://docker:docker@localhost:5432/apisolid?schema=a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```

## 8. O CASCADE no DROP SCHEMA

```sql
-- Sem CASCADE: falha se existem tabelas com foreign keys
DROP SCHEMA IF EXISTS "uuid";
-- ERROR: cannot drop schema because other objects depend on it

-- Com CASCADE: remove tudo na ordem correta
DROP SCHEMA IF EXISTS "uuid" CASCADE;
-- OK: dropa tabelas, indices, constraints, tudo
```