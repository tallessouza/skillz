# Code Examples: Roadmap de Projeto Angular — Metodologia GoTask

## Nota

Esta aula e uma apresentacao de roadmap — nao contem codigo direto. Os exemplos abaixo ilustram como aplicar cada fase na pratica com Angular 19.

## Fase 1: Setup do projeto

```bash
# Criar projeto Angular 19
ng new gotask --style=scss --routing=true

# Instalar Angular Material
ng add @angular/material

# Instalar Prettier
npm install --save-dev prettier

# Configurar Prettier (.prettierrc)
echo '{ "singleQuote": true, "trailingComma": "all" }' > .prettierrc
```

## Fase 2: Layout com valores hardcoded

```typescript
// task-card.component.ts — apenas layout, sem logica
@Component({
  selector: 'app-task-card',
  template: `
    <mat-card class="w-full md:w-80">
      <mat-card-header>
        <mat-card-title>Tarefa de exemplo</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Descricao hardcoded da tarefa</p>
        <span class="text-sm text-gray-500">2 comentarios</span>
      </mat-card-content>
    </mat-card>
  `,
})
export class TaskCardComponent {}
```

## Fase 3: Documentacao do fluxo de dados

```
┌─────────────┐
│  AppComponent│
└──────┬──────┘
       │
┌──────▼──────┐     ┌──────────────┐
│ BoardComponent├────►  TaskService  │
└──────┬──────┘     └──────────────┘
       │
┌──────▼──────┐
│ColumnComponent│
└──────┬──────┘
       │
┌──────▼──────┐
│TaskCardComponent│
└─────────────┘

Fluxo: TaskService → BoardComponent → ColumnComponent → TaskCardComponent
Eventos: TaskCardComponent → (emit) → ColumnComponent → (emit) → BoardComponent → TaskService
```

## Fase 4: Logica nos componentes

```typescript
// board.component.ts — com logica e injecao de service
@Component({ selector: 'app-board' })
export class BoardComponent {
  private taskService = inject(TaskService);

  tasks = this.taskService.getTasks();

  onTaskCreated(task: Task) {
    this.taskService.createTask(task);
  }

  onTaskDeleted(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  onTaskMoved(event: { taskId: string; targetColumn: string }) {
    this.taskService.moveTask(event.taskId, event.targetColumn);
  }
}
```

## Fase 5: Persistencia no Local Storage

```typescript
// task.service.ts — com persistencia
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'gotask_tasks';

  private tasks = signal<Task[]>(this.loadFromStorage());

  private loadFromStorage(): Task[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
  }

  createTask(task: Task) {
    this.tasks.update(tasks => [...tasks, task]);
    this.saveToStorage();
  }
}
```