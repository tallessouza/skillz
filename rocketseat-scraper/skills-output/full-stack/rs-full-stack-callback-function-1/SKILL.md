---
name: rs-full-stack-callback-function-1
description: "Enforces correct callback function patterns when writing JavaScript/TypeScript code. Use when user asks to 'pass a function as argument', 'create a callback', 'write async handler', 'use higher-order functions', or any code involving functions as parameters. Applies rules: named callbacks for reuse, arrow functions for inline, no unnecessary braces for single expressions. Make sure to use this skill whenever generating code that passes functions as arguments. Not for Promise chains, async/await patterns, or event listener setup."
---

# Callback Functions

> Ao passar funcoes como argumento, escolha o formato (nomeada, anonima, arrow) baseado na reutilizacao e legibilidade.

## Rules

1. **Callback reutilizavel = funcao nomeada separada** — defina a funcao antes e passe por referencia, porque permite reutilizacao e facilita debugging (stack trace legivel)
2. **Callback unico = arrow function inline** — use `() => {}` direto no argumento, porque reduz ruido quando a logica so aparece uma vez
3. **Expressao unica = sem chaves** — `() => console.log('done')` sem `{}`, porque chaves desnecessarias adicionam ruido visual
4. **Nomeie o parametro callback pelo que ele faz** — `onComplete`, `onError`, `processItem`, nao `cb` ou `fn`, porque descreve a intencao
5. **Execute o callback na posicao correta** — a ordem de execucao dentro da funcao receptora determina quando o callback roda, coloque-o onde faz sentido logico

## How to write

### Callback nomeado (reutilizavel)

```javascript
function onTaskComplete() {
  console.log("Tarefa finalizada")
}

function execute(taskName, callback) {
  console.log(`Executando: ${taskName}`)
  callback()
}

execute("Download do arquivo", onTaskComplete)
```

### Arrow function inline (uso unico)

```javascript
execute("Upload do arquivo", () => {
  console.log("Upload concluido")
})
```

### Expressao unica (forma curta)

```javascript
execute("Salvando arquivo", () => console.log("Arquivo salvo"))
```

## Example

**Before (callback mal estruturado):**

```javascript
function x(cb) {
  console.log("fazendo algo")
  cb()
}

x(function() {
  console.log("feito")
  return
})
```

**After (com esta skill aplicada):**

```javascript
function execute(taskName, onComplete) {
  console.log(`Executando: ${taskName}`)
  onComplete()
}

execute("Processando dados", () => console.log("Dados processados"))
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Callback usado em 2+ lugares | Funcao nomeada separada, passe por referencia |
| Callback usado uma unica vez | Arrow function inline |
| Callback com uma unica instrucao | Arrow sem chaves: `() => expr` |
| Callback com 2+ instrucoes | Arrow com chaves: `() => { ... }` |
| Funcao receptora precisa de flexibilidade | Aceite callback como ultimo parametro |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `function(cb) { cb() }` com `cb` generico | `function(onComplete) { onComplete() }` |
| `function() { ... }` anonima quando reutiliza | Funcao nomeada passada por referencia |
| Arrow com chaves para uma linha: `() => { return x }` | `() => x` |
| Callback definido inline quando tem 10+ linhas | Extraia para funcao nomeada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes