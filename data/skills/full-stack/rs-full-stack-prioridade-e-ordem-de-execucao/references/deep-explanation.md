# Deep Explanation: Prioridade e Ordem de Execução no Event Loop

## O experimento do instrutor

O instrutor propõe um exercício mental: escrever todo o código primeiro, sem salvar, e pedir ao aluno que tente prever a ordem de execução antes de rodar. Essa abordagem de "faça a prova e o teste" é fundamental — não basta ler sobre o event loop, é preciso testar mentalmente e verificar.

O código mistura propositalmente 5 operações de tipos diferentes (síncrono, microtask explícita, macrotask, síncrono novamente, promise resolvida) para revelar como o event loop prioriza.

## Por que 1, 4, 2, 5, 3?

### Fase 1: Código síncrono (call stack)
O JavaScript lê o arquivo de cima para baixo. Tudo que é síncrono executa imediatamente:
- `console.log(1)` → imprime 1
- `queueMicrotask(...)` → apenas REGISTRA a callback na fila de microtasks, não executa
- `setTimeout(...)` → apenas REGISTRA a callback como macrotask, não executa
- `console.log(4)` → imprime 4
- `Promise.resolve(true).then(...)` → a promise resolve imediatamente, mas o `.then()` REGISTRA a callback como microtask

Após essa fase: output é `1, 4`. Fila de microtasks: [console.log(2), console.log(5)]. Fila de macrotasks: [console.log(3)].

### Fase 2: Microtasks
O event loop esvazia TODA a fila de microtasks antes de passar para macrotasks:
- `console.log(2)` → imprime 2 (queueMicrotask foi registrada primeiro)
- `console.log(5)` → imprime 5 (promise.then foi registrada depois)

### Fase 3: Macrotasks
Só agora o event loop processa a fila de macrotasks:
- `console.log(3)` → imprime 3 (setTimeout, mesmo com 1000ms já passado)

## Insight chave do instrutor

O instrutor destaca: "por isso que é legal conhecer essa ordem de execução e também saber que o event loop lida com essas prioridades de execução — sabendo disso você consegue ter clareza de como essas engrenagens funcionam."

A metáfora de "engrenagens" é precisa — o event loop não é aleatório, é um mecanismo com prioridades bem definidas e previsíveis.

## queueMicrotask vs Promise.resolve().then()

Ambos entram na mesma fila de microtasks. A diferença é semântica:
- `queueMicrotask()` — forma explícita de adicionar uma microtask. O instrutor chama de "método do próprio JavaScript pra adicionar uma microtask na fila"
- `Promise.resolve().then()` — a promise é resolvida imediatamente, então o `.then()` é automaticamente adicionado como microtask

A ordem entre elas é determinada pela ordem de registro, não pelo tipo.

## setTimeout com delay 0

Mesmo `setTimeout(fn, 0)` é uma macrotask. O delay 0 não significa "execute agora" — significa "agende para a próxima oportunidade na fila de macrotasks". Como microtasks sempre têm prioridade, o setTimeout com delay 0 ainda executa depois de todas as microtasks pendentes.

## Hierarquia completa de prioridades

```
1. Código síncrono (call stack) — execução imediata
2. Microtasks — queueMicrotask(), Promise.then(), MutationObserver
3. Macrotasks — setTimeout, setInterval, setImmediate (Node), I/O, UI rendering
```

Regra fundamental: a fila de microtasks é completamente esvaziada entre cada macrotask. Se uma microtask gerar outra microtask, ela também executa antes da próxima macrotask.