# Code Examples: Comentarios no Modal e Fonte de Verdade

## Exemplo completo: TaskCommentsModalComponent (classe)

```typescript
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { IComment } from '../../interfaces/comment.interface';
import { ITask } from '../../interfaces/task.interface';
import { generateUniqueId } from '../../utils/generate-unique-id';

@Component({
  selector: 'app-task-comments-modal',
  templateUrl: './task-comments-modal.component.html',
})
export class TaskCommentsModalComponent {
  private readonly _dialogRef = inject(DialogRef<boolean>);
  _task!: ITask;

  commentControl = new FormControl('');
  taskCommentsChanged = false;

  onAddComment(): void {
    // Criar novo comentario com ID unico
    const newComment: IComment = {
      id: generateUniqueId(),
      description: this.commentControl.value
        ? this.commentControl.value
        : '',
    };

    // Adicionar no inicio da lista (mais recente primeiro)
    this._task.comments.unshift(newComment);

    // Resetar o input
    this.commentControl.reset();

    // Sinalizar que houve mudanca
    this.taskCommentsChanged = true;
  }

  onCloseModal(): void {
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
```

## Exemplo completo: Template do modal (botao fechar)

```html
<div class="modal-header">
  <h2>Comentarios</h2>
  <img
    src="assets/icons/close.svg"
    alt="Fechar"
    (click)="onCloseModal()"
  />
</div>
```

## Exemplo completo: TaskCardComponent (abrindo modal e reagindo)

```typescript
import { Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskCommentsModalComponent } from '../task-comments-modal/task-comments-modal.component';
import { TaskService } from '../../services/task.service';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _taskService = inject(TaskService);

  task!: ITask;

  openTaskCommentsModal(): void {
    const dialogRef = this._dialog.open(TaskCommentsModalComponent, {
      data: { task: this.task },
    });

    dialogRef.closed.subscribe((taskCommentsChanged) => {
      if (taskCommentsChanged) {
        // Atualizar fonte de verdade no service
        this._taskService.updateTaskComments(
          this.task.id,
          this.task.status,
          this.task.comments
        );
      }
    });
  }
}
```

## Variacao: E se voce precisar retornar os comentarios em vez de boolean?

```typescript
// No modal — retorna a lista de comentarios
private readonly _dialogRef = inject(DialogRef<IComment[]>);

onCloseModal(): void {
  this._dialogRef.close(this._task.comments);
}

// No pai — recebe a lista
dialogRef.closed.subscribe((comments) => {
  if (comments && comments.length > 0) {
    this._taskService.updateTaskComments(
      this.task.id,
      this.task.status,
      comments
    );
  }
});
```

## Variacao: Tratamento null com operador nullish coalescing

```typescript
// Alternativa ao ternario — mais conciso
const newComment: IComment = {
  id: generateUniqueId(),
  description: this.commentControl.value ?? '',
};
```

## Exemplo: generateUniqueId (funcao utilitaria)

```typescript
// utils/generate-unique-id.ts
export function generateUniqueId(): string {
  return crypto.randomUUID();
}
```

## Exemplo: Interface IComment

```typescript
// interfaces/comment.interface.ts
export interface IComment {
  id: string;
  description: string;
}
```

## Exemplo: TaskService.updateTaskComments

```typescript
// services/task.service.ts (metodo relevante)
updateTaskComments(
  taskId: string,
  status: string,
  comments: IComment[]
): void {
  // Localiza a task na fonte de verdade e atualiza seus comentarios
  const tasks = this._tasks().get(status);
  if (tasks) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.comments = comments;
    }
  }
}
```