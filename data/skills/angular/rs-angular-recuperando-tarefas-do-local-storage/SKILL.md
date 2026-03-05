---
name: rs-angular-recuperando-tarefas-local-storage
description: "Applies BehaviorSubject initialization from LocalStorage pattern in Angular services. Use when user asks to 'persist state', 'load from localStorage', 'initialize BehaviorSubject', 'recover data on reload', or 'sync local storage with RxJS'. Enforces inline initialization over constructor/ngOnInit, synchronous loading with error handling, and JSON parse safety. Make sure to use this skill whenever building Angular state management with localStorage persistence. Not for async storage APIs, IndexedDB, or server-side data fetching."
---

# Inicializando BehaviorSubject com LocalStorage

> Inicialize a fonte de verdade (BehaviorSubject) diretamente na declaracao, chamando um metodo sincrono que recupera dados do localStorage.

## Rules

1. **Inicialize inline, nao no construtor nem no ngOnInit** — chame o metodo de carga diretamente no valor inicial do BehaviorSubject, porque assim o dado esta disponivel antes de qualquer subscriber e a fonte de verdade fica facil de localizar para quem da manutencao
2. **Use metodo privado sincrono para carregar** — `localStorage.getItem` e sincrono, entao o metodo retorna o array diretamente sem necessidade de async/await ou Observable
3. **Sempre envolva em try/catch** — `JSON.parse` pode falhar com dados corrompidos; retorne array vazio no catch para nao quebrar a aplicacao
4. **Receba a key como parametro** — o metodo de carga aceita a key do localStorage como argumento, tornando-o reutilizavel para multiplos BehaviorSubjects (toDo, doing, done)
5. **Valide antes de parsear** — verifique se `getItem` retornou valor nao-nulo antes de chamar `JSON.parse`, senao retorne array vazio
6. **Renomeie metodos sem sentido imediatamente** — se um metodo se chama `onRemoveModel` mas remove um comentario, renomeie para `onRemoveComment`, porque clareza do nome e mais importante que evitar churn

## How to write

### Metodo de carga do localStorage

```typescript
private loadTasksFromLocalStorage(key: string): TaskModel[] {
  try {
    const storageTasks = localStorage.getItem(key);
    return storageTasks ? JSON.parse(storageTasks) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas do local storage', error);
    return [];
  }
}
```

### Inicializacao inline do BehaviorSubject

```typescript
private toDoTasks$ = new BehaviorSubject<TaskModel[]>(
  this.loadTasksFromLocalStorage(TaskStatusEnum.toDo)
);
private doingTasks$ = new BehaviorSubject<TaskModel[]>(
  this.loadTasksFromLocalStorage(TaskStatusEnum.doing)
);
private doneTasks$ = new BehaviorSubject<TaskModel[]>(
  this.loadTasksFromLocalStorage(TaskStatusEnum.done)
);
```

## Example

**Before (BehaviorSubject sem persistencia):**
```typescript
private toDoTasks$ = new BehaviorSubject<TaskModel[]>([]);
private doingTasks$ = new BehaviorSubject<TaskModel[]>([]);
private doneTasks$ = new BehaviorSubject<TaskModel[]>([]);
```

**After (com carga do localStorage):**
```typescript
private toDoTasks$ = new BehaviorSubject<TaskModel[]>(
  this.loadTasksFromLocalStorage(TaskStatusEnum.toDo)
);
private doingTasks$ = new BehaviorSubject<TaskModel[]>(
  this.loadTasksFromLocalStorage(TaskStatusEnum.doing)
);
private doneTasks$ = new BehaviorSubject<TaskModel[]>(
  this.loadTasksFromLocalStorage(TaskStatusEnum.done)
);

private loadTasksFromLocalStorage(key: string): TaskModel[] {
  try {
    const storageTasks = localStorage.getItem(key);
    return storageTasks ? JSON.parse(storageTasks) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas do local storage', error);
    return [];
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado precisa estar disponivel antes de qualquer subscribe | Inicialize inline no BehaviorSubject |
| Multiplos BehaviorSubjects com mesma logica de carga | Metodo privado parametrizado pela key |
| localStorage pode ter dados corrompidos | try/catch com fallback para array vazio |
| Metodo com nome que nao descreve a acao real | Renomeie no componente E no template |
| Duvida entre construtor vs inline vs ngOnInit | Prefira inline — mais visivel e executado na criacao |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `ngOnInit() { this.tasks$.next(this.load()) }` | `private tasks$ = new BehaviorSubject(this.load())` |
| `JSON.parse(localStorage.getItem(key))` sem null check | `storageTasks ? JSON.parse(storageTasks) : []` |
| `JSON.parse` sem try/catch | Sempre envolva em try/catch com fallback |
| `loadTasks()` com key hardcoded | `loadTasks(key: string)` parametrizado |
| `onRemoveModel()` para remover comentario | `onRemoveComment()` — nome descreve a acao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
