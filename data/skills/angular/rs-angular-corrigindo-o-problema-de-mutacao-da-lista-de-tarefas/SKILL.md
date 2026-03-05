---
name: rs-angular-corrigindo-mutacao-lista-tarefas
description: "Enforces immutability patterns in Angular RxJS streams using StructuredClone and pipe/map operators. Use when user asks to 'fix mutation bug', 'clone observable data', 'prevent reference sharing', 'protect source of truth', or works with BehaviorSubject data flow. Applies deep cloning via pipe(map()) before subscribe receives data. Make sure to use this skill whenever working with shared state in Angular services using BehaviorSubject or Subject. Not for simple variable assignment, template binding, or non-reactive state management."
---

# Imutabilidade em Streams RxJS (Angular)

> Sempre clone dados emitidos por BehaviorSubjects antes que cheguem ao subscribe, para que componentes nunca recebam referências diretas à fonte de verdade.

## Rules

1. **Nunca exponha referências diretas do BehaviorSubject** — use `.pipe(map())` para clonar antes da emissão, porque componentes com referência direta podem mutar a fonte de verdade silenciosamente
2. **Use StructuredClone para deep clone** — `structuredClone(value)` clona objetos complexos (arrays, objetos aninhados), porque spread/Object.assign só fazem shallow clone
3. **Clone no pipe, nunca no subscribe** — clonar dentro do subscribe ainda recebe a referência original como parâmetro da função anônima, porque o valor já chegou por referência
4. **Aplique o pipe em todos os observables expostos** — se o service expõe `todoTasks$`, `doingTasks$`, `doneTasks$`, todos precisam do pipe com clone, porque esquecer um quebra a imutabilidade
5. **Verifique o observable correto no pipe** — `this.todoTasks.asObservable().pipe(...)` deve referenciar o BehaviorSubject correto, porque é fácil copiar/colar e apontar para o subject errado

## How to write

### Expondo observable com clone via pipe

```typescript
// No service (fonte de verdade)
private todoTasks = new BehaviorSubject<ITask[]>([]);

get todoTasks$(): Observable<ITask[]> {
  return this.todoTasks.asObservable().pipe(
    map(tasks => structuredClone(tasks))
  );
}
```

### Import necessário

```typescript
import { map } from 'rxjs';
```

## Example

**Before (componente muta a fonte de verdade):**
```typescript
// task.service.ts
get todoTasks$(): Observable<ITask[]> {
  return this.todoTasks.asObservable();
}

// component.ts — qualquer alteração aqui muta o service
this.taskService.todoTasks$.subscribe(tasks => {
  tasks[0].title = 'alterado'; // MUTA a fonte de verdade!
});
```

**After (com imutabilidade garantida):**
```typescript
// task.service.ts
get todoTasks$(): Observable<ITask[]> {
  return this.todoTasks.asObservable().pipe(
    map(tasks => structuredClone(tasks))
  );
}

// component.ts — alterações locais não afetam o service
this.taskService.todoTasks$.subscribe(tasks => {
  tasks[0].title = 'alterado'; // só afeta a cópia local
});
```

## Heuristics

| Situação | Ação |
|----------|------|
| Objeto simples (sem aninhamento) | `structuredClone` ou spread `{...obj}` — ambos funcionam |
| Objeto complexo (arrays internos, objetos aninhados) | Obrigatório `structuredClone` — spread não clona filhos |
| Precisa suportar Internet Explorer | Use `JSON.parse(JSON.stringify(obj))` em vez de structuredClone |
| Múltiplos BehaviorSubjects no service | Aplique `.pipe(map(v => structuredClone(v)))` em TODOS |
| Alteração na fonte de verdade | Apenas via métodos do service (addTask, removeTask), nunca por referência direta |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `return this.tasks.asObservable()` (sem pipe) | `return this.tasks.asObservable().pipe(map(t => structuredClone(t)))` |
| `subscribe(tasks => { const copy = structuredClone(tasks) })` | Clone no pipe, não no subscribe |
| `map(tasks => ({...tasks}))` para arrays com objetos | `map(tasks => structuredClone(tasks))` |
| Copiar pipe de outro observable sem verificar o subject | Verificar que `this.doingTasks` aponta para o BehaviorSubject correto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
