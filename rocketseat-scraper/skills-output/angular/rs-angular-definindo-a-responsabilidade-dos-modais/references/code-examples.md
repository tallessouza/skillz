# Code Examples: Responsabilidade de Modais

## Exemplo 1: Modal de criacao de tarefa

### Interface de dados

```typescript
export interface TaskFormModalData {
  name: string;
  description: string;
}

export interface TaskFormModalResult {
  name: string;
  description: string;
}
```

### Modal component

```typescript
@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent {
  private dialogRef = inject(MatDialogRef<TaskFormModalComponent>);
  data: TaskFormModalData = inject(MAT_DIALOG_DATA);

  name = this.data.name;
  description = this.data.description;

  onSave(): void {
    this.dialogRef.close({
      name: this.name,
      description: this.description,
    } satisfies TaskFormModalResult);
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }
}
```

### Componente pai abrindo para criacao

```typescript
@Component({ /* ... */ })
export class WelcomeSectionComponent {
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);

  openCreateTask(): void {
    const dialogRef = this.dialog.open<
      TaskFormModalComponent,
      TaskFormModalData,
      TaskFormModalResult
    >(TaskFormModalComponent, {
      data: { name: '', description: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.createTask(result.name, result.description);
      }
    });
  }
}
```

### Componente pai abrindo para edicao

```typescript
openEditTask(task: Task): void {
  const dialogRef = this.dialog.open<
    TaskFormModalComponent,
    TaskFormModalData,
    TaskFormModalResult
  >(TaskFormModalComponent, {
    data: { name: task.name, description: task.description },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.taskService.updateTask(task.id, result.name, result.description);
    }
  });
}
```

## Exemplo 2: Modal de comentarios

### Interface de dados

```typescript
export interface TaskCommentsModalData {
  task: Task; // copia, nao referencia
}

export interface TaskCommentsModalResult {
  hasChanges: boolean;
  comments: Comment[];
}
```

### Modal component

```typescript
@Component({
  selector: 'app-task-comments-modal',
  templateUrl: './task-comments-modal.component.html',
})
export class TaskCommentsModalComponent {
  private dialogRef = inject(MatDialogRef<TaskCommentsModalComponent>);
  data: TaskCommentsModalData = inject(MAT_DIALOG_DATA);

  // Trabalha com copia local
  comments = [...this.data.task.comments];
  hasChanges = false;

  addComment(text: string): void {
    this.comments.push({ text, createdAt: new Date() });
    this.hasChanges = true;
  }

  removeComment(index: number): void {
    this.comments.splice(index, 1);
    this.hasChanges = true;
  }

  onClose(): void {
    this.dialogRef.close({
      hasChanges: this.hasChanges,
      comments: this.comments,
    } satisfies TaskCommentsModalResult);
  }
}
```

### TaskCardComponent (pai)

```typescript
@Component({ /* ... */ })
export class TaskCardComponent {
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);

  @Input() task!: Task;

  openComments(): void {
    const dialogRef = this.dialog.open<
      TaskCommentsModalComponent,
      TaskCommentsModalData,
      TaskCommentsModalResult
    >(TaskCommentsModalComponent, {
      data: { task: { ...this.task } }, // COPIA
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.hasChanges) {
        this.taskService.updateComments(this.task.id, result.comments);
      }
    });
  }
}
```

## Exemplo 3: Modal de confirmacao de exclusao

```typescript
// Modal simples — devolve boolean
@Component({ /* ... */ })
export class ConfirmDeleteModalComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDeleteModalComponent>);
  data = inject<{ taskName: string }>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

// Pai
deleteTask(task: Task): void {
  const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
    data: { taskName: task.name },
  });

  dialogRef.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      this.taskService.deleteTask(task.id);
    }
  });
}
```

## Anti-pattern completo: modal que faz tudo

```typescript
// ERRADO — modal com responsabilidade demais
@Component({ /* ... */ })
export class TaskFormModalComponent {
  private dialogRef = inject(MatDialogRef);
  private taskService = inject(TaskService); // NAO DEVERIA ESTAR AQUI
  private snackBar = inject(MatSnackBar);    // NAO DEVERIA ESTAR AQUI
  data = inject(MAT_DIALOG_DATA);

  onSave(): void {
    // Modal chamando service diretamente — quebra rastreabilidade
    this.taskService.createTask(this.name, this.description);
    this.snackBar.open('Tarefa criada!');
    this.dialogRef.close();
    // O componente pai nao sabe que uma tarefa foi criada
    // Se precisar trocar esse modal, precisa replicar toda essa logica
  }
}
```