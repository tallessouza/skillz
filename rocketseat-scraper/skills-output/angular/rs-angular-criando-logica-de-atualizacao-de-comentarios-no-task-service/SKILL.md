---
name: rs-angular-atualizacao-comentarios-task-service
description: "Applies the BehaviorSubject immutable update pattern for replacing nested arrays in Angular services. Use when user asks to 'update comments', 'replace a list inside an object in a BehaviorSubject', 'update nested property in reactive state', or 'implement service method for array replacement'. Enforces find-by-index, spread-copy, property override, and .next() emission. Make sure to use this skill whenever modifying nested arrays inside BehaviorSubject-managed state in Angular. Not for creating new services, adding items to flat arrays, or template/component logic."
---

# Atualizacao de Lista Aninhada em BehaviorSubject (Angular Service)

> Para atualizar uma propriedade aninhada (como comments) dentro de um item gerenciado por BehaviorSubject, encontre pelo index, copie com spread, substitua a propriedade, e emita com .next().

## Rules

1. **Receba a lista completa como parametro** — sempre substitua todos os itens da propriedade aninhada, nunca faca push/splice individual, porque garante consistencia e simplifica a logica
2. **Localize o BehaviorSubject pelo status** — use um metodo auxiliar como `getTaskListByStatus()` para encontrar a fonte de verdade correta, porque os itens podem estar em listas diferentes
3. **Use findIndex para localizar o item** — busque pelo ID no `.value` do BehaviorSubject, porque voce precisa do index para substituicao imutavel
4. **Guarde com if (index > -1)** — findIndex retorna -1 quando nao encontra, execute a logica apenas se encontrou o item
5. **Copie o array com spread antes de mutar** — `const updated = [...subject.value]`, porque nunca mute o valor atual do BehaviorSubject diretamente
6. **Override apenas a propriedade alvo** — use spread do objeto existente + override da propriedade: `{ ...current, comments: [...newComments] }`, porque preserva todas as outras propriedades intactas
7. **Emita com .next()** — `subject.next(updatedList)` para que todos os subscribers recebam a atualizacao

## How to write

### Metodo de atualizacao de propriedade aninhada

```typescript
updateTaskComments(
  taskId: string,
  taskCurrentStatus: TaskStatus,
  newTaskComments: IComment[]
): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const currentTaskIndex = currentTaskList.value.findIndex(
    (task) => task.id === taskId
  );

  if (currentTaskIndex > -1) {
    const updatedTaskList = [...currentTaskList.value];
    updatedTaskList[currentTaskIndex] = {
      ...updatedTaskList[currentTaskIndex],
      comments: [...newTaskComments],
    };
    currentTaskList.next(updatedTaskList);
  }
}
```

## Example

**Before (mutacao direta — errado):**
```typescript
updateTaskComments(taskId: string, newComments: IComment[]): void {
  const list = this.taskList$.value;
  const task = list.find(t => t.id === taskId);
  task.comments = newComments; // mutacao direta!
  // subscribers nao sao notificados
}
```

**After (com esta skill aplicada):**
```typescript
updateTaskComments(
  taskId: string,
  taskCurrentStatus: TaskStatus,
  newTaskComments: IComment[]
): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const currentTaskIndex = currentTaskList.value.findIndex(
    (task) => task.id === taskId
  );

  if (currentTaskIndex > -1) {
    const updatedTaskList = [...currentTaskList.value];
    updatedTaskList[currentTaskIndex] = {
      ...updatedTaskList[currentTaskIndex],
      comments: [...newTaskComments],
    };
    currentTaskList.next(updatedTaskList);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizar qualquer propriedade aninhada (comments, tags, assignees) | Mesmo padrao: findIndex → spread copy → override → .next() |
| Item pode estar em listas diferentes por status | Receba o status como parametro para localizar o BehaviorSubject correto |
| Substituir lista inteira vs adicionar um item | Sempre receba a lista completa e substitua tudo — simplicidade > otimizacao |
| Metodo similar ja existe no service (ex: updateTaskNameAndDescription) | Siga o mesmo padrao estrutural para consistencia |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `task.comments = newComments` (mutacao direta) | `{ ...task, comments: [...newComments] }` (spread + override) |
| `list.find(t => t.id === id)` para mutar | `list.findIndex(t => t.id === id)` + copia do array |
| `subject.value.push(item)` | `subject.next([...subject.value, item])` |
| Logica sem guard `if (index > -1)` | Sempre verificar se findIndex encontrou o item |
| `subject.next(subject.value)` apos mutacao | Criar copia nova e emitir a copia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
