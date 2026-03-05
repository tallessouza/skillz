---
name: rs-angular-deletando-a-tarefa
description: "Applies Angular reactive deletion pattern using BehaviorSubject filtering when implementing 'delete task', 'remove item from list', 'filter and update observable', or 'delete with BehaviorSubject'. Enforces immutable list update via filter() and .next() propagation. Make sure to use this skill whenever deleting items from BehaviorSubject-managed lists in Angular. Not for HTTP DELETE requests, database operations, or non-reactive state management."
---

# Deletando Tarefa com BehaviorSubject

> Para deletar um item de uma lista reativa, filtre a lista atual excluindo o item e propague a nova lista via .next().

## Rules

1. **Receba identificadores suficientes para localizar o item** — passe o `id` do item e o `status` (ou chave de agrupamento) para encontrar o BehaviorSubject correto, porque listas reativas podem estar particionadas por categoria
2. **Use filter() para gerar nova lista sem o item** — `list.filter(item => item.id !== targetId)`, porque mutação direta (splice) não dispara change detection no Angular
3. **Propague imediatamente com .next()** — após filtrar, chame `behaviorSubject.next(newList)` para que todos os subscribers atualizem automaticamente
4. **Mantenha a lógica de deleção no Service** — o Component apenas chama o service passando os dados necessários, porque o Service é a fonte de verdade
5. **Delegue do template via event binding** — use `(click)="deleteTask()"` no template, sem lógica no HTML

## How to write

### Service — método de deleção

```typescript
deleteTask(taskId: string, taskCurrentStatus: TaskStatus): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const newTaskList = currentTaskList.value.filter(
    (task) => task.id !== taskId
  );
  currentTaskList.next(newTaskList);
}
```

### Component — chamada ao service

```typescript
deleteTask(): void {
  this._taskService.deleteTask(this.task.id, this.task.status);
}
```

### Template — event binding

```html
<img src="assets/icons/trash.svg" (click)="deleteTask()" />
```

## Example

**Before (mutação direta — não reativo):**
```typescript
deleteTask(taskId: string, status: TaskStatus): void {
  const list = this.getTaskListByStatus(status);
  const index = list.value.findIndex(t => t.id === taskId);
  list.value.splice(index, 1); // mutação direta, não dispara update
}
```

**After (filter + next — reativo):**
```typescript
deleteTask(taskId: string, taskCurrentStatus: TaskStatus): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const newTaskList = currentTaskList.value.filter(
    (task) => task.id !== taskId
  );
  currentTaskList.next(newTaskList);
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Lista particionada por status/categoria | Receba a chave de partição como parâmetro para localizar o BehaviorSubject correto |
| Deleção precisa de confirmação | Adicione dialog no Component antes de chamar o service |
| Múltiplos subscribers na mesma lista | filter + next garante propagação automática para todos |
| Lista não particionada (único BehaviorSubject) | Apenas o id é necessário como parâmetro |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `list.value.splice(index, 1)` | `list.value.filter(t => t.id !== id)` + `.next()` |
| Lógica de deleção no Component | Lógica no Service, Component apenas delega |
| `(click)="taskService.deleteTask(...)"` no template | `(click)="deleteTask()"` chamando método local |
| Buscar item por index sem id único | Filtrar por id único (`task.id !== targetId`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
