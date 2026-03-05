# Code Examples: Atualizacao de Lista Aninhada em BehaviorSubject

## Interface ITask e IComment (contexto)

```typescript
interface IComment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

interface ITask {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  comments: IComment[];
}
```

## Metodo completo: updateTaskComments

```typescript
updateTaskComments(
  taskId: string,
  taskCurrentStatus: TaskStatus,
  newTaskComments: IComment[]
): void {
  // 1. Encontrar o BehaviorSubject correto pelo status
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);

  // 2. Encontrar o index da tarefa pelo ID
  const currentTaskIndex = currentTaskList.value.findIndex(
    (task) => task.id === taskId
  );

  // 3. Verificar se a tarefa foi encontrada
  if (currentTaskIndex > -1) {
    // 4. Criar copia do array (imutabilidade)
    const updatedTaskList = [...currentTaskList.value];

    // 5. Substituir o item no index com spread + override de comments
    updatedTaskList[currentTaskIndex] = {
      ...updatedTaskList[currentTaskIndex],
      comments: [...newTaskComments],
    };

    // 6. Emitir a nova lista para todos os subscribers
    currentTaskList.next(updatedTaskList);
  }
}
```

## Metodo anterior para comparacao: updateTaskNameAndDescription

```typescript
updateTaskNameAndDescription(
  taskId: string,
  taskCurrentStatus: TaskStatus,
  newName: string,
  newDescription: string
): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const currentTaskIndex = currentTaskList.value.findIndex(
    (task) => task.id === taskId
  );

  if (currentTaskIndex > -1) {
    const updatedTaskList = [...currentTaskList.value];
    updatedTaskList[currentTaskIndex] = {
      ...updatedTaskList[currentTaskIndex],
      name: newName,
      description: newDescription,
    };
    currentTaskList.next(updatedTaskList);
  }
}
```

Note o padrao identico — so muda quais propriedades sofrem override.

## Metodo auxiliar: getTaskListByStatus

```typescript
getTaskListByStatus(status: TaskStatus): BehaviorSubject<ITask[]> {
  switch (status) {
    case TaskStatus.TODO:
      return this.todoList$;
    case TaskStatus.IN_PROGRESS:
      return this.inProgressList$;
    case TaskStatus.DONE:
      return this.doneList$;
  }
}
```

## Variacao: atualizar tags (mesmo padrao)

```typescript
updateTaskTags(
  taskId: string,
  taskCurrentStatus: TaskStatus,
  newTags: ITag[]
): void {
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
  const currentTaskIndex = currentTaskList.value.findIndex(
    (task) => task.id === taskId
  );

  if (currentTaskIndex > -1) {
    const updatedTaskList = [...currentTaskList.value];
    updatedTaskList[currentTaskIndex] = {
      ...updatedTaskList[currentTaskIndex],
      tags: [...newTags],
    };
    currentTaskList.next(updatedTaskList);
  }
}
```

## Uso no componente (proximo video, mas util como contexto)

```typescript
// No componente que gerencia o modal de comentarios
onCommentsUpdated(updatedComments: IComment[]): void {
  this.taskService.updateTaskComments(
    this.task.id,
    this.task.status,
    updatedComments
  );
}
```