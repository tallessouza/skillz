---
name: rs-full-stack-importando-tudo
description: "Applies JavaScript namespace import pattern (import * as) when writing module imports. Use when user asks to 'import everything', 'import all exports', 'use namespace import', 'import module', or organizes JS/TS modules. Enforces correct syntax: `import * as name from './module.js'` and access via `name.function`. Make sure to use this skill whenever user imports multiple exports from a single module. Not for dynamic imports, CSS/asset imports, or package manager configuration."
---

# Importando Tudo — Namespace Import

> Use `import * as nome` para agrupar todas as exportacoes de um modulo em um unico namespace, acessando via `nome.funcao`.

## Rules

1. **Use `*` para importar tudo** — `import * as calc from './calc.js'`, porque agrupa todas as exportacoes em um objeto unico e facilita o acesso
2. **Use `as` para nomear o namespace** — o nome deve refletir o modulo de origem (`calc`, `utils`, `api`), porque da contexto ao leitor sobre a origem das funcoes
3. **Acesse via ponto** — `calc.sum()`, `calc.multiply()`, porque o namespace substitui a importacao individual
4. **Prefira importacao individual quando usar poucas funcoes** — `import { sum } from './calc.js'` quando so precisa de uma funcao, porque evita carregar o namespace inteiro desnecessariamente
5. **A ordem da importacao individual nao importa** — `{ multiply, sum }` ou `{ sum, multiply }` sao equivalentes, porque o nome resolve a referencia, nao a posicao

## How to write

### Namespace import (importar tudo)

```javascript
import * as calc from './calc.js'

console.log(calc.sum(2, 3))       // 5
console.log(calc.multiply(2, 3))  // 6
```

### Importacao individual (poucas funcoes)

```javascript
import { sum, multiply } from './calc.js'

console.log(sum(2, 3))
console.log(multiply(2, 3))
```

## Example

**Before (mistura confusa):**
```javascript
import { sum } from './calc.js'
import { multiply } from './calc.js'
// duas linhas de import do mesmo modulo
```

**After (namespace import):**
```javascript
import * as calc from './calc.js'

calc.sum(2, 3)
calc.multiply(2, 3)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usa 3+ funcoes do mesmo modulo | `import * as nome` |
| Usa 1-2 funcoes do modulo | `import { func }` individual |
| Quer autocompletar as funcoes disponiveis | `import * as nome` e use `nome.` para ver opcoes |
| Ordem das funcoes importadas importa? | Nao — na importacao individual a ordem e livre |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `import * as calc` e usar so `calc.sum()` | `import { sum } from './calc.js'` |
| Multiplos `import { x } from './mesmo.js'` | Um unico `import * as nome from './mesmo.js'` |
| `import * as c` (nome abreviado) | `import * as calc` (nome descritivo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-importando-tudo/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-importando-tudo/references/code-examples.md)
