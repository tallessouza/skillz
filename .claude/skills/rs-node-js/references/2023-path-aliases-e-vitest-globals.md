---
name: rs-node-js-2023-path-aliases-vitest-globals
description: "Applies TypeScript path aliases and Vitest globals configuration when setting up a Node.js project with Vitest. Use when user asks to 'configure path aliases', 'setup vitest', 'remove vitest imports', 'configure tsconfig paths', or 'setup test globals'. Ensures correct tsconfig.json paths, vite-tsconfig-paths plugin, and Vitest globals. Make sure to use this skill whenever configuring a new TypeScript project with Vitest or fixing relative import paths. Not for Jest configuration, Webpack aliases, or runtime module resolution."
---

# Path Aliases e Vitest Globals

> Configurar path aliases no TypeScript e globals no Vitest para eliminar importacoes relativas e imports repetitivos de funcoes de teste.

## Rules

1. **Configure baseUrl e paths no tsconfig.json** — `"@/*": ["./src/*"]`, porque caminhos relativos como `../../entities` ficam impossiveis de manter em projetos com estrutura de pastas complexa
2. **Instale vite-tsconfig-paths como plugin do Vitest** — porque o Vitest nao resolve path aliases do tsconfig automaticamente
3. **Ative globals: true no vitest** — porque importar `expect`, `test`, `describe` em cada arquivo de teste e ruido desnecessario
4. **Adicione vitest/globals em tsconfig types** — porque sem isso o TypeScript nao reconhece as funcoes globais e mostra erro de tipo
5. **Substitua todos os caminhos relativos por @/** — `@/domain/entities/Entity` nao `../../domain/entities/Entity`, porque o alias e greppable e independente da profundidade do arquivo

## How to write

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals"]
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
  },
})
```

### Imports nos testes (com globals ativo)

```typescript
// Nao precisa importar nada do vitest
describe('MyEntity', () => {
  it('should do something', () => {
    expect(true).toBe(true)
  })
})
```

## Example

**Before:**
```typescript
import { expect, test, describe } from 'vitest'
import { Entity } from '../../domain/entities/entity'
import { ValueObject } from '../../../core/value-object'
```

**After (com path aliases + globals):**
```typescript
import { Entity } from '@/domain/entities/entity'
import { ValueObject } from '@/core/value-object'

describe('Entity', () => {
  it('should create', () => {
    const entity = new Entity()
    expect(entity).toBeTruthy()
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto TypeScript + Vitest | Configurar aliases e globals desde o inicio |
| Import com mais de 2 niveis relativos (`../../`) | Substituir por `@/` |
| Arquivo de teste importa `expect`, `test`, `describe` | Remover imports, ativar globals |
| Vitest nao resolve `@/` | Verificar se `vite-tsconfig-paths` esta nos plugins |
| TypeScript reclama de `expect` sem import | Verificar `"types": ["vitest/globals"]` no tsconfig |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { expect, test } from 'vitest'` (com globals ativo) | Usar diretamente, sem import |
| `import { X } from '../../../src/domain/X'` | `import { X } from '@/domain/X'` |
| `vite.config.js` sem tsconfigPaths plugin | Sempre incluir `tsconfigPaths()` nos plugins |
| `globals: true` sem `types: ["vitest/globals"]` | Configurar ambos juntos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-path-aliases-e-vitest-globals/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-path-aliases-e-vitest-globals/references/code-examples.md)
