---
name: rs-angular-debugando-console-log
description: "Enforces systematic console.log debugging patterns when debugging Angular applications. Use when user asks to 'debug', 'find a bug', 'trace data flow', 'add logging', or 'investigate an issue' in Angular code. Applies end-to-end data flow tracing with labeled logs, method sequencing, and variable inspection. Make sure to use this skill whenever the user reports a bug or unexpected value in an Angular app. Not for unit testing, breakpoint debugging, or production logging/monitoring setup."
---

# Debugging Angular com console.log

> Ao debugar, rastreie o fluxo de dados de ponta a ponta com console.logs rotulados ate encontrar o ponto de divergencia.

## Rules

1. **Sempre rotule o log com o nome do metodo** — `console.log('- onCardDrop', event)` nao `console.log(event)`, porque sem rotulo voce nao sabe de onde veio o log no console
2. **Logue cada parametro com seu nome** — `console.log('taskId', taskId)` nao `console.log(taskId)`, porque valores soltos no console sao impossiveis de interpretar
3. **Numere logs sequenciais** — `console.log('1 - onCardDrop', ...)` depois `console.log('2 - updateTaskStatus', ...)`, porque confirma a ordem de execucao dos metodos
4. **Rastreie de ponta a ponta** — coloque logs em TODOS os metodos do fluxo de dados, desde a origem ate o ponto com bug, porque o erro pode estar em qualquer ponto intermediario
5. **Analise objetos expandindo no console** — logue o objeto inteiro e explore suas propriedades no DevTools, porque objetos aninhados escondem dados inesperados
6. **Primeiro rastreie, depois peca ajuda** — tente encontrar a divergencia sozinho antes de escalar, porque a pratica de rastreamento e uma habilidade essencial

## How to write

### Log rotulado com nome do metodo

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('- onCardDrop', 'event', event);

  const taskId = event.item.data.id;
  const currentStatus = event.container.id;

  console.log('taskId', taskId);
  console.log('currentStatus', currentStatus);

  this.updateTaskStatus(taskId, currentStatus);
}
```

### Log sequencial para confirmar ordem de execucao

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('1 - onCardDrop', 'event', event);
  // ...
  this.updateTaskStatus(taskId, currentStatus);
}

updateTaskStatus(taskId: string, newStatus: string) {
  console.log('2 - updateTaskStatus', 'taskId', taskId, 'newStatus', newStatus);
  // ...
}
```

## Example

**Before (bug reportado: valor errado no template):**
```typescript
// Dev pergunta "o que pode estar acontecendo?" sem investigar
onCardDrop(event: any) {
  const id = event.item.data.id;
  this.updateTaskStatus(id, event.container.id);
}

updateTaskStatus(id: string, status: string) {
  this.taskService.update(id, status);
}
```

**After (rastreamento de ponta a ponta):**
```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('1 - onCardDrop', 'event', event);

  const taskId = event.item.data.id;
  const taskCurrentStatus = event.previousContainer.id;
  const taskNewStatus = event.container.id;

  console.log('taskId', taskId);
  console.log('taskCurrentStatus', taskCurrentStatus);
  console.log('taskNewStatus', taskNewStatus);

  this.updateTaskStatus(taskId, taskNewStatus);
}

updateTaskStatus(taskId: string, newStatus: string) {
  console.log('2 - updateTaskStatus', 'taskId', taskId, 'newStatus', newStatus);
  // Agora analise no console: os valores estao corretos? A ordem esta certa?
  this.taskService.update(taskId, newStatus);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor errado no template | Rastreie o dado desde a origem (API/evento) ate o template, logando cada transformacao |
| Metodo nao esta sendo chamado | Coloque console.log na primeira linha do metodo e verifique no console |
| Objeto com estrutura desconhecida | Logue o objeto inteiro e expanda no DevTools para explorar propriedades |
| Duvida sobre ordem de execucao | Numere os logs (1, 2, 3...) e confirme a sequencia no console |
| Bug persistente apos analise | Expanda o rastreamento para mais metodos no fluxo antes de pedir ajuda |

## Anti-patterns

| Never do | Do instead |
|----------|-----------|
| `console.log(event)` sem rotulo | `console.log('- onCardDrop', 'event', event)` |
| `console.log(taskId)` valor solto | `console.log('taskId', taskId)` |
| Perguntar pra alguem antes de rastrear | Logue o fluxo inteiro e ache a divergencia primeiro |
| Logar so um ponto e adivinhar o resto | Logue de ponta a ponta ate o ponto com bug |
| Remover logs antes de resolver o bug | Mantenha todos os logs ate confirmar a correcao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
