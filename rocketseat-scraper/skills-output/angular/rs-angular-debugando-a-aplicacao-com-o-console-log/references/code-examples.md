# Code Examples: Debugging Angular com console.log

## Exemplo 1: Log basico com rotulo de metodo

Extraido diretamente da aula — o padrao fundamental de logging:

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('- onCardDrop', 'event', event);
}
```

**Anatomia do log:**
- `'-'` — separador visual para identificar logs no console
- `'onCardDrop'` — nome do metodo (voce sabe de onde veio)
- `'event'` — nome do parametro como string
- `event` — o valor real do objeto

## Exemplo 2: Logando variaveis individuais

Quando voce tem duvida sobre os valores que variaveis estao recebendo:

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('- onCardDrop', 'event', event);

  const taskId = event.item.data.id;
  const taskCurrentStatus = event.previousContainer.id;

  console.log('taskId', taskId);
  console.log('taskCurrentStatus', taskCurrentStatus);
}
```

**O que observar no console:**
- `taskId` mostra o ID correto da tarefa?
- `taskCurrentStatus` reflete o status real antes da movimentacao?

## Exemplo 3: Rastreamento sequencial entre metodos

Para confirmar que metodos sao chamados na ordem esperada:

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('1 - onCardDrop', 'event', event);

  const taskId = event.item.data.id;
  const currentStatus = event.container.id;

  console.log('taskId', taskId);
  console.log('currentStatus', currentStatus);

  this.updateTaskStatus(taskId, currentStatus);
}

updateTaskStatus(taskId: string, newStatus: string) {
  console.log('2 - updateTaskStatus', 'taskId', taskId, 'newStatus', newStatus);

  // Logica de atualizacao...
}
```

**O que verificar no console:**
1. O log `1 - onCardDrop` aparece primeiro?
2. O log `2 - updateTaskStatus` aparece depois?
3. Os valores passados para `updateTaskStatus` sao os mesmos extraidos em `onCardDrop`?

## Exemplo 4: Exploracao de objetos aninhados

O instrutor mostra como expandir objetos no console do navegador:

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('- onCardDrop', 'event', event);
  // No console do navegador:
  // > event
  //   > item
  //     > data
  //       > id: "task-123"
  //       > title: "Minha tarefa"
  //       > status: "todo"
}
```

**Tecnica:** Clique na seta ao lado do objeto no console para expandir e ver todas as propriedades aninhadas. Isso revela a estrutura real dos dados sem precisar adivinhar.

## Exemplo 5: Fluxo completo de debug (cenario real)

Cenario: o template mostra o status errado apos mover uma tarefa.

```typescript
// PASSO 1: Logue o evento de drag & drop
onCardDrop(event: CdkDragDrop<Task[]>) {
  console.log('1 - onCardDrop', 'event', event);

  const taskId = event.item.data.id;
  const previousStatus = event.previousContainer.id;
  const newStatus = event.container.id;

  console.log('taskId', taskId);
  console.log('previousStatus', previousStatus);
  console.log('newStatus', newStatus);

  this.updateTaskStatus(taskId, newStatus);
}

// PASSO 2: Logue a funcao de atualizacao
updateTaskStatus(taskId: string, newStatus: string) {
  console.log('2 - updateTaskStatus', 'taskId', taskId, 'newStatus', newStatus);

  const task = this.tasks.find(t => t.id === taskId);
  console.log('task found', task);

  if (task) {
    task.status = newStatus;
    console.log('task after update', task);
  }
}

// PASSO 3: Logue o binding do template (se necessario)
get filteredTasks() {
  console.log('3 - filteredTasks', 'all tasks', this.tasks);
  return this.tasks.filter(t => t.status === this.currentFilter);
}
```

**Analise no console:**
- Se `previousStatus` e `newStatus` sao iguais → o container ID esta errado
- Se `task found` e `undefined` → o ID nao bate com nenhuma tarefa
- Se `task after update` mostra o status correto mas o template nao → problema no change detection

## Dica: Limpando o console antes de testar

O instrutor mostra que antes de reproduzir o bug, e util limpar o console (botao "Clear" ou Ctrl+L) para ver apenas os logs relevantes da acao que voce esta testando.