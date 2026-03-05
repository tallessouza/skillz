# Code Examples: Organizacao de Projeto Angular — GoTask

## Arquitetura geral do projeto

O GoTask e um quadro Kanban com tres colunas (To Do, Doing, Done) que permite:
- Criar tarefas
- Mover tarefas entre colunas (drag-and-drop, atualizando status)
- Editar nome e descricao de tarefas
- Adicionar e remover comentarios
- Deletar tarefas
- Persistir tudo no localStorage

## Fonte de verdade — Service centralizado

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'gotask-tasks';

  private tasks = signal<Task[]>(this.loadFromLocalStorage());

  // Listas derivadas por status
  readonly todoTasks = computed(() =>
    this.tasks().filter(task => task.status === 'todo')
  );
  readonly doingTasks = computed(() =>
    this.tasks().filter(task => task.status === 'doing')
  );
  readonly doneTasks = computed(() =>
    this.tasks().filter(task => task.status === 'done')
  );

  addTask(task: Omit<Task, 'id'>) {
    const newTask: Task = { ...task, id: crypto.randomUUID() };
    this.tasks.update(tasks => [...tasks, newTask]);
    this.syncLocalStorage();
  }

  updateTask(taskId: string, changes: Partial<Task>) {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, ...changes } : task
      )
    );
    this.syncLocalStorage();
  }

  moveTask(taskId: string, newStatus: TaskStatus) {
    this.updateTask(taskId, { status: newStatus });
  }

  deleteTask(taskId: string) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
    this.syncLocalStorage();
  }

  private syncLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
  }

  private loadFromLocalStorage(): Task[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
```

## Modal reutilizado — Angular Material Dialog

```typescript
// Abrir modal para criar
openCreateDialog() {
  const dialogRef = this.dialog.open(TaskDialogComponent, {
    data: { mode: 'create' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.taskService.addTask(result);
    }
  });
}

// Abrir modal para editar (mesmo componente, dados diferentes)
openEditDialog(task: Task) {
  const dialogRef = this.dialog.open(TaskDialogComponent, {
    data: { mode: 'edit', task }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.taskService.updateTask(task.id, result);
    }
  });
}
```

### Componente do modal

```typescript
@Component({
  selector: 'app-task-dialog',
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa' }}
    </h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nome</mat-label>
        <input matInput [formControl]="nameControl">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Descricao</mat-label>
        <textarea matInput [formControl]="descriptionControl"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-button
              [disabled]="nameControl.invalid"
              (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `
})
export class TaskDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);

  nameControl = new FormControl(
    this.data.task?.name ?? '',
    Validators.required
  );
  descriptionControl = new FormControl(
    this.data.task?.description ?? ''
  );

  save() {
    this.dialogRef.close({
      name: this.nameControl.value,
      description: this.descriptionControl.value,
    });
  }
}
```

## FormControl isolado para comentarios

```typescript
@Component({
  template: `
    <input [formControl]="commentControl"
           placeholder="Adicionar comentario">
    <button [disabled]="commentControl.invalid"
            [class.btn-disabled]="commentControl.invalid"
            [class.btn-active]="commentControl.valid"
            (click)="addComment()">
      Adicionar
    </button>
  `
})
export class TaskDetailComponent {
  commentControl = new FormControl('', Validators.required);

  addComment() {
    const comment = this.commentControl.value;
    // Adiciona ao service / fonte de verdade
    this.taskService.addComment(this.taskId, comment);
    this.commentControl.reset();
  }
}
```

## Drag-and-drop com atualizacao de status

```typescript
// Ao mover tarefa entre colunas
onDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
  const task = event.previousContainer.data[event.previousIndex];
  this.taskService.moveTask(task.id, newStatus);
}
```

## Modelo de dados

```typescript
type TaskStatus = 'todo' | 'doing' | 'done';

interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: Date;
}
```