# Code Examples: Atualizando Status de Itens entre BehaviorSubject Lists

## Exemplo completo do TaskService

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

export interface ITask {
  id: string;
  title: string;
  status: TaskStatus;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>([]);
  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  private doneTasks$ = new BehaviorSubject<ITask[]>([]);

  // Observables publicos para o template
  todoTasks = this.todoTasks$.asObservable();
  doingTasks = this.doingTasks$.asObservable();
  doneTasks = this.doneTasks$.asObservable();

  addTask(task: ITask): void {
    this.todoTasks$.next([...this.todoTasks$.value, task]);
  }

  updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    taskNextStatus: TaskStatus
  ): void {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);
    const currentTask = currentTaskList.value.find(
      (task) => task.id === taskId
    );

    if (currentTask) {
      // 1. Atualizar o status no objeto
      currentTask.status = taskNextStatus;

      // 2. Remover da lista atual
      const currentTaskListWithoutTask = currentTaskList.value.filter(
        (task) => task.id !== taskId
      );
      currentTaskList.next([...currentTaskListWithoutTask]);

      // 3. Adicionar na nova lista
      nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
    }
  }

  private getTaskListByStatus(
    taskStatus: TaskStatus
  ): BehaviorSubject<ITask[]> {
    const taskListObj = {
      [TaskStatus.TODO]: this.todoTasks$,
      [TaskStatus.DOING]: this.doingTasks$,
      [TaskStatus.DONE]: this.doneTasks$,
    };
    return taskListObj[taskStatus];
  }
}
```

## Chamada no componente (TaskListSettingComponent)

```typescript
// Dentro do handler de drag-and-drop
onDrop(taskId: string, taskCurrentStatus: TaskStatus, taskNextStatus: TaskStatus): void {
  this.taskService.updateTaskStatus(taskId, taskCurrentStatus, taskNextStatus);
}
```

## Debug no template com JSON pipe

```html
<p>To Do: {{ todoTasks | json }}</p>
<p>Doing: {{ doingTasks | json }}</p>
<p>Done: {{ doneTasks | json }}</p>
```

Util para verificar que a fonte de verdade esta sendo atualizada corretamente apos cada movimentacao.

## Variacao: Mesmo pattern para outros dominios

```typescript
// Kanban com mais colunas
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

private getOrderListByStatus(status: OrderStatus): BehaviorSubject<IOrder[]> {
  const lookup = {
    [OrderStatus.PENDING]: this.pendingOrders$,
    [OrderStatus.PROCESSING]: this.processingOrders$,
    [OrderStatus.SHIPPED]: this.shippedOrders$,
    [OrderStatus.DELIVERED]: this.deliveredOrders$,
  };
  return lookup[status];
}
```

O pattern e identico — objeto de lookup + .value para leitura + .filter() para remocao + .next() com spread para emissao.