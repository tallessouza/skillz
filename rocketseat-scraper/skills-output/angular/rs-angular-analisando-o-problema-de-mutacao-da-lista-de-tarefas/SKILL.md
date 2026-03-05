---
name: rs-angular-mutacao-lista-tarefas
description: "Enforces immutability patterns for Angular BehaviorSubject state management. Use when user asks to 'create a service', 'manage state', 'share data between components', 'use BehaviorSubject', or 'create an observable list'. Prevents mutation bugs where components accidentally modify the source of truth by receiving object references instead of copies. Make sure to use this skill whenever creating Angular services with BehaviorSubject or any reactive state container. Not for template binding, routing, or HTTP request handling."
---

# Imutabilidade em BehaviorSubject Angular

> Subscribers de um BehaviorSubject recebem a referencia do objeto armazenado, nao uma copia — qualquer mutacao no componente altera a fonte de verdade.

## Rules

1. **Nunca exponha a referencia direta do BehaviorSubject** — subscribers que fazem `list[0].name = 'x'` alteram o estado original, porque JavaScript passa objetos por referencia
2. **Emita copias profundas no observable publico** — use `pipe(map(...))` com spread/structuredClone para que componentes recebam copias independentes
3. **Somente o service modifica a fonte de verdade** — componentes consomem copias e pedem alteracoes via metodos do service, nunca mutando diretamente
4. **BehaviorSubject deve ser private** — exponha apenas o observable derivado (com copia), nunca o subject diretamente

## How to write

### Service com estado imutavel

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  // Fonte de verdade — private, nunca exposta
  private todoTasks$ = new BehaviorSubject<Task[]>([]);

  // Observable publico emite COPIAS, nao referencias
  readonly todoTasks = this.todoTasks$.pipe(
    map(tasks => tasks.map(task => ({ ...task })))
  );

  // Somente o service muta a fonte de verdade
  addTask(task: Task): void {
    const current = this.todoTasks$.getValue();
    this.todoTasks$.next([...current, task]);
  }
}
```

### Componente consome sem mutar

```typescript
// Componente recebe copia — mutacoes aqui NAO afetam o service
this.taskService.todoTasks.subscribe(todoList => {
  // Seguro: todoList e uma copia independente
  this.tasks = todoList;
});
```

## Example

**Before (componente muta a fonte de verdade):**

```typescript
// task.service.ts
todoTasks$ = new BehaviorSubject<Task[]>([]);

// task-list.component.ts
this.taskService.todoTasks$.subscribe(todoList => {
  todoList[0].name = 'nome alterado'; // MUTA a fonte de verdade!
  // console.log no service mostra 'nome alterado' — BUG
});
```

**After (componente recebe copia isolada):**

```typescript
// task.service.ts
private todoTasks$ = new BehaviorSubject<Task[]>([]);
readonly todoTasks = this.todoTasks$.pipe(
  map(tasks => tasks.map(t => ({ ...t })))
);

// task-list.component.ts
this.taskService.todoTasks.subscribe(todoList => {
  todoList[0].name = 'nome alterado'; // Muta apenas a copia local
  // Fonte de verdade no service permanece intacta
});
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Objeto tem propriedades aninhadas (nested objects) | Use `structuredClone()` em vez de spread raso |
| Lista so e exibida, nunca modificada no componente | Spread raso (`...task`) e suficiente |
| Multiplos componentes consomem o mesmo subject | Cada subscriber recebe copia independente via `map` |
| Precisa debugar o estado atual | Crie metodo temporario com `console.log(this.subject$.getValue())` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `todoTasks$ = new BehaviorSubject(...)` (public) | `private todoTasks$ = new BehaviorSubject(...)` |
| `this.service.todoTasks$.subscribe(...)` (acesso direto ao subject) | `this.service.todoTasks.subscribe(...)` (observable com copia) |
| `todoList[0].name = 'x'` esperando nao mutar original | Peca ao service: `this.service.updateTask(id, {name: 'x'})` |
| `get tasks() { return this.todoTasks$.getValue() }` | `readonly tasks = this.todoTasks$.pipe(map(...))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
