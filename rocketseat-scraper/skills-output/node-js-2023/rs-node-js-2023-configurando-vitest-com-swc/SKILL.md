---
name: rs-node-js-2023-configurando-vitest-swc
description: "Applies Vitest with SWC configuration when setting up tests in NestJS projects. Use when user asks to 'configure vitest', 'setup tests in nestjs', 'add e2e tests', 'configure swc', or 'setup test environment for nest'. Covers SWC compiler for decorator support, tsconfig paths, e2e test separation, and proper TypeScript target. Make sure to use this skill whenever configuring test infrastructure in NestJS applications. Not for writing actual test logic, React testing, or Jest configuration."
---

# Configurando Vitest com SWC no NestJS

> Configurar Vitest com SWC como compilador porque SWC entende decorators do NestJS, enquanto o ESBuild padrao do Vitest nao entende.

## Rules

1. **Use SWC ao inves de ESBuild** — o ESBuild padrao do Vitest nao suporta decorators do NestJS, SWC (feito em Rust) suporta e tem velocidade comparavel
2. **Separe configs de teste unitario e e2e** — `vitest.config.ts` para unitarios, `vitest.config.e2e.ts` para end-to-end, porque possuem escopos e includes diferentes
3. **Use tsconfig paths nos testes** — instale `vite-tsconfig-paths` e adicione como plugin para que imports com `@/` funcionem nos testes
4. **Configure globals: true com types** — quando usar `globals: true` no Vitest, adicione `"vitest/globals"` no array `types` do tsconfig para evitar erros de tipo
5. **Use target correto no tsconfig** — consulte o NodeTargetMapping do TypeScript Wiki para a versao LTS do Node (Node 18 = ES2022), e escreva em minuscula (`es2022`, nao `ES2022`)
6. **Extensao e2e padrao: `.e2e-spec.ts`** — testes end-to-end usam essa extensao para serem filtrados pelo include da config e2e

## How to write

### vitest.config.ts (base)

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

### vitest.config.e2e.ts

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

### tsconfig.json (ajustes necessarios)

```json
{
  "compilerOptions": {
    "target": "es2022",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals"]
  }
}
```

### package.json scripts

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

## Example

**Before (imports feios sem path alias):**
```typescript
import { PrismaService } from '../../../src/prisma/prisma.service'
import { AppModule } from '../../../src/app.module'
```

**After (com tsconfig paths configurado):**
```typescript
import { PrismaService } from '@/prisma/prisma.service'
import { AppModule } from '@/app.module'
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto NestJS com decorators | SWC obrigatorio, ESBuild nao funciona |
| Node 18 LTS | target `es2022` no tsconfig |
| Node 20 LTS | target `es2023` no tsconfig |
| Teste e2e | Arquivo com extensao `.e2e-spec.ts` |
| Teste unitario | Arquivo com extensao `.spec.ts` |
| `globals: true` no vitest | Adicionar `"vitest/globals"` em types do tsconfig |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `"target": "ES2022"` (maiuscula) | `"target": "es2022"` (minuscula) |
| Config unica para unit + e2e | Configs separadas: `vitest.config.ts` e `vitest.config.e2e.ts` |
| `import { describe, it, expect } from 'vitest'` com globals | Apenas use direto, globals ja expoe |
| ESBuild padrao com decorators NestJS | SWC via `unplugin-swc` |
| `@vitest/coverage-c8` (deprecado) | `@vitest/coverage-v8` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
