# Code Examples: AsyncPipe e @let no Angular

## 1. CSS para esconder placeholder do CDK Drag and Drop

```css
/* TaskListSectionComponent.css */
.cdk-drag-placeholder {
  opacity: 0;
}
```

Encontrado inspecionando o DOM durante movimentacao de cards. Remove a duplicacao visual do card ao arrastar.

## 2. Componente ANTES da refatoracao

```typescript
@Component({
  selector: 'app-task-board',
  imports: [/* ... */],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent implements OnInit {
  private taskService = inject(TaskService);

  toDoTasks: Task[] = [];
  doingTasks: Task[] = [];
  doneTasks: Task[] = [];

  ngOnInit() {
    this.taskService.toDoTasks.subscribe(tasks => {
      this.toDoTasks = tasks;
    });
    this.taskService.doingTasks.subscribe(tasks => {
      this.doingTasks = tasks;
    });
    this.taskService.doneTasks.subscribe(tasks => {
      this.doneTasks = tasks;
    });
    // PROBLEMA: nenhum unsubscribe — memory leak potencial
  }
}
```

## 3. Componente DEPOIS da refatoracao

```typescript
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-board',
  imports: [AsyncPipe, /* outros imports */],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent {
  // public (sem private) para acesso no template
  taskService = inject(TaskService);

  // Sem listas locais
  // Sem ngOnInit
  // Sem subscribe manual
}
```

## 4. Template DEPOIS da refatoracao

```html
@let toDoTasks = (taskService.toDoTasks | async) ?? [];
@let doingTasks = (taskService.doingTasks | async) ?? [];
@let doneTasks = (taskService.doneTasks | async) ?? [];

<!-- Uso normal no @for -->
@for (task of toDoTasks; track task.id) {
  <app-task-card [task]="task" />
}

@for (task of doingTasks; track task.id) {
  <app-task-card [task]="task" />
}

@for (task of doneTasks; track task.id) {
  <app-task-card [task]="task" />
}
```

## 5. Service (fonte de verdade — referencia)

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  // Observables que emitem clones da fonte de verdade
  // quando a lista e atualizada
  toDoTasks: Observable<Task[]>;
  doingTasks: Observable<Task[]>;
  doneTasks: Observable<Task[]>;

  addTask(task: Partial<Task>) {
    // Cria nova tarefa
    // Atualiza lista interna
    // Faz emit no observable toDoTasks
    // → AsyncPipe no template recebe automaticamente
  }
}
```

## 6. Fluxo completo: criando uma tarefa

```
1. Usuario clica "Criar tarefa"
2. Componente chama taskService.addTask(...)
3. Service cria objeto, atualiza lista interna, faz emit em toDoTasks
4. AsyncPipe no template recebe novo valor
5. @let toDoTasks atualiza automaticamente
6. @for re-renderiza com a nova tarefa
```

## 7. Variacoes do @let para outros cenarios

```html
<!-- Contagem -->
@let taskCount = (taskService.toDoTasks | async)?.length ?? 0;
<span>{{ taskCount }} tarefas pendentes</span>

<!-- Loading state -->
@let isLoading = (taskService.loading$ | async) ?? true;
@if (isLoading) {
  <app-spinner />
}

<!-- Objeto unico -->
@let currentUser = (authService.user$ | async);
@if (currentUser) {
  <span>Ola, {{ currentUser.name }}</span>
}
```