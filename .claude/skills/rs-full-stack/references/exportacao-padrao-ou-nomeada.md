---
name: rs-full-stack-exportacao-padrao-ou-nomeada
description: "Enforces correct usage of default and named exports/imports in JavaScript modules. Use when user asks to 'create a module', 'export a function', 'import from file', 'organize modules', or any ES module task. Applies rules: named exports use exact names with braces, default exports import without braces and name is arbitrary, prefer named exports for explicitness. Make sure to use this skill whenever generating JS/TS modules with imports/exports. Not for CommonJS require/module.exports or bundler configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-modules
  tags: [javascript, es-modules, export, import, named-export, default-export]
---

# Exportação Padrão ou Nomeada

> Prefira exportações nomeadas porque forçam o uso do nome real da função, tornando imports rastreáveis por busca no codebase.

## Rules

1. **Exporte na declaração, não no final** — `export function sum()` não `export { sum }` no final, porque mantém export e definição juntos facilitando leitura
2. **Named export = chaves obrigatórias no import** — `import { multiply } from './calc.js'`, porque o nome deve ser exato
3. **Default export = sem chaves, nome livre** — `import qualquerNome from './calc.js'`, porque default fornece a função padrão independente do nome usado
4. **Prefira named exports** — porque o nome é rastreável com grep/find, default permite nomes arbitrários que quebram rastreabilidade
5. **Combine default + named quando necessário** — `import sum, { multiply } from './calc.js'`, default vem primeiro, nomeadas nas chaves
6. **Um módulo tem no máximo um default** — tentar dois `export default` causa erro de sintaxe

## How to write

### Named export (preferido)

```javascript
// calc.js — export junto com a declaração
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

### Import de named exports

```javascript
// index.js — chaves obrigatórias, nome exato
import { sum, multiply } from './calc.js'

console.log(sum(2, 3))
console.log(multiply(2, 3))
```

### Default export

```javascript
// calc.js
export default function sum(a, b) {
  return a + b
}
```

### Import combinado (default + named)

```javascript
import sum, { multiply } from './calc.js'
```

## Example

**Before (confuso, mistura padrões):**
```javascript
// utils.js
function formatDate(d) { /* ... */ }
function parseDate(s) { /* ... */ }
export default formatDate
export { parseDate }

// consumer.js
import fmt, { parseDate } from './utils.js'
// "fmt" não existe no módulo — difícil rastrear origem
```

**After (named exports consistentes):**
```javascript
// utils.js
export function formatDate(d) { /* ... */ }
export function parseDate(s) { /* ... */ }

// consumer.js
import { formatDate, parseDate } from './utils.js'
// grep "formatDate" encontra declaração e todos os usos
```

## Heuristics

| Situação | Faça |
|----------|------|
| Módulo com múltiplas funções | Named exports para todas |
| Módulo com uma única responsabilidade (ex: componente React) | Default export é aceitável |
| Biblioteca/SDK público | Named exports para tree-shaking |
| Re-export de barrel file (index.js) | Named exports sempre |
| Nome do import não bate com nada no módulo | Verifique se é default — nome é livre |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `export { sum, multiply }` no final | `export function sum()` na declaração |
| `import batata from './calc.js'` (nome sem sentido para default) | `import sum from './calc.js'` (nome descritivo mesmo sendo default) |
| `import { sum } from './calc.js'` quando sum é default | `import sum from './calc.js'` (sem chaves para default) |
| `import sum from './calc.js'` quando sum é named | `import { sum } from './calc.js'` (com chaves para named) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `SyntaxError: The requested module does not provide an export named 'X'` | Tentando importar named export que nao existe | Verificar o nome exato do export no modulo fonte |
| Import funciona mas nome nao bate com a funcao | Usando default export com nome arbitrario | Usar named export para rastreabilidade: `export function X` |
| `SyntaxError: A module cannot have multiple default exports` | Dois `export default` no mesmo arquivo | Converter um deles para named export |
| Import com chaves retorna undefined | Funcao e default export mas importada como named | Remover chaves: `import sum from './calc.js'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes