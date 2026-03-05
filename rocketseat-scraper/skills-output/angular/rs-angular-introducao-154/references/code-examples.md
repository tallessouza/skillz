# Code Examples: Definicao de Fluxo de Dados em Angular

## Exemplo completo: Planejamento de um Task Manager (GoTask)

### Passo 1: Definir o modelo

```typescript
// models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}
```

### Passo 2: Definir o service centralizado

```typescript
// services/task.service.ts
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = signal<Task[]>([]);

  getAllTasks(): Signal<Task[]> {
    return this.tasks.asReadonly();
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  removeTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  toggleTask(id: string): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }
}
```

### Passo 3: Mapear responsabilidades dos componentes

```
AppComponent
│
├── HeaderComponent
│     └── (botao "Nova Tarefa" → abre modal de criacao)
│
├── TaskListComponent
│     ├── injeta TaskService.getAllTasks()
│     ├── renderiza lista
│     └── TaskItemComponent (cada item)
│           ├── botao completar → TaskService.toggleTask()
│           ├── botao editar → abre modal de edicao
│           └── botao remover → TaskService.removeTask()
│
├── CreateTaskModalComponent
│     ├── aberto por: HeaderComponent
│     ├── formulario de criacao
│     └── submit → TaskService.addTask()
│
└── EditTaskModalComponent
      ├── aberto por: TaskItemComponent
      ├── recebe Task atual
      └── submit → TaskService.updateTask()
```

### Passo 4: Diagrama de fluxo de dados (texto)

```
Usuario clica "Nova Tarefa"
  → HeaderComponent emite evento
  → AppComponent abre CreateTaskModalComponent
  → Usuario preenche formulario
  → CreateTaskModalComponent chama TaskService.addTask()
  → TaskService atualiza signal
  → TaskListComponent reage automaticamente (signal)
  → UI atualizada
```

### Template reutilizavel para outros projetos

```
1. Definir interfaces/modelos em models/
2. Criar service centralizado em services/
3. Desenhar arvore de componentes com responsabilidades
4. Mapear: "quem abre o que" para modais/dialogs
5. Documentar fluxo: acao do usuario → componente → service → estado → UI
```