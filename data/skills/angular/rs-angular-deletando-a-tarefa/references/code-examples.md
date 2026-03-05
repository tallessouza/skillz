# Code Examples: Deletando Tarefa com BehaviorSubject

## 1. TaskService — método deleteTask completo

```typescript
// task.service.ts
deleteTask(taskId: string, taskCurrentStatus: TaskStatus): void {
  // 1. Localiza o BehaviorSubject correto pelo status
  const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);

  // 2. Cria nova lista excluindo o item pelo id
  const newTaskList = currentTaskList.value.filter(
    (task) => task.id !== taskId
  );

  // 3. Propaga a nova lista para todos os subscribers
  currentTaskList.next(newTaskList);
}
```

### Como `getTaskListByStatus` funciona (contexto)

```typescript
// Retorna o BehaviorSubject correspondente ao status
getTaskListByStatus(status: TaskStatus): BehaviorSubject<Task[]> {
  switch (status) {
    case 'TODO':
      return this._todoList$;
    case 'IN_PROGRESS':
      return this._inProgressList$;
    case 'DONE':
      return this._doneList$;
  }
}
```

## 2. TaskCardComponent — chamada ao service

```typescript
// task-card.component.ts
export class TaskCardComponent {
  @Input() task!: Task;

  private _taskService = inject(TaskService);

  deleteTask(): void {
    this._taskService.deleteTask(this.task.id, this.task.status);
  }
}
```

## 3. Template — event binding no ícone

```html
<!-- task-card.component.html -->
<img
  src="assets/icons/trash.svg"
  alt="Deletar tarefa"
  (click)="deleteTask()"
/>
```

## 4. Variação: com confirmação antes de deletar

```typescript
deleteTask(): void {
  const confirmed = confirm('Deseja realmente deletar esta tarefa?');
  if (confirmed) {
    this._taskService.deleteTask(this.task.id, this.task.status);
  }
}
```

## 5. Variação: lista única (sem partição por status)

```typescript
// Se houvesse apenas um BehaviorSubject para todas as tarefas
deleteTask(taskId: string): void {
  const newTaskList = this._taskList$.value.filter(
    (task) => task.id !== taskId
  );
  this._taskList$.next(newTaskList);
}
```

## 6. Anti-pattern: mutação direta

```typescript
// ERRADO — não dispara change detection
deleteTask(taskId: string, status: TaskStatus): void {
  const list = this.getTaskListByStatus(status);
  const index = list.value.findIndex((t) => t.id === taskId);
  if (index > -1) {
    list.value.splice(index, 1); // muta o array existente
    // list.next(list.value); // mesmo chamando next, a referência é a mesma
  }
}
```