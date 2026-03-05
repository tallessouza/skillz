---
name: rs-angular-atualizando-status-tarefa-service
description: "Applies BehaviorSubject state management patterns when updating item status across multiple lists in Angular services. Use when user asks to 'move item between lists', 'update task status', 'drag and drop state management', 'manage BehaviorSubject lists', or 'transfer items between observable lists'. Enforces proper .value access, .next() emission, and immutable list updates. Make sure to use this skill whenever managing state across multiple BehaviorSubject lists in Angular. Not for HTTP calls, backend APIs, or template-only drag-and-drop UI logic."
---

# Atualizando Status de Itens entre BehaviorSubject Lists

> Ao mover itens entre listas gerenciadas por BehaviorSubjects, acesse a lista correta via lookup object, mute o item, remova da lista origem com filter, e adicione na lista destino com spread — sempre emitindo via .next().

## Rules

1. **Nunca faca for em todas as listas para encontrar um item** — receba o status atual como parametro e acesse diretamente a lista correta, porque iterar todas as listas e desnecessario quando voce ja sabe onde o item esta
2. **Use objeto de lookup ao inves de if/else para mapear status a BehaviorSubjects** — `{ [Status.TODO]: this.todoTasks$ }`, porque e mais limpo, extensivel e elimina cadeia de condicionais
3. **Acesse .value do BehaviorSubject para leitura sincrona** — `.value` retorna o array atual sem necessidade de subscribe, porque voce precisa do valor pontual para manipulacao
4. **Emita novas listas via .next() com novo array** — `behaviorSubject.next([...newList])`, porque .next() atualiza o valor interno E notifica todos os subscribers
5. **Remova itens com .filter() e adicione com spread** — nunca use splice ou push diretamente no .value, porque imutabilidade garante deteccao de mudanca pelo Angular
6. **Atualize a propriedade do item antes de mover** — `currentTask.status = nextStatus` antes de remover/adicionar, porque o objeto precisa refletir o novo estado ao chegar na lista destino

## How to write

### Lookup object para mapear status a BehaviorSubjects

```typescript
private getTaskListByStatus(status: TaskStatus): BehaviorSubject<ITask[]> {
  const taskListObj = {
    [TaskStatus.TODO]: this.todoTasks$,
    [TaskStatus.DOING]: this.doingTasks$,
    [TaskStatus.DONE]: this.doneTasks$,
  };
  return taskListObj[status];
}
```

### Metodo completo de update status

```typescript
updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, taskNextStatus: TaskStatus): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const nextTaskList = this.getTaskListByStatus(taskNextStatus);
  const currentTask = currentTaskList.value.find(task => task.id === taskId);

  if (currentTask) {
    // 1. Atualizar status no objeto
    currentTask.status = taskNextStatus;

    // 2. Remover da lista atual e emitir
    const listWithoutTask = currentTaskList.value.filter(task => task.id !== taskId);
    currentTaskList.next([...listWithoutTask]);

    // 3. Adicionar na nova lista e emitir
    nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
  }
}
```

## Example

**Before (iterando todas as listas):**
```typescript
updateStatus(taskId: string, newStatus: TaskStatus) {
  // Procura em TODAS as listas — ineficiente
  let found = this.todoTasks$.value.find(t => t.id === taskId);
  if (!found) found = this.doingTasks$.value.find(t => t.id === taskId);
  if (!found) found = this.doneTasks$.value.find(t => t.id === taskId);
  // Push direto no .value — nao emite para subscribers
  this.doingTasks$.value.push(found!);
}
```

**After (com esta skill aplicada):**
```typescript
updateTaskStatus(taskId: string, currentStatus: TaskStatus, nextStatus: TaskStatus): void {
  const currentList = this.getTaskListByStatus(currentStatus);
  const nextList = this.getTaskListByStatus(nextStatus);
  const task = currentList.value.find(t => t.id === taskId);

  if (task) {
    task.status = nextStatus;
    currentList.next([...currentList.value.filter(t => t.id !== taskId)]);
    nextList.next([...nextList.value, { ...task }]);
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa acessar BehaviorSubject por enum dinamico | Crie objeto de lookup com computed property names |
| Precisa ler valor atual do BehaviorSubject sem subscribe | Use `.value` |
| Precisa notificar subscribers apos mudanca | Use `.next()` com novo array |
| Item pode nao existir na lista | Guard com `if (found)` apos `.find()` |
| Componente chama o service | Passe os 3 parametros: id, statusAtual, proximoStatus |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `behaviorSubject.value.push(item)` | `behaviorSubject.next([...behaviorSubject.value, item])` |
| `if (status === 'todo') return this.todo$` | Objeto de lookup com `{ [TaskStatus.TODO]: this.todo$ }` |
| Iterar todas as listas para encontrar item | Receber currentStatus e acessar lista diretamente |
| `behaviorSubject.value = newList` | `behaviorSubject.next([...newList])` |
| Mover item sem atualizar `.status` | Atualizar `item.status = nextStatus` antes de mover |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
