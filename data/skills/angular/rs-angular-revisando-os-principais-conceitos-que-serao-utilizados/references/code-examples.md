# Code Examples: Arquitetura de Componentes Angular — GoTask

> Nota: Esta aula e conceitual/introdutoria. Os exemplos abaixo ilustram os padroes descritos pelo instrutor, baseados nos conceitos apresentados.

## 1. Service como fonte de verdade com BehaviorSubject

```typescript
// task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Fonte de verdade — privada, ninguem acessa diretamente
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // Observable publico — componentes se inscrevem aqui
  tasks$ = this.tasksSubject.asObservable();

  // Derivacoes com operadores RxJS
  todoTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === 'todo'))
  );

  addTask(task: Task): void {
    const currentTasks = this.tasksSubject.getValue();
    // Spread para criar novo array (imutabilidade)
    this.tasksSubject.next([...currentTasks, task]);
  }

  updateTaskStatus(taskId: string, status: Task['status']): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    );
    this.tasksSubject.next(updatedTasks);
  }
}
```

## 2. Componente consumindo service via inject() e async pipe

```typescript
// task-board.component.ts
import { Component, inject } from '@angular/core';
import { TaskService } from './task.service';
import { TaskColumnComponent } from './task-column.component';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [TaskColumnComponent],
  template: `
    @let tasks = taskService.tasks$ | async;

    @if (tasks) {
      <app-task-column
        title="To Do"
        [tasks]="tasks | filterByStatus:'todo'"
      />
      <app-task-column
        title="Doing"
        [tasks]="tasks | filterByStatus:'doing'"
      />
      <app-task-column
        title="Done"
        [tasks]="tasks | filterByStatus:'done'"
      />
    }
  `
})
export class TaskBoardComponent {
  taskService = inject(TaskService);
}
```

## 3. Imutabilidade — certo vs errado

```typescript
// ERRADO: mutacao direta da referencia
updateTask(tasks: Task[], taskId: string): void {
  const task = tasks.find(t => t.id === taskId);
  task!.status = 'done'; // Muta o objeto original!
}

// CERTO: criar nova copia
updateTask(tasks: Task[], taskId: string): Task[] {
  return tasks.map(task =>
    task.id === taskId ? { ...task, status: 'done' } : task
  );
}
```

## 4. Nova sintaxe de controle Angular

```html
<!-- @if no lugar de *ngIf -->
@if (tasks.length > 0) {
  <div class="task-list">
    <!-- @for no lugar de *ngFor -->
    @for (task of tasks; track task.id) {
      <app-task-card [task]="task" />
    }
  </div>
} @else {
  <p>Nenhuma tarefa encontrada.</p>
}

<!-- @let para variaveis no template -->
@let taskCount = tasks.length;
<span>{{ taskCount }} tarefas</span>
```

## 5. Event binding e property binding

```html
<!-- Interpolacao -->
<h2>{{ task.title }}</h2>

<!-- Property binding -->
<button [disabled]="isFormSubmitting">Salvar</button>

<!-- Event binding -->
<button (click)="onAddTask()">Adicionar Tarefa</button>

<!-- Combinados -->
<input
  [value]="taskTitle"
  (input)="onTitleChange($event)"
  [placeholder]="'Digite o titulo da tarefa'"
/>
```

## 6. Estrutura de pastas padronizada

```
src/app/
├── components/
│   ├── task-board/
│   │   ├── task-board.component.ts
│   │   ├── task-board.component.html
│   │   └── task-board.component.css
│   ├── task-column/
│   │   ├── task-column.component.ts
│   │   └── task-column.component.html
│   └── task-card/
│       ├── task-card.component.ts
│       └── task-card.component.html
├── services/
│   └── task.service.ts
├── models/
│   └── task.model.ts
└── pipes/
    └── filter-by-status.pipe.ts
```

## 7. Mobile-first com Tailwind

```html
<!-- Mobile first: estilo base e mobile, breakpoints expandem -->
<div class="flex flex-col gap-4 p-4 md:flex-row md:gap-6 lg:p-8">
  <div class="w-full md:w-1/3">
    <!-- Coluna To Do -->
  </div>
  <div class="w-full md:w-1/3">
    <!-- Coluna Doing -->
  </div>
  <div class="w-full md:w-1/3">
    <!-- Coluna Done -->
  </div>
</div>
```

## 8. Desacoplamento: @Input simples vs service

```typescript
// ACEITAVEL: pai passa config direta para filho
@Component({
  template: `<app-task-card [task]="task" />`
})
export class TaskColumnComponent {
  @Input() task!: Task;
}

// MELHOR para comunicacao complexa: service
@Component({
  template: `
    @let tasks = taskService.todoTasks$ | async;
    @for (task of tasks; track task.id) {
      <app-task-card [task]="task" />
    }
  `
})
export class TodoColumnComponent {
  taskService = inject(TaskService);
}
```