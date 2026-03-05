# Code Examples: Fonte Unica de Verdade com Services

## Exemplo completo: TaskService como fonte de verdade

### Estrutura do service

```typescript
import { Injectable } from '@angular/core';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  comments: Comment[];
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Fonte de verdade — listas privadas, nunca expostas diretamente
  private todoTasks: Task[] = [];
  private doingTasks: Task[] = [];
  private doneTasks: Task[] = [];

  // Retorna COPIAS — structuredClone cria deep copy
  getTodoTasks(): Task[] {
    return structuredClone(this.todoTasks);
  }

  getDoingTasks(): Task[] {
    return structuredClone(this.doingTasks);
  }

  getDoneTasks(): Task[] {
    return structuredClone(this.doneTasks);
  }

  // Metodos centralizados de gerenciamento
  addTask(task: Task): void {
    this.todoTasks.push(task); // Novas tarefas sempre comecam como todo
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    // Busca em todas as listas, atualiza, move se status mudou
  }

  deleteTask(taskId: string): void {
    this.todoTasks = this.todoTasks.filter(t => t.id !== taskId);
    this.doingTasks = this.doingTasks.filter(t => t.id !== taskId);
    this.doneTasks = this.doneTasks.filter(t => t.id !== taskId);
  }

  addComment(taskId: string, comment: Comment): void {
    // Encontra a tarefa e adiciona o comentario
  }

  deleteComment(taskId: string, commentId: string): void {
    // Encontra a tarefa e remove o comentario
  }
}
```

## Anti-pattern: Lista dentro do componente

### O que NAO fazer

```typescript
// task-list-section.component.ts — ERRADO
@Component({ selector: 'app-task-list-section' })
export class TaskListSectionComponent {
  // Listas armazenadas no componente — acoplamento garantido
  todoTasks: Task[] = [];
  doingTasks: Task[] = [];
  doneTasks: Task[] = [];

  addTask(task: Task): void {
    this.todoTasks.push(task);
  }
}

// welcome-section.component.ts — ERRADO
@Component({ selector: 'app-welcome-section' })
export class WelcomeSectionComponent {
  @Output() newTask = new EventEmitter<Task>();

  createTask(): void {
    const task = { /* ... */ };
    // Precisa emitir para o pai, que repassa para TaskListSection
    this.newTask.emit(task);
  }
}

// main-content.component.ts — ERRADO: intermediario desnecessario
@Component({
  template: `
    <app-welcome-section (newTask)="onNewTask($event)" />
    <app-task-list-section [newTask]="pendingTask" />
  `
})
export class MainContentComponent {
  pendingTask?: Task;

  onNewTask(task: Task): void {
    this.pendingTask = task; // Apenas repassando — zero logica propria
  }
}
```

### O que fazer em vez disso

```typescript
// welcome-section.component.ts — CORRETO
@Component({ selector: 'app-welcome-section' })
export class WelcomeSectionComponent {
  private taskService = inject(TaskService);

  createTask(): void {
    const task = { /* ... */ };
    this.taskService.addTask(task); // Direto, sem intermediarios
  }
}

// task-list-section.component.ts — CORRETO
@Component({ selector: 'app-task-list-section' })
export class TaskListSectionComponent {
  private taskService = inject(TaskService);

  // Copias — pode modificar sem afetar fonte de verdade
  todoTasks = this.taskService.getTodoTasks();
  doingTasks = this.taskService.getDoingTasks();
  doneTasks = this.taskService.getDoneTasks();
}

// main-content.component.ts — CORRETO: sem intermediacao de dados
@Component({
  template: `
    <app-welcome-section />
    <app-task-list-section />
  `
})
export class MainContentComponent {
  // Limpo — sem input/output chains para dados compartilhados
}
```

## Retornando copias vs referencias

### ERRADO: retornando referencia original

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];

  // ERRADO — retorna mesma referencia de memoria
  getTasks(): Task[] {
    return this.tasks;
  }
}

// No componente:
const tasks = taskService.getTasks();
tasks.push({ id: '99', title: 'Fake' }); // MODIFICA a lista original do service!
tasks[0].title = 'Hackeado';             // MODIFICA o objeto original!
```

### CORRETO: retornando deep copy

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];

  // CORRETO — retorna copia com novas referencias
  getTasks(): Task[] {
    return structuredClone(this.tasks);
  }
}

// No componente:
const tasks = taskService.getTasks();
tasks.push({ id: '99', title: 'Fake' }); // So afeta a copia local
tasks[0].title = 'Modificado';            // So afeta a copia local
// Lista original no service: INTACTA
```

## Cenario de refatoracao facilitada

### Com service — mover componente e trivial

```typescript
// ANTES: WelcomeSection dentro de MainContent
// main-content.component.ts
@Component({
  template: `
    <app-welcome-section />
    <app-task-list-section />
  `
})

// DEPOIS: WelcomeSection movido para AppComponent
// app.component.ts
@Component({
  template: `
    <app-welcome-section />
    <app-main-content />
  `
})
// WelcomeSection continua chamando taskService.addTask() — zero mudanca no componente
```

### Sem service — mover componente exige reconfigurar toda a cadeia

```typescript
// Precisa remover @Output do MainContent
// Precisa adicionar @Output no AppComponent
// Precisa reconectar @Input no novo pai
// Precisa testar toda a cadeia novamente
// Alto risco de quebrar fluxo existente
```