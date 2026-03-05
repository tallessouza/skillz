---
name: rs-full-stack-renomeando-as-exportacoes
description: "Applies JavaScript export renaming patterns using 'as' keyword when writing ES modules. Use when user asks to 'rename export', 'export with different name', 'alias export', 'change export name', or restructures module exports. Ensures correct 'as' syntax in export statements and matching imports. Make sure to use this skill whenever refactoring module exports or reorganizing named exports. Not for import renaming, default exports, or CommonJS require/module.exports."
---

# Renomeando Exportações em JavaScript

> Ao exportar funcoes de um modulo, use `as` para dar nomes diferentes dos nomes internos da funcao.

## Rules

1. **Exporte no final do arquivo com renomeacao** — `export { sum as sumTwoNumbers }` em vez de `export` inline, porque centralizar exports facilita renomear e visualizar tudo que o modulo expoe
2. **Use `as` para renomear** — a sintaxe e `{ nomeOriginal as nomeExportado }`, porque isso mantém o nome interno da funcao intacto enquanto expoe um nome diferente para consumidores
3. **Atualize todos os imports correspondentes** — ao renomear um export, todo arquivo que importa deve usar o novo nome, porque o nome antigo deixa de existir no modulo
4. **Remova `export` inline ao centralizar** — tire `export` e `export default` das declaracoes de funcao antes de usar `export { ... }` no final, porque nao pode exportar a mesma funcao duas vezes

## How to write

### Exportacao centralizada com renomeacao

```javascript
// calc.js
function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

// Exporta com nomes diferentes dos nomes internos
export { sum as sumTwoNumbers, multiply as multiplyTwoNumbers }
```

### Import correspondente

```javascript
// main.js
import { sumTwoNumbers, multiplyTwoNumbers } from './calc.js'

console.log(sumTwoNumbers(2, 3))
console.log(multiplyTwoNumbers(4, 5))
```

## Example

**Before (export inline sem renomeacao):**
```javascript
// calc.js
export function sum(a, b) {
  return a + b
}

// main.js
import { sum } from './calc.js'
```

**After (export centralizado com renomeacao):**
```javascript
// calc.js
function sum(a, b) {
  return a + b
}

export { sum as sumTwoNumbers }

// main.js
import { sumTwoNumbers } from './calc.js'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nome interno e generico mas o modulo precisa ser claro | Renomeie no export com `as` |
| Conflito de nomes entre modulos | Renomeie no export OU no import |
| Modulo expoe poucas funcoes | Centralize exports no final do arquivo |
| Nome da funcao ja e descritivo | Nao renomeie, exporte direto |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `export default` + `export { fn as alias }` misturados sem necessidade | Escolha um padrao: ou default ou named |
| Renomear no export E no import (dupla renomeacao) | Renomeie em um lugar so — preferencia no export |
| Esquecer de atualizar imports apos renomear export | Atualize todos os arquivos que importam |
| `export { sum }` com `export function sum` ao mesmo tempo | Remova o `export` inline ao usar `export { }` no final |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando e por que renomear exports
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-renomeando-as-exportacoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-renomeando-as-exportacoes/references/code-examples.md)
