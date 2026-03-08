---
name: rs-node-js-2023-criando-aliases-de-importacao
description: "Configures TypeScript path aliases with @ prefix for cleaner imports in Node.js projects. Use when user asks to 'setup path aliases', 'configure tsconfig paths', 'fix import paths', 'organize imports', or starts a new TypeScript/Node.js project. Applies baseUrl and paths in tsconfig.json, maps @/ to src/. Make sure to use this skill whenever setting up a new TypeScript project or when imports have deep relative paths. Not for JavaScript-only projects without TypeScript, nor for module bundler alias config (webpack/vite)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: api-solid
  tags: [typescript, path-aliases, tsconfig, imports]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Aliases de Importação com TypeScript

> Configure `@/` como atalho para `src/` no tsconfig.json para eliminar caminhos relativos profundos.

## Rules

1. **Sempre configure baseUrl** — necessario para habilitar `paths`, use `"."` como valor padrao porque referencia a raiz do projeto
2. **Use `@/` como prefixo padrao** — mapeia para `./src/*`, porque e convencao amplamente reconhecida e o autocomplete do VS Code funciona automaticamente
3. **Use alias apenas para caminhos profundos** — se o arquivo esta no mesmo diretorio ou proximo, `./` ou `../` e mais curto e claro, porque alias em imports curtos adiciona ruido sem beneficio
4. **Configure tambem para testes** — Vitest/Jest precisam de configuracao separada para resolver os mesmos aliases, porque o runner de testes nao le tsconfig paths por padrao

## How to write

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Import com alias (caminhos profundos)

```typescript
// Arquivo em src/modules/users/repositories/prisma/prisma-users-repository.ts
import { env } from '@/env'
import { prisma } from '@/lib/prisma'
```

### Import relativo (caminhos proximos)

```typescript
// Arquivo em src/modules/users/use-cases/create-user.ts
// O repository esta proximo — use relativo
import { UsersRepository } from '../repositories/users-repository'
```

## Example

**Before (caminhos relativos profundos):**
```typescript
// src/modules/billing/workers/process/handler.ts
import { env } from '../../../../env'
import { prisma } from '../../../../lib/prisma'
import { logger } from '../../../../utils/logger'
```

**After (com alias):**
```typescript
// src/modules/billing/workers/process/handler.ts
import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { logger } from '@/utils/logger'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo esta 3+ niveis acima do diretorio atual | Use `@/` |
| Arquivo esta no mesmo diretorio | Use `./` |
| Arquivo esta 1 nivel acima | Use `../` — mais curto que alias |
| Configurando Vitest | Adicione `resolve.alias` no `vite.config.ts` |
| Usando tsx/ts-node como runner | Funciona automaticamente com tsconfig paths |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `import { env } from '../../../../env'` | `import { env } from '@/env'` |
| Usar `@/` para arquivo no mesmo diretorio | Usar `./filename` |
| Esquecer baseUrl no tsconfig | Sempre definir `"baseUrl": "."` |
| Configurar paths sem testar no runner de testes | Configurar alias tambem no Vitest/Jest |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-criando-aliases-de-importacao/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-criando-aliases-de-importacao/references/code-examples.md) — Todos os exemplos de código expandidos com variações
