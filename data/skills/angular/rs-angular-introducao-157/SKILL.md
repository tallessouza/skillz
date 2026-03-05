---
name: rs-angular-introducao-157
description: "Applies LocalStorage persistence patterns when building Angular apps that need client-side state survival across browser sessions. Use when user asks to 'save state locally', 'persist tasks', 'use localStorage in Angular', 'keep data after refresh', or 'store app state in browser'. Ensures CRUD operations (create, delete, update) sync to LocalStorage. Make sure to use this skill whenever implementing browser-based persistence in Angular without a backend. Not for server-side storage, IndexedDB, cookies, or session storage patterns."
---

# LocalStorage para Persistencia de Estado em Angular

> Sincronize cada mutacao de estado (criar, excluir, atualizar) com o LocalStorage para que o usuario nunca perca dados ao fechar o navegador.

## Rules

1. **Persista em toda mutacao** — salve no LocalStorage apos cada create, delete e update, porque o usuario espera que o estado sobreviva ao refresh
2. **Use uma unica chave por dominio** — `localStorage.setItem('tasks', JSON.stringify(tasks))`, porque multiplas chaves fragmentam o estado e dificultam a limpeza
3. **Carregue no init** — leia do LocalStorage na inicializacao do componente ou service, porque o estado precisa estar disponivel antes do primeiro render
4. **Serialize como JSON** — sempre `JSON.stringify` ao salvar e `JSON.parse` ao ler, porque LocalStorage so aceita strings
5. **Trate ausencia de dados** — se a chave nao existir, retorne array vazio ou estado default, porque primeiro acesso nao tera dados salvos

## How to write

### Service de persistencia

```typescript
@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  private readonly STORAGE_KEY = 'goTask_tasks';

  loadTasks(): Task[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }
}
```

### Sincronizacao apos cada operacao

```typescript
addTask(task: Task): void {
  this.tasks.push(task);
  this.taskStorage.saveTasks(this.tasks);
}

removeTask(taskId: string): void {
  this.tasks = this.tasks.filter(task => task.id !== taskId);
  this.taskStorage.saveTasks(this.tasks);
}

addComment(taskId: string, comment: string): void {
  const task = this.tasks.find(t => t.id === taskId);
  if (task) {
    task.comments.push(comment);
    this.taskStorage.saveTasks(this.tasks);
  }
}
```

## Example

**Before (estado perdido ao reabrir navegador):**
```typescript
export class TaskListComponent {
  tasks: Task[] = [];

  addTask(task: Task) {
    this.tasks.push(task); // perdido no refresh
  }
}
```

**After (estado persistido no LocalStorage):**
```typescript
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskStorage: TaskStorageService) {}

  ngOnInit() {
    this.tasks = this.taskStorage.loadTasks();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.taskStorage.saveTasks(this.tasks);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App sem backend | LocalStorage como persistencia primaria |
| App com backend | LocalStorage como cache/offline fallback |
| Dados sensiveis (tokens, senhas) | Nunca use LocalStorage — use httpOnly cookies |
| Dados > 5MB | Considere IndexedDB em vez de LocalStorage |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar so na memoria do componente | Sincronizar com LocalStorage apos cada mutacao |
| Multiplas chaves para mesmo dominio (`task_1`, `task_2`) | Uma chave com array serializado (`tasks`) |
| `localStorage.getItem()` sem fallback | `JSON.parse(stored) ?? []` com valor default |
| Salvar objetos sem stringify | `JSON.stringify(data)` sempre |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
