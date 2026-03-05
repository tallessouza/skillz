---
name: rs-full-stack-estados-do-container
description: "Applies Docker container state management commands when working with containers. Use when user asks to 'pause container', 'stop container', 'start container', 'check container status', 'docker ps', or any container lifecycle task. Covers pause/unpause/stop/start states and resource implications. Make sure to use this skill whenever managing Docker container states or debugging unavailable containers. Not for Dockerfile creation, image building, or container networking."
---

# Estados do Container Docker

> Gerenciar o ciclo de vida de containers Docker requer entender os tres estados (running, paused, stopped) e seus impactos em recursos.

## Key concept

Um container Docker transita entre tres estados principais, cada um com impacto diferente no consumo de recursos da maquina host. Entender esses estados evita desperdicio de recursos e permite diagnosticar rapidamente por que um servico esta indisponivel.

## Decision framework

| Situacao | Comando | Estado resultante |
|----------|---------|-------------------|
| Verificar containers em execucao | `docker ps` | — |
| Verificar TODOS os containers (incluindo parados) | `docker ps -a` | — |
| Suspender temporariamente sem perder estado | `docker pause <id>` | Paused |
| Retomar container pausado | `docker unpause <id>` | Running (Up) |
| Parar completamente o container | `docker stop <id>` | Exited |
| Reiniciar container parado | `docker start <id>` | Running (Up) |

## Estados e recursos

| Estado | Status no `docker ps` | CPU | Memoria | Visivel em `docker ps`? |
|--------|----------------------|-----|---------|------------------------|
| Running | `Up X minutes` | Sim | Sim | Sim |
| Paused | `Up X minutes (Paused)` | Nao | Sim | Sim |
| Stopped | `Exited (0)` | Nao | Nao | Apenas com `-a` |

## How to think about it

### Pause vs Stop

**Pause** congela os processos do container — nao consome CPU mas mantem a memoria alocada. Use quando precisa liberar processamento temporariamente mas quer retomar rapido.

**Stop** interrompe completamente o container — libera todos os recursos (CPU e memoria). O container sai da listagem padrao do `docker ps` e so aparece com a flag `-a`.

### Container indisponivel

Quando um servico dentro do container nao responde (requisicao fica pendente ate timeout), verificar o estado do container e o primeiro passo de diagnostico. Um container pausado causa timeout; um container parado causa conexao recusada.

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa liberar CPU temporariamente | `docker pause` — retorno rapido com `unpause` |
| Nao vai usar o container por um tempo | `docker stop` — libera todos os recursos |
| Container nao aparece em `docker ps` | Use `docker ps -a` para ver containers parados |
| Servico nao responde no navegador | Verifique estado do container antes de investigar a aplicacao |
| Precisa reiniciar container parado | `docker start <id>`, nao precisa recriar |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Recriar container quando ele foi apenas parado | `docker start <id>` para reiniciar |
| Usar `docker ps` e achar que nao tem containers | Usar `docker ps -a` para ver todos |
| Deixar containers pausados indefinidamente consumindo memoria | Usar `docker stop` se nao vai retomar em breve |
| Investigar codigo da aplicacao quando servico nao responde | Verificar estado do container primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estados, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os comandos demonstrados com output esperado