---
name: rs-full-stack-prioridade-ordem-execucao
description: "Applies JavaScript event loop execution order knowledge when writing or reviewing async code. Use when user asks to 'debug async code', 'understand execution order', 'fix race condition', 'write promises', 'use setTimeout', or 'explain event loop'. Enforces correct mental model: sync first, then microtasks (queueMicrotask, resolved promises), then macrotasks (setTimeout, setInterval). Make sure to use this skill whenever reviewing or generating code mixing sync and async patterns. Not for Node.js streams, web workers, or service workers."
---

# Prioridade e Ordem de Execução no Event Loop

> Código síncrono executa primeiro, depois microtasks (queueMicrotask, promises resolvidas), depois macrotasks (setTimeout, setInterval).

## Rules

1. **Código síncrono sempre executa primeiro** — todo console.log, atribuição ou chamada de função fora de callbacks async roda imediatamente, na ordem em que aparece no código
2. **Microtasks têm prioridade sobre macrotasks** — `queueMicrotask()` e `.then()` de promises resolvidas executam ANTES de qualquer `setTimeout`, mesmo com delay 0, porque a fila de microtasks é esvaziada antes de processar a próxima macrotask
3. **`queueMicrotask()` e Promise resolvida são equivalentes em prioridade** — ambas entram na fila de microtasks e executam na ordem em que foram enfileiradas
4. **`setTimeout(fn, 0)` não é imediato** — é uma macrotask que aguarda o temporizador ser acionado, então executa por último mesmo com delay zero
5. **Promise resolvida imediatamente vira microtask** — `Promise.resolve(true).then(fn)` adiciona `fn` como microtask, não executa o `.then` sincronamente

## Ordem de execução

```
1º — Código síncrono (call stack)
2º — Microtasks (queueMicrotask, Promise.then de promises já resolvidas)
3º — Macrotasks (setTimeout, setInterval, I/O callbacks)
```

## Example

**Código:**
```javascript
console.log(1)                          // síncrono

queueMicrotask(() => {
  console.log(2)                        // microtask explícita
})

setTimeout(() => {
  console.log(3)                        // macrotask (temporizador)
}, 1000)

console.log(4)                          // síncrono

Promise.resolve(true).then(() => {
  console.log(5)                        // microtask (promise resolvida)
})
```

**Output: `1, 4, 2, 5, 3`**

| Valor | Por quê |
|-------|---------|
| 1 | Síncrono — executa imediatamente |
| 4 | Síncrono — executa imediatamente (próxima linha síncrona) |
| 2 | Microtask — `queueMicrotask` enfileirou antes da promise |
| 5 | Microtask — `Promise.resolve().then()` enfileirou depois do queueMicrotask |
| 3 | Macrotask — `setTimeout` aguarda temporizador, executa por último |

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa executar algo após código síncrono mas antes de timers | Use `queueMicrotask()` ou `Promise.resolve().then()` |
| Precisa adiar execução para próximo ciclo do event loop | Use `setTimeout(fn, 0)` — é macrotask, roda depois de todas as microtasks |
| Debug de ordem de execução | Numere os console.logs e classifique: síncrono, microtask ou macrotask |
| Código mistura sync + promises + setTimeout | Trace mentalmente: sync primeiro, depois microtasks em ordem, depois macrotasks |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Assumir que `setTimeout(fn, 0)` executa "imediatamente" | Entenda que é macrotask — executa depois de todas as microtasks pendentes |
| Assumir que a ordem no código = ordem de execução | Classifique cada operação (sync/micro/macro) para prever a ordem real |
| Usar `setTimeout` quando precisa de prioridade alta | Use `queueMicrotask()` para garantir execução antes de macrotasks |
| Ignorar que `.then()` de promise resolvida é assíncrono | Mesmo `Promise.resolve().then(fn)` não executa `fn` sincronamente — é microtask |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o event loop, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações