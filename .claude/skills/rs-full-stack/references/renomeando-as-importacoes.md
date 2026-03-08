---
name: rs-full-stack-renomeando-as-importacoes
description: "Applies JavaScript import renaming with 'as' keyword when writing ES module imports. Use when user asks to 'import a module', 'fix naming conflict', 'rename import', 'organize imports', or 'resolve duplicate names'. Ensures correct use of 'import { x as y }' syntax to avoid identifier conflicts. Make sure to use this skill whenever generating code with ES module imports that could conflict with local names. Not for export renaming, CommonJS require, or TypeScript type imports."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: es-modules
  tags: [javascript, es-modules, import, renaming, naming-conflict]
---

# Renomeando Importações em JavaScript

> Ao importar modulos, renomeie com `as` sempre que o nome importado conflitar com identificadores locais existentes.

## Rules

1. **Use `as` para renomear na importacao** — `import { sum as s } from './math'` nao crie variaveis intermediarias, porque o `as` e o mecanismo nativo do ES Modules para isso
2. **Renomeie apenas quando ha conflito real** — se nao existe nome local igual, mantenha o nome original, porque renomear sem motivo reduz legibilidade
3. **Prefira nomes descritivos ao renomear** — `import { multiply as externalMultiply }` nao `import { multiply as m }`, porque abreviacoes de uma letra dificultam a leitura (exceto em scripts muito curtos)
4. **Nunca redeclare um identificador ja importado** — se `multiply` ja foi importado, nao crie `function multiply()` local, porque o JS lanca erro de identificador duplicado

## How to write

### Importacao com renomeacao

```javascript
// Renomear para evitar conflito com funcao local
import { multiply as externalMultiply } from './math.js'

function multiply(a, b) {
  console.log(a, b)
  return externalMultiply(a, b)
}
```

### Multiplas renomeacoes

```javascript
import { sum as add, multiply as mult } from './math.js'

console.log(add(1, 2))
console.log(mult(3, 4))
```

## Example

**Before (conflito de nomes — erro):**

```javascript
import { multiply } from './math.js'

// ERRO: multiply ja foi declarado
function multiply(a, b) {
  console.log(a, b)
}
```

**After (com renomeacao):**

```javascript
import { multiply as externalMultiply } from './math.js'

function multiply(a, b) {
  console.log(a, b)
  return externalMultiply(a, b)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nome importado igual a funcao local | Renomear import com `as` |
| Dois modulos exportam mesmo nome | Renomear um ou ambos com `as` |
| Nome importado e unico no escopo | Manter nome original |
| Script curto e descartavel | Abreviacoes como `s`, `m` sao aceitaveis |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { x } from './m'; const y = x` | `import { x as y } from './m'` |
| Dois `import` do mesmo nome sem `as` | Renomear um deles com `as` |
| `const multiply = require('./math').multiply` quando ja tem `multiply` local | `const externalMultiply = require('./math').multiply` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| "Identifier has already been declared" | Import com mesmo nome de variavel/funcao local | Renomeie o import com `as`: `import { x as aliasX }` |
| Import renomeado nao funciona | Nome original usado em vez do alias | Use o nome do alias (apos `as`) no codigo |
| Dois modulos exportam mesmo nome | Conflito de nomes entre modulos | Renomeie um ou ambos com `as` no import |
| Autocomplete mostra nome original | Editor usa o nome exportado, nao o alias | O alias so vale no arquivo que importa; isso e comportamento esperado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-renomeando-as-importacoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-renomeando-as-importacoes/references/code-examples.md)
