---
name: rs-full-stack-funcionamento-node-js
description: "Applies Node.js runtime architecture knowledge when designing or debugging async code. Use when user asks to 'explain event loop', 'debug async issue', 'understand call stack', 'why is Node single threaded', or 'how Node handles requests'. Enforces correct mental model of Single Thread, Non-Blocking I/O, Call Stack, Event Loop, and Event Queue. Make sure to use this skill whenever user has misconceptions about Node concurrency or is debugging async behavior. Not for browser JavaScript runtime, Web Workers, or Deno/Bun internals."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, event-loop, call-stack, async, single-thread, non-blocking]
---

# Funcionamento do Node.js

> Compreender a arquitetura interna do Node (Single Thread, Non-Blocking I/O, Call Stack, Event Loop, Event Queue) para tomar decisoes corretas ao escrever codigo assincrono.

## Key concept

Node.js executa codigo JavaScript em uma unica thread principal. A eficiencia nao vem de paralelismo, mas do fato de que essa thread nunca fica bloqueada esperando operacoes de I/O. O Event Loop orquestra tudo: delega operacoes demoradas, continua processando tarefas rapidas, e retoma as demoradas quando ficam prontas.

**Analogia do instrutor:** Node e como uma cafeteria com um unico barista. Nao importa quantos clientes entrem, ha apenas uma pessoa fazendo tudo. O barista nunca faz duas coisas ao mesmo tempo, mas alterna rapidamente entre tarefas. Um organizador (Event Loop) garante que o barista nunca fique parado.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Operacao sincrona (calculo, manipulacao de string) | Vai direto para a Call Stack, executa e retorna |
| Operacao assincrona (leitura de DB, filesystem, HTTP) | Vai para Event Queue, Event Loop monitora e move para Call Stack quando pronta |
| Preocupacao com "Node e lento por ser single thread" | Explique que Single Thread + Non-Blocking I/O = eficiencia, tarefas nao bloqueiam umas as outras |
| Debug de codigo que "trava" | Provavelmente ha operacao sincrona pesada bloqueando a Call Stack |

## Arquitetura — Fluxo completo

```
Cliente (web/mobile/desktop)
    │
    ▼
Event Loop (Single Thread, Non-Blocking I/O)
    │
    ├── Tarefa simples/sincrona ──► Call Stack ──► Resposta ao Cliente
    │
    └── Tarefa complexa/assincrona ──► Event Queue
                                          │
                                    (quando pronta)
                                          │
                                          ▼
                                      Call Stack ──► Resposta ao Cliente
```

## 5 componentes essenciais

1. **Single Thread** — Uma unica thread principal executa todo o codigo JavaScript. Uma coisa por vez, nunca duas simultaneamente, porque ha um unico "encanamento" por onde tudo passa.

2. **Non-Blocking I/O** — Uma tarefa nao bloqueia a proxima. Operacoes de entrada/saida sao delegadas e a thread continua processando outras tarefas.

3. **Call Stack** — Pilha de execucao. Funcoes entram no topo, executam, sao removidas. Operacoes sincronas vao direto para ca.

4. **Event Queue** — Fila de eventos onde operacoes assincronas aguardam. Quando uma operacao assincrona termina, ela fica pronta nesta fila.

5. **Event Loop** — O "organizador" que monitora a Call Stack e a Event Queue. Se a Call Stack esta vazia, pega a proxima tarefa pronta da Event Queue e coloca na Call Stack.

## Heuristics

| Situacao | Faca |
|----------|------|
| Operacao rapida (soma, concatenacao) | Sincrona — Call Stack direta |
| Leitura de arquivo, consulta DB, request HTTP | Assincrona — Event Queue → Call Stack quando pronta |
| Loop pesado com milhoes de iteracoes | Cuidado: bloqueia a Call Stack e trava o Event Loop |
| Multiplas requisicoes simultaneas | Node lida bem — Non-Blocking I/O delega e continua |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Single Thread = lento | Single Thread + Non-Blocking I/O = muito eficiente para I/O |
| Node nao pode lidar com muitas requisicoes | Pode — tarefas assincronas nao bloqueiam, Event Loop orquestra |
| Tarefas executam em paralelo no Node | Nao — executam uma por vez, mas a thread nunca fica ociosa esperando I/O |
| Toda operacao passa pela Event Queue | Nao — operacoes sincronas vao direto para a Call Stack |

## Troubleshooting

### Problem: Application freezes and stops responding to requests
- **Cause**: A heavy synchronous operation (e.g., large loop or CPU-intensive calculation) is blocking the Call Stack
- **Fix**: Move CPU-intensive work to worker threads or break it into smaller async chunks so the Event Loop can continue processing other requests

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Analogia completa da cafeteria, raciocinio do instrutor e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos praticos de operacoes sincronas vs assincronas no Node