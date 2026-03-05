# Code Examples: Mutação em BehaviorSubject Angular

## Exemplo 1: Reproduzindo o bug (do video)

### Task Service original (vulneravel)

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks$ = new BehaviorSubject<TodoTask[]>([]);

  // Observable expoe referencia direta — PROBLEMA
  get todoTasks() {
    return this.todoTasks$.asObservable();
  }

  // Metodo temporario para debug
  carregarListaAtualDeTodos(): void {
    console.log('lista atual to dos', this.todoTasks$.getValue());
  }
}
```

### Componente que muta acidentalmente

```typescript
// task-list-section.component.ts
ngOnInit() {
  this.taskService.todoTasks.subscribe(todoList => {
    // Mutacao direta — altera a fonte de verdade!
    todoList[0].name = 'nome alterado';

    // Verifica se a fonte de verdade foi afetada
    this.taskService.carregarListaAtualDeTodos();
    // Output: "lista atual to dos" -> [{name: 'nome alterado', ...}]
    // BUG CONFIRMADO: fonte de verdade foi mutada pelo componente
  });
}
```

## Exemplo 2: Correcao com spread operator (shallow copy)

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks$ = new BehaviorSubject<TodoTask[]>([]);

  // Cada subscriber recebe uma copia independente
  readonly todoTasks = this.todoTasks$.pipe(
    map(tasks => tasks.map(task => ({ ...task })))
  );

  addTask(task: TodoTask): void {
    const current = this.todoTasks$.getValue();
    this.todoTasks$.next([...current, task]);
  }

  removeTask(id: string): void {
    const current = this.todoTasks$.getValue();
    this.todoTasks$.next(current.filter(t => t.id !== id));
  }

  updateTask(id: string, changes: Partial<TodoTask>): void {
    const current = this.todoTasks$.getValue();
    this.todoTasks$.next(
      current.map(t => t.id === id ? { ...t, ...changes } : t)
    );
  }
}
```

## Exemplo 3: Deep copy para objetos aninhados

```typescript
// Se TodoTask tiver objetos aninhados (ex: subtasks, tags como objetos)
readonly todoTasks = this.todoTasks$.pipe(
  map(tasks => structuredClone(tasks))
);
```

## Exemplo 4: Verificando imutabilidade (teste)

```typescript
it('should not mutate source of truth when subscriber modifies data', () => {
  const service = TestBed.inject(TaskService);
  service.addTask({ id: '1', name: 'Original', completed: false });

  service.todoTasks.pipe(take(1)).subscribe(tasks => {
    tasks[0].name = 'Mutated';
  });

  // Fonte de verdade deve manter o valor original
  service.todoTasks.pipe(take(1)).subscribe(tasks => {
    expect(tasks[0].name).toBe('Original');
  });
});
```