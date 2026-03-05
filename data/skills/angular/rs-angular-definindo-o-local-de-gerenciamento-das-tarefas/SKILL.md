---
name: rs-angular-fonte-unica-de-verdade-services
description: "Enforces single source of truth pattern using Angular services instead of component-level state. Use when user asks to 'manage state', 'store a list', 'share data between components', 'create a service', or 'avoid input output chaining' in Angular. Applies rules: never store shared lists in components, use services as centralized state, return copies to prevent mutation, avoid input/output coupling chains. Make sure to use this skill whenever designing data flow or state management in Angular applications. Not for component-specific UI state like show/hide toggles or template-only properties."
---

# Fonte Unica de Verdade com Services no Angular

> Dados compartilhados vivem em services, nunca em componentes. Componentes consomem copias, nunca referencias originais.

## Rules

1. **Nunca armazene listas compartilhadas em componentes** — componentes gerenciam apenas visualizacao e propriedades do template, porque armazenar estado compartilhado cria acoplamento via input/output chains que torna refatoracao impossivel
2. **Use um service como fonte unica de verdade** — services tem instancia unica (singleton) acessivel por qualquer componente via injecao, porque elimina a necessidade de passar dados por cadeia de input/output entre componentes pai/filho
3. **Retorne copias, nunca referencias originais** — todo metodo que expoe listas ou objetos do service deve retornar deep copies com novas referencias de memoria, porque componentes podem modificar objetos livremente sem corromper a fonte de verdade
4. **Centralize metodos de gerenciamento no service** — adicionar, atualizar, deletar tarefas sao metodos do service, porque qualquer componente pode invocar esses metodos sem precisar conhecer a hierarquia de componentes
5. **Componentes sao consumidores, nao donos** — um componente injeta o service, consome copias e chama metodos, porque isso permite mover componentes livremente na arvore sem quebrar fluxo de dados

## How to write

### Service como fonte de verdade

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks: Task[] = [];
  private doingTasks: Task[] = [];
  private doneTasks: Task[] = [];

  // Retorna COPIA, nunca a referencia original
  getTodoTasks(): Task[] {
    return structuredClone(this.todoTasks);
  }

  addTask(task: Task): void {
    this.todoTasks.push(task);
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    // Gerenciamento centralizado no service
  }
}
```

### Componente consumindo o service

```typescript
@Component({ /* ... */ })
export class TaskListSectionComponent {
  private taskService = inject(TaskService);

  // Consome copia — pode modificar livremente sem afetar fonte de verdade
  todoTasks = this.taskService.getTodoTasks();
}
```

## Example

**Before (estado no componente com input/output chain):**

```typescript
// welcome-section.component.ts — cria tarefa
@Output() newTask = new EventEmitter<Task>();
// Emite para MainContent, que repassa via @Input para TaskListSection
// Acoplamento: Welcome → MainContent → TaskListSection

// task-list-section.component.ts — armazena lista
@Input() newTask!: Task;
todoTasks: Task[] = [];
// Cada componente que precisa da lista exige nova chain de input/output
```

**After (service como fonte de verdade):**

```typescript
// welcome-section.component.ts — cria tarefa
private taskService = inject(TaskService);

createTask(task: Task): void {
  this.taskService.addTask(task); // Direto, sem output chain
}

// task-list-section.component.ts — consome lista
private taskService = inject(TaskService);
todoTasks = this.taskService.getTodoTasks(); // Copia independente
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Dado consumido por 2+ componentes | Colocar no service |
| Dado exclusivo do template de um componente (show/hide) | Manter no componente |
| Componente precisa modificar lista para renderizacao | Modificar a copia local, nunca a fonte |
| Novo componente precisa acessar dados existentes | Injetar o service, sem criar input/output |
| Refatorando hierarquia de componentes | Se dados estao no service, mover componentes e livre |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `@Input()` chain para passar listas entre 3+ niveis | `inject(TaskService)` direto no componente que precisa |
| `@Output()` chain para enviar dados ao componente que gerencia a lista | Chamar `taskService.addTask()` direto do componente que cria |
| Retornar `this.tasks` (referencia original) do service | Retornar `structuredClone(this.tasks)` (copia) |
| Componente modificando objeto do service diretamente | Componente chama metodo do service para modificar |
| Multiplos componentes com copias da mesma lista gerenciada localmente | Um unico service como fonte de verdade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
