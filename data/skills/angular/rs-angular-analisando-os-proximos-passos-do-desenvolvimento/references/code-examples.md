# Code Examples: Task Service como Fonte Unica de Verdade

## Estrutura completa do TaskService

```typescript
// models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
}
```

```typescript
// services/task.service.ts
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks: Task[] = [];
  private doingTasks: Task[] = [];
  private doneTasks: Task[] = [];

  getTodoTasks(): Task[] {
    return this.todoTasks;
  }

  getDoingTasks(): Task[] {
    return this.doingTasks;
  }

  getDoneTasks(): Task[] {
    return this.doneTasks;
  }

  createTask(task: Task): void {
    // Toda tarefa nova entra como 'todo'
    task.status = 'todo';
    this.todoTasks.push(task);
  }

  deleteTask(taskId: string): void {
    this.todoTasks = this.todoTasks.filter(t => t.id !== taskId);
    this.doingTasks = this.doingTasks.filter(t => t.id !== taskId);
    this.doneTasks = this.doneTasks.filter(t => t.id !== taskId);
  }

  moveTask(taskId: string, newStatus: 'todo' | 'doing' | 'done'): void {
    const task = this.findAndRemove(taskId);
    if (task) {
      task.status = newStatus;
      this.getListByStatus(newStatus).push(task);
    }
  }

  private findAndRemove(taskId: string): Task | undefined {
    for (const list of [this.todoTasks, this.doingTasks, this.doneTasks]) {
      const index = list.findIndex(t => t.id === taskId);
      if (index !== -1) {
        return list.splice(index, 1)[0];
      }
    }
    return undefined;
  }

  private getListByStatus(status: string): Task[] {
    const map: Record<string, Task[]> = {
      todo: this.todoTasks,
      doing: this.doingTasks,
      done: this.doneTasks,
    };
    return map[status];
  }
}
```

## Consumindo no componente

```typescript
// components/board/board.component.ts
@Component({
  selector: 'app-board',
  template: `
    <app-column title="To Do" [tasks]="taskService.getTodoTasks()" />
    <app-column title="Doing" [tasks]="taskService.getDoingTasks()" />
    <app-column title="Done" [tasks]="taskService.getDoneTasks()" />
  `
})
export class BoardComponent {
  constructor(public taskService: TaskService) {}
}
```

## Anti-pattern: estado local no componente

```typescript
// ERRADO — cada componente tem sua propria copia
@Component({ ... })
export class ColumnComponent {
  tasks: Task[] = []; // Estado local — perde sincronia
}

// CORRETO — componente consome do service
@Component({ ... })
export class ColumnComponent {
  @Input() tasks: Task[] = []; // Recebe do service via parent
}
```