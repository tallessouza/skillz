# Code Examples: Organizacao de Projeto Angular

## Estrutura de pastas do projeto GoTask

```
src/app/
├── components/
│   ├── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   └── header.component.scss
│   ├── task-card/
│   │   ├── task-card.component.ts
│   │   ├── task-card.component.html
│   │   └── task-card.component.scss
│   └── task-comments-modal/
│       ├── task-comments-modal.component.ts
│       ├── task-comments-modal.component.html
│       └── task-comments-modal.component.scss
├── enums/
│   └── task-status-enum.ts
├── interfaces/
│   ├── i-comment.ts
│   └── i-task-form-controls.ts
├── services/
│   ├── task.service.ts
│   └── dialog.service.ts
├── types/
│   └── task-status.type.ts
└── utils/
    └── create-id.ts
```

## Enum com nomenclatura padronizada

```typescript
// enums/task-status-enum.ts
export enum TaskStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
}
```

Note: nome do arquivo `task-status-enum.ts` corresponde exatamente ao export `TaskStatusEnum`.

## Interface padronizada

```typescript
// interfaces/i-comment.ts
export interface IComment {
  id: string;
  taskId: string;
  content: string;
  createdAt: Date;
}
```

```typescript
// interfaces/i-task-form-controls.ts
export interface ITaskFormControls {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<TaskStatusEnum>;
}
```

## Type derivado de enum

```typescript
// types/task-status.type.ts
import { TaskStatusEnum } from '../enums/task-status-enum';

export type TaskStatus = `${TaskStatusEnum}`;
```

Usar `type TaskStatus` para tipar propriedades e mais limpo que usar `TaskStatusEnum` diretamente.

## Service de estado com BehaviorSubject (padrao completo)

```typescript
// services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<ITask[]>([]);

  // Observable publico — retorna CLONE, nao a instancia original
  get tasks$(): Observable<ITask[]> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => structuredClone(tasks))
    );
  }

  // Metodos de apoio — unico caminho para mutar estado
  addTask(task: ITask): void {
    const current = this.tasksSubject.getValue();
    this.tasksSubject.next([...current, task]);
  }

  updateTaskStatus(id: string, status: TaskStatusEnum): void {
    const updated = this.tasksSubject.getValue().map(task =>
      task.id === id ? { ...task, status } : task
    );
    this.tasksSubject.next(updated);
  }

  removeTask(id: string): void {
    const filtered = this.tasksSubject.getValue().filter(t => t.id !== id);
    this.tasksSubject.next(filtered);
  }
}
```

### Por que clone e nao referencia direta

```typescript
// ERRADO — componente pode mutar o array original
get tasks$(): Observable<ITask[]> {
  return this.tasksSubject.asObservable(); // referencia direta!
}

// CORRETO — componente recebe copia isolada
get tasks$(): Observable<ITask[]> {
  return this.tasksSubject.asObservable().pipe(
    map(tasks => structuredClone(tasks)) // clone!
  );
}
```

## Dialog service centralizado

```typescript
// services/dialog.service.ts
import { Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TaskCommentsModalComponent } from '../components/task-comments-modal/task-comments-modal.component';
import { IComment } from '../interfaces/i-comment';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: Dialog) {}

  openTaskCommentsModal(taskId: string): DialogRef<IComment[]> {
    return this.dialog.open(TaskCommentsModalComponent, {
      data: { taskId },
    });
  }
}
```

### Consumo no componente

```typescript
// Qualquer componente que precise abrir o modal
export class TaskCardComponent {
  constructor(private dialogService: DialogService) {}

  openComments(taskId: string): void {
    const dialogRef = this.dialogService.openTaskCommentsModal(taskId);

    dialogRef.closed.subscribe((comments) => {
      if (comments) {
        // processar comentarios retornados
      }
    });
  }
}
```

## Funcao utilitaria em arquivo isolado

```typescript
// utils/create-id.ts
export function createId(): string {
  return crypto.randomUUID();
}
```

Usada tanto no `TaskService` quanto no componente de comentarios — reutilizacao via `utils/`.

## Limpeza de imports nao utilizados

```typescript
// ANTES — imports desnecessarios apos refatoracao
import { TaskCommentsModalComponent } from './components/task-comments-modal/task-comments-modal.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';

@Component({
  imports: [
    HeaderComponent,
    TaskCardComponent,
    TaskCommentsModalComponent,  // nao usado no template
    TaskFormModalComponent,       // nao usado no template
  ],
})
export class AppComponent {}

// DEPOIS — limpo
@Component({
  imports: [
    HeaderComponent,
    TaskCardComponent,
  ],
})
export class AppComponent {}
```