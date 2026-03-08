---
name: rs-full-stack-conhecendo-o-event-loop
description: "Applies JavaScript Event Loop mental model when writing or debugging async code. Use when user asks to 'debug async code', 'understand execution order', 'fix race condition', 'explain why callback runs after', or questions about Promise vs setTimeout ordering. Make sure to use this skill whenever execution order of async JavaScript is relevant. Not for general JavaScript syntax, DOM manipulation, or framework-specific state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [event-loop, call-stack, microtask, macrotask, async-execution, promises]
---

# Event Loop do JavaScript

> Compreender o Event Loop e permitir raciocinar sobre ordem de execucao de codigo assincrono em JavaScript.

## Key concept

JavaScript e single-thread: executa uma coisa por vez numa unica fila (call stack). Para nao bloquear essa fila, operacoes assincronas sao delegadas para Web APIs (no browser) ou libuv (no Node), e seus callbacks retornam via filas de callback. O Event Loop e o mecanismo que monitora constantemente a call stack e as filas de callback, movendo callbacks para a call stack quando ela esta vazia.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Codigo sincrono misturado com Promises e setTimeout | Microtasks (Promises) executam ANTES de Macrotasks (setTimeout) |
| `await` numa async function | O codigo apos o await vai para a fila de microtasks |
| setTimeout com delay 0 | Ainda e macrotask — executa DEPOIS de todas as microtasks pendentes |
| Multiplos `.then()` encadeados | Cada `.then()` agenda uma microtask — todas executam antes do proximo macrotask |
| Codigo bloqueante (loop pesado) na call stack | NADA mais executa ate a call stack esvaziar — Event Loop fica travado |

## How to think about it

### As 4 engrenagens

```
┌─────────────┐     ┌───────────┐
│  Call Stack  │◄────│ Event Loop│
│ (execucao)  │     │ (monitor) │
└──────┬──────┘     └─────┬─────┘
       │                  │
       ▼                  ▼
┌─────────────┐     ┌───────────────┐
│  Web APIs   │────►│ Callback Queue│
│ (delegadas) │     │ micro + macro │
└─────────────┘     └───────────────┘
```

1. **Call Stack** — pilha de funcoes em execucao. Tudo passa por aqui.
2. **Web APIs** — onde operacoes assincronas realmente executam (fetch, timers, DOM events). Passam pela call stack mas sao resolvidas fora dela.
3. **Callback Queue** — fila dupla (microtasks + macrotasks) que armazena callbacks prontos para executar.
4. **Event Loop** — verifica constantemente: "a call stack esta vazia? Se sim, tem microtask? Executa todas. Depois pega o proximo macrotask."

### Ordem de execucao garantida

```javascript
console.log('1 - sincrono')           // 1o: call stack

Promise.resolve().then(() => {
  console.log('2 - microtask')        // 3o: microtask
})

setTimeout(() => {
  console.log('3 - macrotask')        // 4o: macrotask
}, 0)

console.log('4 - sincrono')           // 2o: call stack

// Output: 1, 4, 2, 3
```

### O ciclo do Event Loop

```
1. Executa todo codigo sincrono (call stack)
2. Call stack vazia?
   → Executa TODAS as microtasks pendentes
3. Ainda tem microtask? (microtask pode agendar outra)
   → Executa todas ate esvaziar
4. Pega UM macrotask da fila
   → Coloca na call stack, executa
5. Volta para o passo 2
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| setTimeout(fn, 0) executa imediatamente | E macrotask — executa depois de todo codigo sincrono e todas as microtasks |
| Promises sao iguais a setTimeout | Promises sao microtasks (alta prioridade), setTimeout e macrotask (baixa prioridade) |
| JavaScript e multi-thread | Single-thread com concorrencia via Event Loop — as Web APIs executam em threads separadas, mas o JS em si processa uma coisa por vez |
| async/await torna o codigo sincrono | Apenas syntax sugar — o await pausa a funcao e agenda continuacao como microtask |
| Mais callbacks = mais lento | O gargalo e a call stack — se ela esta ocupada com codigo sincrono pesado, nenhum callback executa |

## When to apply

- Debugar por que um `console.log` aparece em ordem inesperada
- Entender por que a UI trava (call stack bloqueada)
- Decidir entre Promise e setTimeout para agendar trabalho
- Explicar race conditions em codigo async
- Otimizar performance evitando bloqueio da thread principal

## Limitations

- O modelo simplificado (micro/macrotask) nao cobre todas as nuances do spec (ex: rendering steps no browser entre macrotasks)
- Node.js tem filas adicionais (nextTick, I/O, check) com prioridades proprias
- Web Workers fogem deste modelo — sao threads separadas com seu proprio Event Loop

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `console.log` aparece em ordem inesperada | Mistura de codigo sincrono, microtasks e macrotasks | Aplicar regra: sincrono > microtasks (Promises) > macrotasks (setTimeout) |
| UI trava durante operacao | Call stack bloqueada por codigo sincrono pesado | Mover operacao pesada para Web Worker ou quebrar em chunks com `setTimeout` |
| `setTimeout(fn, 0)` executa depois de Promise | setTimeout e macrotask, Promise e microtask | Usar Promise se precisa de prioridade maior |
| Race condition em codigo async | Ordem de execucao nao garantida | Usar `await` sequencial ou `Promise.all` conforme dependencia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes