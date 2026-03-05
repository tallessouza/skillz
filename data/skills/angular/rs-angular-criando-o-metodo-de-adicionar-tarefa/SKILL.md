---
name: rs-angular-metodo-adicionar-tarefa
description: "Applies BehaviorSubject pattern for adding items to reactive lists in Angular services. Use when user asks to 'add item to list', 'create task method', 'update BehaviorSubject', 'emit new value', or 'subscribe to observable list'. Enforces non-destructive list updates via spread operator and .next(). Make sure to use this skill whenever working with BehaviorSubject state management in Angular services. Not for HTTP requests, form validation, or NgRx/signal-based state management."
---

# Criando Metodo de Adicionar com BehaviorSubject

> Ao adicionar itens a uma lista reativa, preserve a lista atual e acrescente o novo item sem substituir o estado existente.

## Rules

1. **Nunca substitua a lista inteira** — use spread operator `[...currentList, newItem]` no `.next()`, porque substituir descarta itens ja cadastrados
2. **Acesse o valor atual via `.value`** — use `this.subject$.value` para obter o snapshot atual do BehaviorSubject, porque `.getValue()` e `.value` sao as unicas formas sincronas de ler o estado
3. **Construa o objeto completo antes de emitir** — crie uma constante tipada com todas as propriedades antes de chamar `.next()`, porque garante type safety e legibilidade
4. **Use destructuring para copiar propriedades do form** — `...taskInfos` extrai name/description do formulario, porque evita atribuicao manual campo a campo
5. **Gere IDs unicos no service** — o service e responsavel por gerar o ID, nao o componente, porque centraliza a logica de criacao
6. **Inscreva-se no ngOnInit** — faca o subscribe no lifecycle hook, nao no constructor, porque o componente precisa estar inicializado

## How to write

### Service method que adiciona item

```typescript
// No service: metodo que adiciona sem substituir a lista
addTask(taskInfos: ITaskFormControls): void {
  const newTask: ITask = {
    ...taskInfos,
    status: TaskStatusEnum.TODO,
    id: generateUniqueIdWithTimestamp(),
    comments: [],
  };

  const currentList = this.todoTasks$.value;
  this.todoTasks$.next([...currentList, newTask]);
}
```

### Componente que chama o service

```typescript
// No componente que dispara a criacao
dialogRef.afterClosed().subscribe((taskForm: ITaskFormControls | undefined) => {
  if (taskForm) {
    this._taskService.addTask(taskForm);
  }
});
```

### Componente que se inscreve na lista

```typescript
// No componente que exibe a lista
ngOnInit(): void {
  this._taskService.todoTasks$
    .subscribe((todoList) => {
      console.log('Lista de to-dos:', todoList);
      // atualizar propriedade local do componente
    });
}
```

## Example

**Before (substituindo a lista inteira):**
```typescript
addTask(taskInfos: ITaskFormControls): void {
  const newTask: ITask = { ...taskInfos, status: TaskStatusEnum.TODO };
  // ERRADO: substitui toda a lista, perde itens anteriores
  this.todoTasks$.next([newTask]);
}
```

**After (preservando a lista atual):**
```typescript
addTask(taskInfos: ITaskFormControls): void {
  const newTask: ITask = {
    ...taskInfos,
    status: TaskStatusEnum.TODO,
    id: generateUniqueIdWithTimestamp(),
    comments: [],
  };
  const currentList = this.todoTasks$.value;
  this.todoTasks$.next([...currentList, newTask]);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Adicionar item a lista reativa | `.value` + spread + `.next()` |
| Dialog/modal retorna dados | Validar `if (result)` antes de chamar service |
| BehaviorSubject recem criado | Lembrar que emite valor inicial (array vazio) no primeiro subscribe |
| Inscricao manual no subscribe | Marcar como temporaria, substituir por `async` pipe depois |
| Objeto novo precisa de ID | Gerar no service, nunca no componente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.subject$.next([newItem])` | `this.subject$.next([...this.subject$.value, newItem])` |
| `this.subject$.next(newItem)` quando subject e array | `this.subject$.next([...current, newItem])` |
| Gerar ID no componente | Gerar ID no service com funcao utilitaria |
| Subscribe no constructor | Subscribe no `ngOnInit()` |
| Chamar service sem validar retorno do dialog | `if (taskForm) { this.service.addTask(taskForm) }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
