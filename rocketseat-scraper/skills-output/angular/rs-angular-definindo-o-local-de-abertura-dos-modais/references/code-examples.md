# Code Examples: Centralizar Abertura de Modais em Services

## Exemplo basico do Angular Material Dialog

Conforme mostrado na documentacao e na aula:

```typescript
// Injetar o service do Angular Material
private dialog = inject(Dialog);

// Abrir um modal
const dialogRef = this.dialog.open(UserProfileComponent, {
  width: '250px',
  data: { name: 'João' },
});

// Reagir ao fechamento
dialogRef.closed.subscribe((result) => {
  console.log('Modal fechou com:', result);
});
```

## Service completo para o projeto GoTask

```typescript
import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';
import { TaskFormModalComponent } from './task-form-modal.component';
import { TaskCommentsModalComponent } from './task-comments-modal.component';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskModalService {
  private dialog = inject(Dialog);

  private readonly defaultConfig = {
    width: '500px',
  };

  openTaskCreation(): Observable<Task | undefined> {
    const dialogRef = this.dialog.open(TaskFormModalComponent, {
      ...this.defaultConfig,
      data: { mode: 'create' },
    });
    return dialogRef.closed;
  }

  openTaskEdition(task: Task): Observable<Task | undefined> {
    const dialogRef = this.dialog.open(TaskFormModalComponent, {
      ...this.defaultConfig,
      data: { mode: 'edit', task },
    });
    return dialogRef.closed;
  }

  openTaskComments(taskId: string): Observable<void> {
    const dialogRef = this.dialog.open(TaskCommentsModalComponent, {
      ...this.defaultConfig,
      width: '600px',
      data: { taskId },
    });
    return dialogRef.closed;
  }
}
```

## Componentes que disparam os modais

### WelcomeSectionComponent (botao "Criar tarefa")

```typescript
@Component({
  selector: 'app-welcome-section',
  template: `<button (click)="onCreateTask()">Criar uma tarefa</button>`,
})
export class WelcomeSectionComponent {
  private taskModalService = inject(TaskModalService);

  onCreateTask(): void {
    this.taskModalService.openTaskCreation().subscribe((newTask) => {
      if (newTask) {
        // tarefa criada com sucesso
      }
    });
  }
}
```

### TaskCardComponent (botoes "Editar" e "Comentarios")

```typescript
@Component({
  selector: 'app-task-card',
  template: `
    <button (click)="onEdit()">Editar</button>
    <button (click)="onComments()">Comentários</button>
  `,
})
export class TaskCardComponent {
  @Input() task!: Task;
  private taskModalService = inject(TaskModalService);

  onEdit(): void {
    this.taskModalService.openTaskEdition(this.task).subscribe((updated) => {
      if (updated) {
        // atualizar estado local
      }
    });
  }

  onComments(): void {
    this.taskModalService.openTaskComments(this.task.id).subscribe();
  }
}
```

## Variacao: passando dados para o modal

O Angular Material Dialog permite enviar dados via `data` no config. Dentro do modal component, injete com `DIALOG_DATA`:

```typescript
@Component({ /* ... */ })
export class TaskFormModalComponent {
  private data = inject(DIALOG_DATA) as { mode: 'create' | 'edit'; task?: Task };

  get isEditing(): boolean {
    return this.data.mode === 'edit';
  }
}
```

## Variacao: modal com config diferente por contexto

Se um modal precisa de largura diferente dependendo do contexto, parametrize no service:

```typescript
openTaskEdition(task: Task, options?: { fullScreen?: boolean }): Observable<Task | undefined> {
  const dialogRef = this.dialog.open(TaskFormModalComponent, {
    width: options?.fullScreen ? '100vw' : '500px',
    data: { mode: 'edit', task },
  });
  return dialogRef.closed;
}
```