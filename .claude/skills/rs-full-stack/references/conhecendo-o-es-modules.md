---
name: rs-full-stack-conhecendo-o-es-modules
description: "Applies ES Modules (ESM) patterns when structuring JavaScript/TypeScript code. Use when user asks to 'organize code', 'split into modules', 'create imports', 'export functions', 'modularize', or 'structure a project'. Enforces proper import/export usage, single-responsibility modules, and code reuse through modularization. Make sure to use this skill whenever creating new files or reorganizing existing code into modules. Not for bundler configuration, CommonJS/require syntax, or package.json setup."
---

# ES Modules (ESM)

> Organize codigo em modulos com responsabilidades bem definidas, exportando funcionalidades para reuso via import/export.

## Rules

1. **Um modulo = uma responsabilidade** — cada arquivo encapsula uma funcionalidade especifica, porque isso permite reutilizar e manter o codigo em um unico lugar
2. **Exporte apenas o necessario** — use `export` somente para o que outros modulos precisam consumir, porque isso define a interface publica do modulo
3. **Importe explicitamente** — use `import` nomeado ao inves de importar tudo, porque facilita rastrear dependencias e permite tree-shaking
4. **Prefira named exports** — `export function calcTotal()` ao inves de `export default`, porque named exports sao mais faceis de buscar e refatorar
5. **Corrija em um lugar, reflita em todos** — a principal vantagem de modularizar e que uma correcao no modulo se propaga para todos os consumidores

## How to write

### Exportando funcionalidades

```typescript
// services/user-service.ts — modulo com responsabilidade unica
export function createUser(name: string, email: string) {
  return { name, email, createdAt: new Date() }
}

export function findUserByEmail(email: string) {
  // busca usuario
}
```

### Importando modulos

```typescript
// pages/register.ts — consome o modulo de usuario
import { createUser } from './services/user-service'

const user = createUser('João', 'joao@email.com')
```

## Example

**Before (codigo sem modularizacao):**

```typescript
// app.ts — tudo em um unico arquivo
function formatDate(date: Date) { return date.toISOString() }
function createUser(name: string) { return { name, createdAt: formatDate(new Date()) } }
function createOrder(userId: string) { return { userId, date: formatDate(new Date()) } }
```

**After (modularizado com ESM):**

```typescript
// utils/date.ts
export function formatDate(date: Date) { return date.toISOString() }

// services/user-service.ts
import { formatDate } from '../utils/date'
export function createUser(name: string) { return { name, createdAt: formatDate(new Date()) } }

// services/order-service.ts
import { formatDate } from '../utils/date'
export function createOrder(userId: string) { return { userId, date: formatDate(new Date()) } }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao usada em 2+ arquivos | Extrair para modulo proprio |
| Arquivo com 200+ linhas | Avaliar separacao por responsabilidade |
| Funcionalidade que pode mudar independente | Modulo separado |
| Utilitario generico (formatDate, parseCSV) | Modulo em `utils/` ou `helpers/` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Copiar funcao entre arquivos | Extrair para modulo e importar |
| `import * as utils from './utils'` | `import { formatDate } from './utils/date'` |
| Arquivo com multiplas responsabilidades misturadas | Um modulo por responsabilidade |
| `export default` para multiplas funcoes | Named exports para cada funcao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre modularizacao, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-es-modules/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-es-modules/references/code-examples.md)
